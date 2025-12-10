const Wishlist = require("../models/Wishlist.js");
const Auction = require("../models/Auction.js");
const { createNotification } = require("./notificationController.js"); // will exist in Section 3

// GET user's wishlist
exports.getWishlist = async (req, res) => {
  const wishlist = await Wishlist.findOne({ userId: req.user._id })
    .populate("items.auctionId");

  res.json(wishlist || { items: [] });
};

// ADD item to wishlist
exports.addToWishlist = async (req, res) => {
  const { auctionId } = req.body;

  let wishlist = await Wishlist.findOne({ userId: req.user._id });

  if (!wishlist) {
    wishlist = await Wishlist.create({
      userId: req.user._id,
      items: [{ auctionId }]
    });
  } else {
    const exists = wishlist.items.some(
      (item) => item.auctionId.toString() === auctionId
    );

    if (!exists) {
      wishlist.items.push({ auctionId });
      await wishlist.save();
    }
  }

  // notify user that item is added
  await createNotification({
    userId: req.user._id,
    message: "Added to Wishlist",
    link: `/auction/${auctionId}`
  });

  res.json({ message: "Added to wishlist" });
};

// REMOVE item
exports.removeFromWishlist = async (req, res) => {
  const { auctionId } = req.params;

  await Wishlist.findOneAndUpdate(
    { userId: req.user._id },
    {
      $pull: { items: { auctionId } }
    }
  );

  res.json({ message: "Removed from wishlist" });
};
