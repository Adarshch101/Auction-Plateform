const mongoose = require("mongoose");

const savedSearchSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, default: "Saved Search" },
    // Flexible params: category, q, priceMin, priceMax, etc.
    query: { type: Object, default: {} },
    notifications: { type: Boolean, default: true },
  },
  { timestamps: true }
);

savedSearchSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model("SavedSearch", savedSearchSchema);
