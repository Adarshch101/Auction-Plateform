const express = require("express");
const { protect } = require("../middlewares/authMiddleware.js");
const { placeBid, getBids, getMyBids } = require("../controllers/bidController.js");

const router = express.Router();

router.get("/:id/me", protect, getMyBids);
router.get("/:id", getBids);
router.post("/:id", protect, placeBid);

module.exports = router;
