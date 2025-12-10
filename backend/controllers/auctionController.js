const Auction = require("../models/Auction");
const cloudinary = require("../config/cloudinary");
const { createNotification } = require("./notificationController");
const User = require("../models/User");

// GET all auctions
exports.getAllAuctions = async (req, res) => {
  try {
    const {
      q = "",
      category,
      priceMin,
      priceMax,
      timeLeft,
      sort = "created_desc",
      page = 1,
      limit = 20,
    } = req.query;

    const filter = {};

    if (q) {
      filter.title = { $regex: q.toString(), $options: "i" };
    }

    if (category && category !== "all") {
      filter.category = category.toString().toLowerCase();
    }

    const priceCond = {};
    if (priceMin !== undefined && priceMin !== "") {
      priceCond.$gte = Number(priceMin);
    }
    if (priceMax !== undefined && priceMax !== "") {
      priceCond.$lte = Number(priceMax);
    }
    if (Object.keys(priceCond).length) {
      filter.currentPrice = priceCond;
    }

    if (timeLeft) {
      const now = new Date();
      const tl = timeLeft.toString();
      let until;
      if (tl === "1h") until = new Date(now.getTime() + 1 * 60 * 60 * 1000);
      else if (tl === "24h") until = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      else if (tl === "7d") until = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      if (until) {
        filter.endTime = { $lte: until, $gte: now };
      }
    }

    let sortBy = { createdAt: -1 };
    if (sort === "price_asc") sortBy = { currentPrice: 1 };
    else if (sort === "price_desc") sortBy = { currentPrice: -1 };
    else if (sort === "end_soon") sortBy = { endTime: 1 };

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    // Backward compatibility: if no filter/sort/pagination params provided, return array directly
    const noParams = !('q' in req.query) && !('category' in req.query) && !('priceMin' in req.query) && !('priceMax' in req.query) && !('timeLeft' in req.query) && !('sort' in req.query) && !('page' in req.query) && !('limit' in req.query);

    if (noParams) {
      const all = await Auction.find().sort({ createdAt: -1 });
      return res.json(all);
    }

    const [items, total] = await Promise.all([
      Auction.find(filter).sort(sortBy).skip(skip).limit(limitNum),
      Auction.countDocuments(filter),
    ]);

    const paged = {
      items,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum) || 1,
    };

    res.json(paged);
  } catch (err) {
    res.status(500).json({ message: "Failed to load auctions" });
  }
};

// GET featured auctions
exports.getFeaturedAuctions = async (req, res) => {
  try {
    const auctions = await Auction.find({ featured: true }).sort({ createdAt: -1 });
    res.json(auctions);
  } catch (err) {
    res.status(500).json({ message: "Failed to load featured auctions" });
  }
};

// GET won auctions for current user
exports.getWonAuctions = async (req, res) => {
  try {
    const auctions = await Auction.find({ winner: req.user._id })
      .populate("sellerId", "name email")
      .sort({ endTime: -1 });
    res.json(auctions);
  } catch (err) {
    res.status(500).json({ message: "Failed to load won auctions" });
  }
};

// CREATE auction (admin / seller)
exports.createAuction = async (req, res) => {
  try {
    console.log('CREATE AUCTION: content-type=', req.headers['content-type']);
    console.log('CREATE AUCTION: req.file=', req.file, 'req.files=', req.files);
    console.log('CREATE AUCTION: req.body=', req.body);
    const { title, description, category, startingPrice, buyNowPrice, startTime, endTime, quantity, featured } = req.body;
    const S = (req.app && req.app.locals && req.app.locals.settings) || {};

    // Upload images -> Cloudinary
    let primaryImageUrl = "";
    const imageUrls = [];

    const uploadBuffer = async (file) => {
      const dataUri = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
      const result = await cloudinary.uploader.upload(dataUri, {
        folder: "auctions",
        public_id: `${Date.now()}-${file.originalname}`,
      });
      return result.secure_url || result.url || "";
    };

    try {
      // Priority: multiple files under req.files.images
      const imgs = (req.files && Array.isArray(req.files.images)) ? req.files.images : [];
      // Legacy single under req.files.image
      const singleArr = (req.files && Array.isArray(req.files.image)) ? req.files.image : [];
      if (imgs.length > 0) {
        for (const f of imgs) {
          if (f && f.buffer) {
            const url = await uploadBuffer(f);
            if (url) imageUrls.push(url);
          }
        }
      }
      if (singleArr.length > 0) {
        const f = singleArr[0];
        if (f && f.buffer) {
          const url = await uploadBuffer(f);
          if (url) imageUrls.push(url);
        }
      }
      if (imageUrls.length > 0) {
        primaryImageUrl = imageUrls[0];
      } else if (req.file && req.file.buffer) {
        // very legacy path
        try {
          const url = await uploadBuffer(req.file);
          primaryImageUrl = url;
          imageUrls.push(url);
        } catch (e) {}
      }
    } catch (uploadErr) {
      console.error("Cloudinary multi-upload failed:", uploadErr && uploadErr.message ? uploadErr.message : uploadErr);
    }

    // Decide whether this should be an auction or a direct sale based on category
    const cat = (category || "").toString().toLowerCase();
    const auctionCategories = new Set(["antique", "vintage", "collectables"]);
    const isAuction = auctionCategories.has(cat);

    // Validate required pricing based on category
    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }
    if (isAuction) {
      if (!startingPrice) {
        return res.status(400).json({ message: "startingPrice is required for auction categories" });
      }
      if (S.minStartingPrice && Number(startingPrice) < Number(S.minStartingPrice)) {
        return res.status(400).json({ message: `Minimum starting price is ₹${S.minStartingPrice}` });
      }
    } else {
      if (!buyNowPrice) {
        return res.status(400).json({ message: "buyNowPrice is required for direct sale categories" });
      }
      const qty = Number(quantity || 0);
      if (!(qty > 0)) {
        return res.status(400).json({ message: "quantity must be greater than 0 for direct sale items" });
      }
    }

    const starting = startingPrice || buyNowPrice;

    // Enforce max auction duration when start/end provided
    let startAt = startTime ? new Date(startTime) : new Date();
    let endAt = endTime ? new Date(endTime) : new Date(Date.now() + 24 * 60 * 60 * 1000);
    if (S.maxAuctionDuration && isAuction) {
      const maxMs = Number(S.maxAuctionDuration) * 24 * 60 * 60 * 1000;
      if (endAt.getTime() - startAt.getTime() > maxMs) {
        endAt = new Date(startAt.getTime() + maxMs);
      }
    }

    // Require KYC for sellers if setting enabled (allow admins regardless)
    if (S.requireKYCForSellers && req.user && req.user.role === 'seller' && !req.user.kycVerified) {
      return res.status(403).json({ message: "Seller verification (KYC) required to create auctions" });
    }

    const auction = await Auction.create({
      title,
      description: description || "",
      image: primaryImageUrl || req.body.image || "",
      images: imageUrls && imageUrls.length ? imageUrls : (primaryImageUrl ? [primaryImageUrl] : []),
      category: category || "general",
      startingPrice: starting,
      buyNowPrice: buyNowPrice || null,
      currentPrice: starting,
      startTime: startAt,
      endTime: endAt,
      sellerId: req.user._id,
      // If category dictates auction, honor startTime/upcoming logic; otherwise direct sales are active immediately
      status: isAuction ? (startTime && new Date(startTime) > new Date() ? "upcoming" : "active") : "active",
      quantity: isAuction ? 0 : Number(quantity || 0),
      featured: !!(featured === true || featured === "true"),
    });

    // Notify creator
    try {
      await createNotification({
        userId: req.user._id,
        message: `Auction created: ${title}`,
        link: `/auction/${auction._id}`,
      });
    } catch {}

    // Broadcast to all users that a new auction/product was listed
    try {
      const users = await User.find({}, "_id");
      for (const u of users) {
        await createNotification({
          userId: u._id,
          message: `New listing: ${title}`,
          link: `/auction/${auction._id}`,
        });
        if (global.io) {
          global.io.to(`user_${u._id}`).emit("notification", {
            message: `New listing: ${title}`,
            link: `/auction/${auction._id}`,
          });
        }
      }
    } catch {}

    // If it's live immediately, notify as live
    if (auction.status === "active") {
      try {
        await createNotification({
          userId: req.user._id,
          message: `Your auction is live: ${title}`,
          link: `/auction/${auction._id}`,
        });
        if (global.io) {
          global.io.to(`user_${req.user._id}`).emit("notification", {
            message: `Your auction is live: ${title}`,
            link: `/auction/${auction._id}`,
          });
        }
      } catch {}
    }

    res.status(201).json(auction);
  } catch (err) {
    console.error("CREATE AUCTION ERROR:", err && err.stack ? err.stack : err);
    res.status(500).json({ message: "Failed to create auction" });
  }
};

// GET single auction
exports.getAuction = async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id)
      .populate("sellerId", "name email kycVerified")
      .populate("winner", "name email");
    res.json(auction);
  } catch {
    res.status(404).json({ message: "Auction not found" });
  }
};

// UPDATE auction
exports.updateAuction = async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id);
    if (!auction) return res.status(404).json({ message: "Auction not found" });

    // Only admin or the seller who created auction can update
    if (req.user.role !== "admin" && auction.sellerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this auction" });
    }

    // Build updates with type coercion
    const body = req.body || {};
    const updates = {};

    if (body.title !== undefined) updates.title = String(body.title);
    if (body.description !== undefined) updates.description = String(body.description);
    if (body.category !== undefined) updates.category = String(body.category).toLowerCase();
    if (body.status !== undefined) updates.status = String(body.status);
    if (body.featured !== undefined) updates.featured = body.featured === true || body.featured === "true";

    const toNum = (v) => (v === null || v === undefined || v === "" ? undefined : Number(v));
    const sp = toNum(body.startingPrice);
    const bnp = toNum(body.buyNowPrice);
    const cp = toNum(body.currentPrice);
    const qty = toNum(body.quantity);
    if (sp !== undefined && !Number.isNaN(sp)) updates.startingPrice = sp;
    if (bnp !== undefined && !Number.isNaN(bnp)) updates.buyNowPrice = bnp;
    if (cp !== undefined && !Number.isNaN(cp)) updates.currentPrice = cp;
    if (qty !== undefined && !Number.isNaN(qty)) updates.quantity = qty;

    if (body.startTime !== undefined) updates.startTime = new Date(body.startTime);
    if (body.endTime !== undefined) updates.endTime = new Date(body.endTime);

    // Handle optional images upload (memory)
    const imageUrls = [];
    let primaryImageUrl = "";
    const uploadBuffer = async (file) => {
      const dataUri = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
      const result = await cloudinary.uploader.upload(dataUri, {
        folder: "auctions",
        public_id: `${Date.now()}-${file.originalname}`,
      });
      return result.secure_url || result.url || "";
    };

    try {
      const imgs = (req.files && Array.isArray(req.files.images)) ? req.files.images : [];
      const singleArr = (req.files && Array.isArray(req.files.image)) ? req.files.image : [];
      if (imgs.length > 0) {
        for (const f of imgs) {
          if (f && f.buffer) {
            const url = await uploadBuffer(f);
            if (url) imageUrls.push(url);
          }
        }
      }
      if (singleArr.length > 0) {
        const f = singleArr[0];
        if (f && f.buffer) {
          const url = await uploadBuffer(f);
          if (url) imageUrls.push(url);
        }
      }
      if (imageUrls.length > 0) {
        primaryImageUrl = imageUrls[0];
        updates.image = primaryImageUrl;
        updates.images = imageUrls;
      }
    } catch (uploadErr) {
      console.error("Cloudinary update upload failed:", uploadErr && uploadErr.message ? uploadErr.message : uploadErr);
    }

    Object.assign(auction, updates);
    const updated = await auction.save();
    res.json(updated);
  } catch (e) {
    res.status(500).json({ message: "Failed to update auction" });
  }
};

// DELETE auction
exports.deleteAuction = async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id);
    if (!auction) return res.status(404).json({ message: "Auction not found" });

    // Only admin or the seller can delete
    if (req.user.role !== "admin" && auction.sellerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this auction" });
    }

    await Auction.findByIdAndDelete(req.params.id);
    res.json({ message: "Auction deleted" });
  } catch (err) {
    console.error("DELETE AUCTION ERROR:", err);
    res.status(500).json({ message: "Failed to delete auction" });
  }
};
