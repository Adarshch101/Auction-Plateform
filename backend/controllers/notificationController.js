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
  
// Get notifications (with optional pagination and type filter)
exports.getNotifications = async (req, res) => {
    try {
        const { page, limit, type } = req.query;
        const filter = { userId: req.user._id };
        if (type && String(type).trim()) {
            filter.type = String(type).trim();
        }

        // If no pagination params provided, preserve legacy behavior (return array)
        const paged = (page !== undefined || limit !== undefined);
        if (!paged) {
            const list = await Notification.find(filter).sort({ createdAt: -1 });
            return res.json(list);
        }

        const pageNum = Math.max(1, parseInt(page || 1));
        const limitNum = Math.min(100, Math.max(1, parseInt(limit || 10)));
        const skip = (pageNum - 1) * limitNum;

        const [items, total] = await Promise.all([
            Notification.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
            Notification.countDocuments(filter),
        ]);

        return res.json({
            items,
            total,
            page: pageNum,
            pages: Math.max(1, Math.ceil(total / limitNum)),
        });
    } catch (e) {
        return res.status(500).json({ message: "Failed to load notifications" });
    }
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
