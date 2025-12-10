const Settings = require("../models/Settings");

exports.getSettings = async (req, res) => {
  const doc = await Settings.findOne({ key: "global" });
  if (!doc) {
    const created = await Settings.create({ key: "global" });
    return res.json(created);
  }
  res.json(doc);
};

exports.updateSettings = async (req, res) => {
  const allowed = [
    "platformFee",
    "maxAuctionDuration",
    "minStartingPrice",
    "emailNotifications",
    "autoEndAuctions",
    "maintenanceMode",
    "bidIncrement",
    "defaultCurrency",
    "refundWindowDays",
    "maxUploadMB",
    "enableRegistrations",
    "requireKYCForSellers",
  ];
  const update = {};
  for (const k of allowed) if (k in req.body) update[k] = req.body[k];
  const doc = await Settings.findOneAndUpdate(
    { key: "global" },
    { $set: update },
    { new: true, upsert: true }
  );
  res.json(doc);
};
