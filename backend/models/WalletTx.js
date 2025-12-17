const mongoose = require("mongoose");

const walletTxSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true, required: true },
    type: { type: String, enum: ["deposit", "withdraw"], required: true },
    amount: { type: Number, required: true },
    balanceAfter: { type: Number, required: true },
    meta: { type: Object, default: {} }
  },
  { timestamps: true }
);

// Indexes for common queries
walletTxSchema.index({ userId: 1, createdAt: -1 });
walletTxSchema.index({ type: 1, createdAt: -1 });

module.exports = mongoose.model("WalletTx", walletTxSchema);
