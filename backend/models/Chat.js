const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    users: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    ],
    auctionId: { type: mongoose.Schema.Types.ObjectId, ref: "Auction", required: true },
    lastMessage: { type: String },
    lastMessageAt: { type: Date },
    closed: { type: Boolean, default: false },
    closedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    closedAt: { type: Date, default: null }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chat", chatSchema);
