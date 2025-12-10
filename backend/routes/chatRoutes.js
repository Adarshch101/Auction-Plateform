const express = require("express");
const router = express.Router();

const chatController = require("../controllers/chatController");
const { protect } = require("../middlewares/authMiddleware.js");

router.post("/start", protect, chatController.startChat);
router.get("/", protect, chatController.getChats);
router.get("/presence/:userId", protect, chatController.getPresence);
router.get("/:chatId", protect, chatController.getMessages);
router.post("/:chatId", protect, chatController.sendMessage);
router.post("/:chatId/close", protect, chatController.closeChat);

module.exports = router;
