const mongoose = require("mongoose");

const bidSchema = new mongoose.Schema({
  amount: Number,
  auctionId: { type: mongoose.Schema.Types.ObjectId, ref: "Auction" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

module.exports = mongoose.model("Bid", bidSchema);
