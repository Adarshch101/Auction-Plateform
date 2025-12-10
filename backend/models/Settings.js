const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
  {
    key: { type: String, default: "global", unique: true },
    platformFee: { type: Number, default: 5 },
    maxAuctionDuration: { type: Number, default: 30 },
    minStartingPrice: { type: Number, default: 100 },
    emailNotifications: { type: Boolean, default: true },
    autoEndAuctions: { type: Boolean, default: true },

    maintenanceMode: { type: Boolean, default: false },
    bidIncrement: { type: Number, default: 50 },
    defaultCurrency: { type: String, default: "INR" },
    refundWindowDays: { type: Number, default: 7 },
    maxUploadMB: { type: Number, default: 5 },
    enableRegistrations: { type: Boolean, default: true },
    requireKYCForSellers: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Settings", settingsSchema);
