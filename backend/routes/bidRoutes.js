const express = require("express");
const { protect } = require("../middlewares/authMiddleware.js");
const { placeBid, getBids, getMyBids, setMaxBid, getMyMaxBid } = require("../controllers/bidController.js");

const router = express.Router();

router.get("/:id/me", protect, getMyBids);
router.get("/:id", getBids);
router.post("/:id", protect, placeBid);
router.post("/:id/max", protect, setMaxBid);
router.get("/:id/max", protect, getMyMaxBid);

module.exports = router;
