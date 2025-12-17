const express = require("express");
const { registerUser, loginUser } = require("../controllers/authController.js");

// !! FIX: correct folder name (middleware, not middlewares)
const { protect } = require("../middlewares/authMiddleware.js");
const upload = require("../middlewares/uploadImage.js");
const cloudinary = require("../config/cloudinary.js");
const User = require("../models/User.js");
const { sendMail } = require("../config/mailer.js");
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

/* -------------------- RE-AUTHENTICATE (VERIFY PASSWORD) -------------------- */
router.post("/reauth", protect, async (req, res) => {
  try {
    const { password } = req.body || {};
    if (!password) return res.status(400).json({ message: "Password is required" });

    // Need the hashed password to compare; fetch fresh user with password
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const ok = await user.matchPassword(password);
    if (!ok) return res.status(401).json({ message: "Invalid password" });

    user.lastReauthAt = new Date();
    await user.save();
    return res.json({ success: true, reauthAt: user.lastReauthAt });
  } catch (e) {
    return res.status(500).json({ message: "Failed to verify password" });
  }
});

/* -------------------- TWO-FACTOR AUTH (2FA) -------------------- */
router.post("/2fa/request", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // cooldown: 60s between OTP sends
    if (user.twoFactorLastSentAt) {
      const elapsed = (Date.now() - new Date(user.twoFactorLastSentAt).getTime()) / 1000;
      const cooldown = 60; // seconds
      if (elapsed < cooldown) {
        const remain = Math.ceil(cooldown - elapsed);
        return res.status(429).json({ message: `Please wait ${remain}s before requesting another code`, remain });
      }
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000)); // 6-digit
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.twoFactorTempOtp = otp;
    user.twoFactorOtpExpires = expires;
    user.twoFactorLastSentAt = new Date();
    await user.save();

    // Send OTP via email if SMTP configured
    try {
      await sendMail({
        to: user.email,
        subject: "Your 2FA verification code",
        text: `Your code is ${otp}. It expires in 10 minutes.`,
        html: `<p>Your verification code is:</p><h2>${otp}</h2><p>This code expires in 10 minutes.</p>`,
      });
    } catch (e) {
      // If mail sending fails, continue to allow dev testing
      console.warn("[2FA] Failed to send OTP email:", e?.message);
    }

    // Dev convenience: include OTP in response outside production
    const body = { message: "OTP generated", expiresAt: expires, cooldown: 60 };
    if (process.env.NODE_ENV !== 'production') body.otp = otp;
    return res.json(body);
  } catch (e) {
    return res.status(500).json({ message: "Failed to initiate 2FA" });
  }
});

router.post("/2fa/enable", protect, async (req, res) => {
  try {
    const { otp } = req.body || {};
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!otp || !user.twoFactorTempOtp || !user.twoFactorOtpExpires)
      return res.status(400).json({ message: "OTP not requested" });

    if (new Date(user.twoFactorOtpExpires).getTime() < Date.now())
      return res.status(400).json({ message: "OTP expired" });

    if (String(otp).trim() !== String(user.twoFactorTempOtp).trim())
      return res.status(400).json({ message: "Invalid OTP" });

    user.twoFactorEnabled = true;
    user.twoFactorTempOtp = "";
    user.twoFactorOtpExpires = null;
    await user.save();

    const safe = await User.findById(user._id).select("-password");
    return res.json({ message: "2FA enabled", user: safe });
  } catch (e) {
    return res.status(500).json({ message: "Failed to enable 2FA" });
  }
});

router.post("/2fa/disable", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Require recent reauth (within 5 minutes)
    const windowMs = 5 * 60 * 1000;
    if (!user.lastReauthAt || Date.now() - new Date(user.lastReauthAt).getTime() > windowMs) {
      return res.status(401).json({ message: "Re-auth required to disable 2FA" });
    }

    user.twoFactorEnabled = false;
    user.twoFactorTempOtp = "";
    user.twoFactorOtpExpires = null;
    await user.save();

    const safe = await User.findById(user._id).select("-password");
    return res.json({ message: "2FA disabled", user: safe });
  } catch (e) {
    return res.status(500).json({ message: "Failed to disable 2FA" });
  }
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
    addresses,
    username,
    bio,
    location,
    timezone,
    twitter,
    gstNumber,
    panNumber,
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
  if (Array.isArray(addresses)) update.addresses = addresses;
  if (username !== undefined) update.username = username;
  if (bio !== undefined) update.bio = bio;
  if (location !== undefined) update.location = location;
  if (timezone !== undefined) update.timezone = timezone;
  if (twitter !== undefined) update.twitter = twitter;
  if (gstNumber !== undefined) update.gstNumber = gstNumber;
  if (panNumber !== undefined) update.panNumber = panNumber;
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
