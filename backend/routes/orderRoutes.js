const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const Order = require("../models/Order");

router.get("/my", protect, async (req, res) => {
  const orders = await Order.find({ buyerId: req.user._id })
    .populate("auctionId")
    .sort({ createdAt: -1 });

  res.json(orders);
});

module.exports = router;
