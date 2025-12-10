const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const { connectDB } = require("./config/db.js");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

// -------------------- EXPRESS CORS --------------------
app.set("trust proxy", 1);
app.use(helmet());
app.use(compression());
if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || "*",
  credentials: true
}));

app.use(express.json());
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 1000 });
app.use(limiter);

// -------------------- SETTINGS CACHE + MAINTENANCE MODE --------------------
const Settings = require("./models/Settings");
let SETTINGS_CACHE = null;
let SETTINGS_TS = 0;
async function getSettingsCached() {
  const now = Date.now();
  if (!SETTINGS_CACHE || now - SETTINGS_TS > 60_000) {
    SETTINGS_CACHE = await Settings.findOne({ key: "global" });
    SETTINGS_TS = now;
  }
  return SETTINGS_CACHE;
}

app.use(async (req, res, next) => {
  try {
    const s = await getSettingsCached();
    req.app.locals.settings = s || {};
    // If maintenance mode is on, block non-admin write operations
    if (
      s && s.maintenanceMode &&
      req.method !== "GET" &&
      !(req.originalUrl || "").startsWith("/api/auth/login") &&
      !(req.originalUrl || "").startsWith("/api/auth/me")
    ) {
      const role = (req.user && req.user.role) || null;
      if (role !== "admin") {
        return res.status(503).json({ message: "Site is under maintenance. Please try again later." });
      }
    }
  } catch (e) {}
  next();
});

// -------------------- MODELS --------------------
const Auction = require("./models/Auction.js");
const Bid = require("./models/Bid.js");
const Order = require("./models/Order.js");
const { createNotification } = require("./controllers/notificationController");
const Wishlist = require("./models/Wishlist.js");
const User = require("./models/User.js");

const nodemailer = require("nodemailer");

// -------------------- SOCKET.IO SETUP --------------------
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Make io available globally (BEST FIX)
global.io = io;
global.onlineUsers = new Set();
global.userSockets = new Map();

// -------------------- ROUTES --------------------
app.use("/api/auth", require("./routes/authRoutes.js"));
app.use("/api/auctions", require("./routes/auctionRoutes"));
app.use("/api/bids", require("./routes/bidRoutes"));
app.use("/api/buy", require("./routes/buyNowRoutes"));
app.use("/api/admin", require("./routes/adminRoutes.js"));
app.use("/api/seller", require("./routes/sellerRoutes.js"));
app.use("/api/wishlist", require("./routes/wishlistRoutes"));
app.use("/api/chat", require("./routes/chatRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));
app.use("/api/orders", require("./routes/orderRoutes.js"));
app.use("/api/contact", require("./routes/contactRoutes"));
app.use("/api/settings", require("./routes/settingsRoutes"));
app.use("/api/ai", require("./routes/aiRoutes"));

app.use((req, res, next) => {
  res.status(404).json({ message: "Not Found" });
});
app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({ message: err.message || "Server Error" });
});

// -------------------- SOCKET.IO EVENTS --------------------
io.on("connection", (socket) => {
  console.log("🟢 Socket connected:", socket.id);

  // Chat
  socket.on("joinChat", (chatId) => socket.join(chatId));

  socket.on("typing", ({ chatId, sender }) => {
    socket.to(chatId).emit("typing", sender);
  });

  socket.on("sendMessage", (data) => {
    io.to(data.chatId).emit("newMessage", data);
  });

  // Notifications + Presence
  socket.on("registerUser", (userId) => {
    if (!userId) return;
    socket.join(`user_${userId}`);
    global.userSockets.set(socket.id, userId.toString());
    global.onlineUsers.add(userId.toString());
  });

  socket.on("disconnect", () => {
    console.log("🔴 Socket disconnected:", socket.id);
    const userId = global.userSockets.get(socket.id);
    if (userId) {
      global.userSockets.delete(socket.id);
      // If no other sockets for this user remain, remove from online set
      const stillConnected = Array.from(global.userSockets.values()).some((u) => u === userId);
      if (!stillConnected) global.onlineUsers.delete(userId);
    }
  });
});

// -------------------- EMAIL HELPER --------------------
async function sendEmail(to, subject, text) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.MAIL, pass: process.env.MAIL_PASS }
    });

    await transporter.sendMail({
      from: process.env.MAIL,
      to,
      subject,
      text
    });
  } catch (err) {
    console.log("📧 Email error:", err.message);
  }
}

// -------------------- CRON 1: Wishlist Alerts --------------------
setInterval(async () => {
  try {
    const wishlists = await Wishlist.find().populate("items.auctionId userId");
    const now = new Date();

    for (const wl of wishlists) {
      for (const item of wl.items) {
        const auc = item.auctionId;
        if (!auc) continue;

        const timeLeft = auc.endTime - now;

        if (timeLeft < 5 * 60 * 1000 && auc.status === "active") {
          global.io.to(`user_${wl.userId._id}`).emit("notification", {
            message: `⏳ Auction ending soon: ${auc.title}`,
            link: `/auction/${auc._id}`
          });
        }
      }
    }
  } catch (err) {
    console.log("⏳ Wishlist Cron Error:", err.message);
  }
}, 60000);

// -------------------- CRON 2: Auto-End Auctions --------------------
setInterval(async () => {
  try {
    const now = new Date();
    const expired = await Auction.find({
      endTime: { $lte: now },
      status: "active"
    });

    for (let auc of expired) {
      const topBid = await Bid.findOne({ auctionId: auc._id })
        .sort({ amount: -1 })
        .populate("userId");

      if (!topBid || !topBid.userId) {
        // No valid winner
        auc.status = "ended";
        await auc.save();
        // notify seller (no winner)
        try {
          await createNotification({
            userId: auc.sellerId,
            message: `Your auction ended with no winner: ${auc.title}`,
            link: `/auction/${auc._id}`,
          });
          global.io.to(`user_${auc.sellerId}`).emit("notification", {
            message: `Your auction ended with no winner: ${auc.title}`,
            link: `/auction/${auc._id}`,
          });
        } catch (e) {}
        global.io.emit("auctionEnded", { id: auc._id });
        continue;
      }

      // Winner found
      auc.status = "ended";
      auc.winner = topBid.userId._id;
      auc.currentPrice = topBid.amount;
      await auc.save();

      // Create order
      await Order.create({
        buyerId: topBid.userId._id,
        sellerId: auc.sellerId,
        auctionId: auc._id,
        amount: topBid.amount
      });

      // Email winner
      await sendEmail(
        topBid.userId.email,
        "🎉 You won an auction!",
        `Auction: ${auc.title}\nWinning Bid: ₹${topBid.amount}`
      );

      // Notify winner
      global.io.to(`user_${topBid.userId._id}`).emit("notification", {
        message: `🎉 You won: ${auc.title}`,
        link: `/auction/${auc._id}`
      });

      // Seller notification (winner found)
      try {
        await createNotification({
          userId: auc.sellerId,
          message: `Your auction ended. Winner: ${topBid.userId.name || topBid.userId.email} @ ₹${topBid.amount}`,
          link: `/auction/${auc._id}`,
        });
        global.io.to(`user_${auc.sellerId}`).emit("notification", {
          message: `Your auction ended. Winner: ${topBid.userId.name || topBid.userId.email} @ ₹${topBid.amount}`,
          link: `/auction/${auc._id}`,
        });
      } catch (e) {}

      // Notify frontend
      global.io.emit("auctionEnded", { id: auc._id });
    }
  } catch (err) {
    console.log("🏁 Auto-End Cron Error:", err.message);
  }
}, 30000);

// -------------------- CRON 3: Auto-Start Upcoming Auctions --------------------
setInterval(async () => {
  try {
    const now = new Date();
    const toStart = await Auction.find({
      startTime: { $lte: now },
      status: "upcoming",
    });
    for (let auc of toStart) {
      auc.status = "active";
      await auc.save();
      // Notify seller that auction went live
      try {
        await createNotification({
          userId: auc.sellerId,
          message: `Your auction is live: ${auc.title}`,
          link: `/auction/${auc._id}`,
        });
        global.io.to(`user_${auc.sellerId}`).emit("notification", {
          message: `Your auction is live: ${auc.title}`,
          link: `/auction/${auc._id}`,
        });
      } catch (e) {}

      // Broadcast to all users about the new live auction
      try {
        const users = await User.find({}, "_id");
        for (const u of users) {
          await createNotification({
            userId: u._id,
            message: `Live now: ${auc.title}`,
            link: `/auction/${auc._id}`,
          });
          global.io.to(`user_${u._id}`).emit("notification", {
            message: `Live now: ${auc.title}`,
            link: `/auction/${auc._id}`,
          });
        }
      } catch (e) {}
    }
  } catch (err) {
    console.log("🚀 Auto-Start Cron Error:", err.message);
  }
}, 30000);

// -------------------- START SERVER --------------------
const PORT = process.env.PORT || 4000;
server.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
