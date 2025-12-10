const express = require("express");
const router = express.Router();

const notifyCtrl = require("../controllers/notificationController");
const { protect } = require("../middlewares/authMiddleware.js");

router.get("/", protect, notifyCtrl.getNotifications);
router.put("/read/:id", protect, notifyCtrl.markRead);
router.put("/read-all", protect, notifyCtrl.markAllRead);
router.delete("/clear", protect, notifyCtrl.clearAllNotifications);

module.exports = router;
