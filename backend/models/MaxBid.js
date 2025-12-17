const mongoose = require("mongoose");

const maxBidSchema = new mongoose.Schema(
  {
    auctionId: { type: mongoose.Schema.Types.ObjectId, ref: "Auction", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    maxAmount: { type: Number, required: true },
  },
  { timestamps: true }
);

maxBidSchema.index({ auctionId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model("MaxBid", maxBidSchema);
