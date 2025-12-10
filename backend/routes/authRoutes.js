const express = require("express");
const { registerUser, loginUser } = require("../controllers/authController.js");

// !! FIX: correct folder name (middleware, not middlewares)
const { protect } = require("../middlewares/authMiddleware.js");
const upload = require("../middlewares/uploadImage.js");
const cloudinary = require("../config/cloudinary.js");
const User = require("../models/User.js");
const Auction = require("../models/Auction.js");
const Settings = require("../models/Settings.js");
const Bid = require("../models/Bid.js");

const router = express.Router();

/* -------------------- AUTH -------------------- */
router.post("/register", async (req, res, next) => {
  try {
    const s = await Settings.findOne({ key: "global" });
    if (s && s.enableRegistrations === false) {
      return res.status(403).json({ message: "Registrations are currently disabled" });
    }
    return registerUser(req, res, next);
  } catch (e) {
    return res.status(500).json({ message: "Unable to process registration" });
  }
});
router.post("/login", loginUser);

/* -------------------- GET MY PROFILE -------------------- */
router.get("/me", protect, async (req, res) => {
    // console.log("User in /me route:", req.user);
  res.json(req.user);
});

/* -------------------- BECOME SELLER -------------------- */
router.put("/become-seller", protect, async (req, res) => {
  try {
    if (req.user.role === "seller") {
      return res.json({ message: "Already a seller", role: req.user.role });
    }

    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { role: "seller" },
      { new: true }
    ).select("-password");

    res.json({ message: "Upgraded to seller", role: updated.role });
  } catch (e) {
    res.status(500).json({ message: "Failed to upgrade role" });
  }
});

/* -------------------- UPDATE PROFILE -------------------- */
router.put("/update", protect, async (req, res) => {
  const {
    name,
    email,
    phone,
    address,
    storeBio,
    instagram,
    website,
    prefs,
  } = req.body || {};

  const update = {};
  if (name !== undefined) update.name = name;
  if (email !== undefined) update.email = email;
  if (phone !== undefined) update.phone = phone;
  if (address !== undefined) update.address = address;
  if (storeBio !== undefined) update.storeBio = storeBio;
  if (instagram !== undefined) update.instagram = instagram;
  if (website !== undefined) update.website = website;
  if (prefs && typeof prefs === "object") update.prefs = prefs;

  const updated = await User.findByIdAndUpdate(req.user._id, update, { new: true }).select("-password");
  res.json(updated);
});

/* -------------------- CHANGE PASSWORD -------------------- */
router.put("/change-password", protect, async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select("+password");

  if (!user)
    return res.status(404).json({ message: "User not found" });

  const isMatch = await user.matchPassword(oldPassword);
  if (!isMatch)
    return res.status(400).json({ message: "Old password incorrect" });

  user.password = newPassword;
  await user.save();

  res.json({ message: "Password updated successfully" });
});

/* -------------------- UPDATE AVATAR -------------------- */
router.post("/avatar", protect, upload.memory.single("avatar"), async (req, res) => {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ message: "No avatar provided" });
    }

    const dataUri = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
    const result = await cloudinary.uploader.upload(dataUri, {
      folder: "avatars",
      public_id: `${Date.now()}-${req.file.originalname}`,
    });

    const url = result.secure_url || result.url;
    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: url },
      { new: true }
    ).select("-password");

    return res.json(updated);
  } catch (e) {
    return res.status(500).json({ message: "Failed to update avatar" });
  }
});

/* -------------------- DELETE MY ACCOUNT -------------------- */
router.delete("/delete", protect, async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    await User.findByIdAndDelete(userId);

    return res.json({ message: "Account deleted" });
  } catch (e) {
    console.error("Delete account error:", e);
    return res.status(500).json({ message: "Failed to delete account" });
  }
});

/* -------------------- STATS FOR PROFILE -------------------- */
router.get("/stats", protect, async (req, res) => {
  const userId = req.user._id;

  const totalBids = await Bid.countDocuments({ userId });
  const auctionsWon = await Auction.countDocuments({ winner: userId });

  const user = await User.findById(userId);

  res.json({
    totalBids,
    auctionsWon,
    wallet: user.wallet || 0
  });
});

module.exports = router;
