const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const { getSettings, updateSettings } = require("../controllers/settingsController");

// Admin only guard
function adminOnly(req, res, next) {
  if (!req.user || req.user.role !== "admin") return res.status(403).json({ message: "Admin access only" });
  next();
}

router.get("/", protect, getSettings);
router.put("/", protect, adminOnly, updateSettings);

module.exports = router;
