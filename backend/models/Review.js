const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    auctionId: { type: mongoose.Schema.Types.ObjectId, ref: "Auction" },
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    buyerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    rating: {
      accuracy: { type: Number, default: 0 },
      quality: { type: Number, default: 0 },
      communication: { type: Number, default: 0 }
    },

    averageRating: { type: Number, default: 0 },

    reviewText: { type: String },

    images: [String], // Cloudinary URLs

    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);
