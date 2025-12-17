const mongoose = require("mongoose");

const auctionSchema = new mongoose.Schema({
  title: { type: String, required: true },

  description: { type: String },

  image: { type: String, required: false, default: "" },

  images: { type: [String], default: [] },

  category: { type: String, default: "general" },

  startingPrice: { type: Number, required: true },

  buyNowPrice: { type: Number, required: false, default: null },

  currentPrice: { type: Number, default: 0 },

  // Optional reserve price (auction must meet/exceed to be eligible to win)
  reservePrice: { type: Number, default: null },

  quantity: { type: Number, default: 0 },

  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },

  status: {
    type: String,
    enum: ["active", "upcoming", "ended", "bought"],
    default: "upcoming",
  },

  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },

  // If a bid comes in the final N seconds, extend by this many seconds
  softCloseSeconds: { type: Number, default: 120 },

  bidsCount: { type: Number, default: 0 },

  // Featured on homepage
  featured: { type: Boolean, default: false },
}, { timestamps: true });

// Indexes
auctionSchema.index({ status: 1, endTime: 1 });
auctionSchema.index({ sellerId: 1, createdAt: -1 });
auctionSchema.index({ title: "text", category: 1 });

module.exports = mongoose.model("Auction", auctionSchema);
