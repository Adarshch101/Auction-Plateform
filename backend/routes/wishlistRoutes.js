const express = require("express");
const { protect } = require("../middlewares/authMiddleware.js");
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist
} = require("../controllers/wishlistController.js");

const router = express.Router();

router.get("/", protect, getWishlist);
router.post("/", protect, addToWishlist);
router.delete("/:auctionId", protect, removeFromWishlist);

module.exports = router;
