const express = require("express");
const router = express.Router();

const { protect } = require("../middlewares/authMiddleware.js");
const reviewCtrl = require("../controllers/reviewController");
const { upload } = require("../middlewares/uploadImage");

router.post(
  "/:auctionId",
  protect,
  upload.array("images", 5),
  reviewCtrl.addReview
);

router.get("/:auctionId", reviewCtrl.getAuctionReviews);
router.put("/like/:id", protect, reviewCtrl.likeReview);
router.put("/dislike/:id", protect, reviewCtrl.dislikeReview);

module.exports = router;
