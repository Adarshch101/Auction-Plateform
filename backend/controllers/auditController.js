const AuditLog = require("../models/AuditLog");

// GET /admin/audit-logs
// Optional query: entityType, entityId, userId, action, from, to, page, limit
exports.getAuditLogs = async (req, res) => {
  try {
    const { entityType, entityId, userId, action, from, to } = req.query || {};
    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || "25", 10), 1), 200);
    const skip = (page - 1) * limit;

    const filter = {};
    if (entityType) filter.entityType = String(entityType);
    if (entityId) filter.entityId = entityId;
    if (userId) filter.userId = userId;
    if (action) filter.action = String(action);

    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) filter.createdAt.$lte = new Date(to);
    }

    const [items, total] = await Promise.all([
      AuditLog.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("userId", "name email role"),
      AuditLog.countDocuments(filter),
    ]);

    res.json({ items, total, page, pages: Math.max(Math.ceil(total / limit), 1), limit });
  } catch (e) {
    res.status(500).json({ message: "Failed to load audit logs" });
  }
};
