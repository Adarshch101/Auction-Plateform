const Auction = require("../models/Auction.js");
const Order = require("../models/Order.js");

exports.getSellerAuctions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const status = req.query.status;
    const search = req.query.search;
    const category = req.query.category;
    const sort = req.query.sort || "-createdAt";

    const filter = { sellerId: req.user._id };
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (search) filter.title = { $regex: search, $options: "i" };

    const total = await Auction.countDocuments(filter);
    const auctions = await Auction.find(filter)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({ auctions, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch seller auctions" });
  }
};

exports.getSellerOrders = async (req, res) => {
  res.json(await Order.find({ sellerId: req.user._id }).populate("buyerId auctionId"));
};

exports.getSellerStats = async (req, res) => {
  const sellerId = req.user._id;
  const totalListings = await Auction.countDocuments({ sellerId });
  const soldItems = await Order.countDocuments({ sellerId });

  const [revenue] = await Order.aggregate([
    { $match: { sellerId } },
    { $group: { _id: null, total: { $sum: "$amount" }, avg: { $avg: "$amount" } } }
  ]);

  const activeListings = await Auction.countDocuments({ sellerId, status: "active" });
  const auctionCategories = ["antique", "vintage", "collectables"];
  const auctionListings = await Auction.countDocuments({ sellerId, category: { $in: auctionCategories } });
  const directSaleListings = await Auction.countDocuments({ sellerId, category: { $nin: auctionCategories } });
  const outOfStock = await Auction.countDocuments({ sellerId, category: { $nin: auctionCategories }, quantity: { $lte: 0 } });

  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const last30DaysSales = await Order.countDocuments({ sellerId, createdAt: { $gte: since } });
  const [rev30] = await Order.aggregate([
    { $match: { sellerId, createdAt: { $gte: since } } },
    { $group: { _id: null, total: { $sum: "$amount" } } }
  ]);

  res.json({
    totalListings,
    activeListings,
    auctionListings,
    directSaleListings,
    outOfStock,
    soldItems,
    last30DaysSales,
    revenue: revenue?.total || 0,
    avgOrderValue: revenue?.avg || 0,
    revenueLast30Days: rev30?.total || 0,
  });
};

// GET seller wallet info (revenue + recent orders)
exports.getSellerWallet = async (req, res) => {
  try {
    const orders = await Order.find({ sellerId: req.user._id }).populate("buyerId auctionId");

    // Platform fee from global settings (default 5%)
    const S = (req.app && req.app.locals && req.app.locals.settings) || {};
    const feePercent = Number(S?.platformFee ?? 5);
    const feeFactor = Math.max(0, 1 - (isNaN(feePercent) ? 0.05 : feePercent / 100));

    let gross = 0;
    let net = 0;
    const enriched = orders.map(o => {
      const amt = Number(o.amount || 0);
      gross += amt;
      const netAmount = Math.round(amt * feeFactor);
      net += netAmount;
      return { ...o.toObject(), netAmount };
    });

    res.json({
      revenue: net,
      gross,
      feePercent,
      orders: enriched
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to load wallet" });
  }
};

exports.getSellerSalesGraph = async (req, res) => {
  try {
    const sellerId = req.user._id;
    const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const agg = await Order.aggregate([
      { $match: { sellerId, createdAt: { $gte: since } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          revenue: { $sum: "$amount" },
          count: { $count: {} }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    const dates = agg.map(a => a._id);
    const revenue = agg.map(a => a.revenue);
    const items = agg.map(a => a.count);
    res.json({ dates, revenue, items });
  } catch (err) {
    res.status(500).json({ message: "Failed to load sales graph" });
  }
};
