const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    chatId: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    message: { type: String },
    seen: { type: Boolean, default: false }
  },
  { timestamps: true }
);

// Indexes
messageSchema.index({ chatId: 1, createdAt: 1 });
messageSchema.index({ senderId: 1, createdAt: -1 });
messageSchema.index({ chatId: 1, seen: 1 });

module.exports = mongoose.model("Message", messageSchema);
