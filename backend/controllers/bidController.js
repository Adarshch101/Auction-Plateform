const Auction = require("../models/Auction.js");
const Bid = require("../models/Bid.js");

exports.getBids = async (req, res) => {
  try {
    const bids = await Bid.find({ auctionId: req.params.id })
      .sort({ createdAt: -1 });
    const sanitized = bids.map(b => ({ amount: b.amount, createdAt: b.createdAt }));
    res.json(sanitized);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch bids" });
  }
};

exports.placeBid = async (req, res) => {
  const { amount } = req.body;
  const auction = await Auction.findById(req.params.id);

  if (auction.status !== "active")
    return res.status(400).json({ message: "Auction closed" });

  if (amount <= auction.currentPrice)
    return res.status(400).json({ message: "Bid too low" });

  // Enforce bid increment if configured
  const S = (req.app && req.app.locals && req.app.locals.settings) || {};
  if (S && S.bidIncrement) {
    const required = Number(auction.currentPrice) + Number(S.bidIncrement);
    if (Number(amount) < required) {
      return res.status(400).json({ message: `Minimum next bid is ₹${required} (increment ₹${S.bidIncrement})` });
    }
  }

  auction.currentPrice = amount;
  await auction.save();

  const bid = await Bid.create({
    amount,
    auctionId: auction._id,
    userId: req.user._id
  });

  res.json({ bid });
};

exports.getMyBids = async (req, res) => {
  try {
    const bids = await Bid.find({ auctionId: req.params.id, userId: req.user._id })
      .sort({ createdAt: -1 });
    const sanitized = bids.map(b => ({ amount: b.amount, createdAt: b.createdAt }));
    res.json(sanitized);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch your bids" });
  }
};
