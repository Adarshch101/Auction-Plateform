const SavedSearch = require("../models/SavedSearch");

// GET /saved-searches (current user's)
exports.listSavedSearches = async (req, res) => {
  try {
    const items = await SavedSearch.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(items);
  } catch (e) {
    res.status(500).json({ message: "Failed to load saved searches" });
  }
};

// POST /saved-searches { name?, query, notifications? }
exports.createSavedSearch = async (req, res) => {
  try {
    const { name, query, notifications } = req.body || {};
    if (!query || typeof query !== "object") return res.status(400).json({ message: "query required" });
    const created = await SavedSearch.create({
      userId: req.user._id,
      name: (name || "Saved Search").toString().slice(0, 80),
      query,
      notifications: notifications === false ? false : true,
    });
    res.status(201).json(created);
  } catch (e) {
    res.status(500).json({ message: "Failed to create saved search" });
  }
};

// PUT /saved-searches/:id { name?, notifications? }
exports.updateSavedSearch = async (req, res) => {
  try {
    const { id } = req.params;
    const patch = {};
    if (req.body?.name !== undefined) patch.name = String(req.body.name).slice(0, 80);
    if (req.body?.notifications !== undefined) patch.notifications = !!req.body.notifications;
    const updated = await SavedSearch.findOneAndUpdate({ _id: id, userId: req.user._id }, { $set: patch }, { new: true });
    if (!updated) return res.status(404).json({ message: "Not found" });
    res.json(updated);
  } catch (e) {
    res.status(500).json({ message: "Failed to update saved search" });
  }
};

// DELETE /saved-searches/:id
exports.deleteSavedSearch = async (req, res) => {
  try {
    const { id } = req.params;
    const gone = await SavedSearch.findOneAndDelete({ _id: id, userId: req.user._id });
    if (!gone) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted" });
  } catch (e) {
    res.status(500).json({ message: "Failed to delete saved search" });
  }
};
