const Auction = require("../models/Auction.js");
const Bid = require("../models/Bid.js");
const MaxBid = require("../models/MaxBid.js");

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

  // Proxy bidding logic
  const increment = Number((req.app?.locals?.settings?.bidIncrement) || 0) || 1;
  const now = new Date();

  // Gather existing max bids
  const maxBids = await MaxBid.find({ auctionId: auction._id }).lean();
  const existingForMe = maxBids.find((x) => String(x.userId) === String(req.user._id));

  // Manual bid cannot exceed others' auto-bid outcome; compute top two maxes considering this manual bid as instantaneous
  // Treat manual amount as a transient max for this user if higher than their recorded max
  const candidateMaxes = maxBids.map((x) => ({ userId: String(x.userId), max: x.maxAmount }));
  const myMax = existingForMe ? Math.max(existingForMe.maxAmount, amount) : amount; // treat manual as potential cap
  const replaced = candidateMaxes.filter((c) => c.userId !== String(req.user._id));
  replaced.push({ userId: String(req.user._id), max: myMax });
  replaced.sort((a,b)=> b.max - a.max || (a.userId < b.userId ? -1 : 1));

  const top = replaced[0];
  const second = replaced[1] || null;

  // New current price is min(top.max, (second?.max || auction.currentPrice) + increment)
  let newPrice = Math.max(amount, (second ? Math.min(top.max, second.max + increment) : amount));
  if (newPrice <= auction.currentPrice) newPrice = auction.currentPrice + increment;

  auction.currentPrice = newPrice;

  // Anti-sniping / soft-close: prefer global settings if enabled, else fallback to auction.softCloseSeconds
  const S2 = (req.app && req.app.locals && req.app.locals.settings) || {};
  let softSeconds = 0;
  if (S2 && S2.enableSnipingProtection) {
    const mins = Number(S2.snipingExtensionMinutes || 0);
    if (mins > 0) softSeconds = mins * 60;
  } else if (Number(auction.softCloseSeconds || 0) > 0) {
    softSeconds = Number(auction.softCloseSeconds);
  }

  if (softSeconds > 0) {
    const secondsLeft = Math.floor((auction.endTime.getTime() - now.getTime()) / 1000);
    if (secondsLeft > 0 && secondsLeft <= softSeconds) {
      auction.endTime = new Date(auction.endTime.getTime() + softSeconds * 1000);
    }
  }
  await auction.save();

  // Record visible bid for the user who currently leads at newPrice
  const leaderUserId = top ? top.userId : String(req.user._id);
  const bid = await Bid.create({ amount: newPrice, auctionId: auction._id, userId: leaderUserId });

  res.json({ bid, currentPrice: auction.currentPrice, endsAt: auction.endTime });
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

// Set or update a user's maximum proxy bid for an auction
exports.setMaxBid = async (req, res) => {
  try {
    const { maxAmount } = req.body;
    const auction = await Auction.findById(req.params.id);
    if (!auction) return res.status(404).json({ message: "Auction not found" });
    if (auction.status !== "active") return res.status(400).json({ message: "Auction closed" });
    if (!(Number(maxAmount) > auction.currentPrice)) return res.status(400).json({ message: "Max must exceed current price" });

    // Upsert
    await MaxBid.updateOne(
      { auctionId: auction._id, userId: req.user._id },
      { $set: { maxAmount: Number(maxAmount) } },
      { upsert: true }
    );

    res.json({ message: "Max bid saved" });
  } catch (e) {
    res.status(500).json({ message: "Failed to save max bid" });
  }
};

exports.getMyMaxBid = async (req, res) => {
  try {
    const mb = await MaxBid.findOne({ auctionId: req.params.id, userId: req.user._id });
    res.json({ maxAmount: mb?.maxAmount || null });
  } catch (e) {
    res.status(500).json({ message: "Failed to fetch max bid" });
  }
};
