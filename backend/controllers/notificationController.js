const Notification = require("../models/Notification");

// Create notification + emit real-time socket
exports.createNotification = async ({ userId, message, link }) => {
    const notify = await Notification.create({
        userId,
        message,
        link
    });

    if (global.io) {
        global.io.to(`user_${userId}`).emit("notification", {
            id: notify._id,
            message,
            link,
        });
    }

    return notify;
};
  
// Get notifications
exports.getNotifications = async (req, res) => {
    const list = await Notification.find({ userId: req.user._id })
        .sort({ createdAt: -1 });

    res.json(list);
};

// Mark one as read
exports.markRead = async (req, res) => {
    const { id } = req.params;
    await Notification.findByIdAndUpdate(id, { seen: true });
    res.json({ message: "Marked as read" });
};

// Mark all read
exports.markAllRead = async (req, res) => {
    await Notification.updateMany(
        { userId: req.user._id },
        { $set: { seen: true } }
    );
    res.json({ message: "All notifications marked read" });
};

// Clear (delete) all notifications for current user
exports.clearAllNotifications = async (req, res) => {
    try {
        await Notification.deleteMany({ userId: req.user._id });
        return res.json({ message: "Notifications cleared" });
    } catch (err) {
        console.error("Failed to clear notifications:", err);
        return res.status(500).json({ message: "Failed to clear notifications" });
    }
};
