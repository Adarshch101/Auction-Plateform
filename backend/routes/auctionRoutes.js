const express = require("express");
const router = express.Router();

const {
  getAllAuctions,
  getAuction,
  createAuction,
  updateAuction,
  deleteAuction,
  getWonAuctions,
  getFeaturedAuctions,
} = require("../controllers/auctionController");

const { protect } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadImage");

// Public routes
router.get("/", getAllAuctions);
router.get("/featured", getFeaturedAuctions);

// Protected routes - must come before /:id
router.get("/user/won", protect, getWonAuctions);
// use memory upload so controller can reliably handle buffer -> cloudinary upload
// accept both multiple images ("images") and legacy single ("image")
router.post(
  "/",
  protect,
  upload.memory.fields([
    { name: "images", maxCount: 10 },
    { name: "image", maxCount: 1 },
  ]),
  createAuction
);
router.put(
  "/:id",
  protect,
  upload.memory.fields([
    { name: "images", maxCount: 10 },
    { name: "image", maxCount: 1 },
  ]),
  updateAuction
);
router.delete("/:id", protect, deleteAuction);

// Dynamic route - must come last
router.get("/:id", getAuction);

module.exports = router;
