const mongoose = require("mongoose");

const walletRequestSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type: { type: String, enum: ["deposit", "withdraw"], required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending", index: true },
    actionedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    actionedAt: { type: Date, default: null },
    note: { type: String, default: "" }
  },
  { timestamps: true }
);

// Indexes for performance
walletRequestSchema.index({ status: 1, createdAt: -1 });
walletRequestSchema.index({ userId: 1, status: 1, createdAt: -1 });

module.exports = mongoose.model("WalletRequest", walletRequestSchema);
