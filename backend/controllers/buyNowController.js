const Auction = require("../models/Auction.js");
const Order = require("../models/Order.js");
const nodemailer = require("nodemailer");
const User = require("../models/User.js");

async function sendEmail(to, subject, text) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.MAIL, pass: process.env.MAIL_PASS }
  });

  await transporter.sendMail({ from: process.env.MAIL, to, subject, text });
}

exports.buyNow = async (req, res) => {
  const buyerId = req.user._id;
  const { id } = req.params;
  const {
    shippingName,
    addressLine1,
    addressLine2,
    city,
    state,
    postalCode,
    country,
    phone,
  } = req.body || {};

  const auction = await Auction.findById(id).populate("sellerId");

  if (!auction) return res.status(404).json({ message: "Item not found" });

  const cat = (auction.category || "").toString().toLowerCase();
  const auctionCategories = new Set(["antique", "vintage", "collectables"]);
  const isAuction = auctionCategories.has(cat);

  if (isAuction) {
    return res.status(400).json({ message: "This item is available only via auction" });
  }

  if (auction.status !== "active") {
    return res.status(400).json({ message: "Item is not available for purchase" });
  }

  if (!auction.buyNowPrice) {
    return res.status(400).json({ message: "This item does not have a direct sale price" });
  }

  if (!shippingName || !addressLine1 || !city || !state || !postalCode || !country || !phone) {
    return res.status(400).json({ message: "Shipping address is incomplete" });
  }

  // For direct-sale items, allow multiple purchases. Do not change status or winner.
  // Keep the listing active and record a new order per purchase.

  if ((auction.quantity || 0) <= 0) {
    return res.status(400).json({ message: "Out of stock" });
  }

  const order = await Order.create({
    buyerId,
    sellerId: auction.sellerId._id,
    auctionId: auction._id,
    amount: auction.buyNowPrice,
    shippingName,
    addressLine1,
    addressLine2: addressLine2 || "",
    city,
    state,
    postalCode,
    country,
    phone
  });

  auction.quantity = Math.max(0, (auction.quantity || 0) - 1);
  await auction.save();

  try {
    if (global.io) {
      global.io.to(`user_${buyerId}`).emit("purchaseCompleted", { auctionId: auction._id.toString() });
    }
  } catch (e) {}

  const buyer = await User.findById(buyerId);

  await sendEmail(buyer.email, "You bought an item!", `Item: ${auction.title}`);
  await sendEmail(auction.sellerId.email, "Item sold!", `${buyer.email} bought your item`);

  res.json(order);
};
