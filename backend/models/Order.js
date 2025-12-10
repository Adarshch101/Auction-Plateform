const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  auctionId: { type: mongoose.Schema.Types.ObjectId, ref: "Auction" },
  amount: Number,
  status: { type: String, default: "completed" },
  shippingName: { type: String },
  addressLine1: { type: String },
  addressLine2: { type: String },
  city: { type: String },
  state: { type: String },
  postalCode: { type: String },
  country: { type: String },
  phone: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
