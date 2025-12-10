const Review = require("../models/Review");
const Order = require("../models/Order");
const Auction = require("../models/Auction");
const { createNotification } = require("./notificationController");

// add review
exports.addReview = async (req, res) => {
  const { auctionId } = req.params;

  const { accuracy, quality, communication, reviewText } = req.body;

  const auction = await Auction.findById(auctionId);
  if (!auction) return res.status(404).json({ message: "Auction not found" });

  // Check verified buyer
  const order = await Order.findOne({
    auctionId,
    buyerId: req.user._id
  });

  if (!order)
    return res.status(400).json({ message: "Only verified buyers can review" });

  // average rating
  const avg =
    (Number(accuracy) + Number(quality) + Number(communication)) / 3;

  const review = await Review.create({
    auctionId,
    buyerId: req.user._id,
    sellerId: auction.sellerId,
    rating: { accuracy, quality, communication },
    averageRating: avg,
    reviewText,
    images: req.files?.map((f) => f.path) || []
  });

  // Notify seller
  await createNotification({
    userId: auction.sellerId,
    message: "New review received",
    link: `/auction/${auctionId}`
  });

  res.json(review);
};

// get reviews for product
exports.getAuctionReviews = async (req, res) => {
  const { auctionId } = req.params;

  const reviews = await Review.find({ auctionId })
    .populate("buyerId", "name")
    .sort({ createdAt: -1 });

  res.json(reviews);
};

// like/dislike
exports.likeReview = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const review = await Review.findById(id);
  if (!review) return res.status(404).json({ message: "Review not found" });

  const alreadyLiked = review.likes.some((u) => u.toString() === userId.toString());

  if (alreadyLiked) {
    await Review.findByIdAndUpdate(id, { $pull: { likes: userId } });
  } else {
    await Review.findByIdAndUpdate(id, {
      $addToSet: { likes: userId },
      $pull: { dislikes: userId },
    });
  }

  const updated = await Review.findById(id).lean();
  res.json({
    message: alreadyLiked ? "Unliked review" : "Liked review",
    review: updated,
  });
};

exports.dislikeReview = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const review = await Review.findById(id);
  if (!review) return res.status(404).json({ message: "Review not found" });

  const alreadyDisliked = review.dislikes.some((u) => u.toString() === userId.toString());

  if (alreadyDisliked) {
    await Review.findByIdAndUpdate(id, { $pull: { dislikes: userId } });
  } else {
    await Review.findByIdAndUpdate(id, {
      $addToSet: { dislikes: userId },
      $pull: { likes: userId },
    });
  }

  const updated = await Review.findById(id).lean();
  res.json({
    message: alreadyDisliked ? "Removed dislike" : "Disliked review",
    review: updated,
  });
};
