const express = require("express");
const { protect } = require("../middlewares/authMiddleware.js");
const { buyNow } = require("../controllers/buyNowController.js");

const router = express.Router();

router.post("/:id", protect, buyNow);

module.exports = router;
