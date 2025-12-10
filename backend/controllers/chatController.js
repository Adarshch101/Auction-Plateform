const Chat = require("../models/Chat");
const Message = require("../models/Message");
const Auction = require("../models/Auction");
const { createNotification } = require("./notificationController"); // coming in section 3
const { sanitizeText } = require("../utils/sanitize");

// create or get existing chat
exports.startChat = async (req, res) => {
  try {
    let { sellerId, auctionId } = req.body;
    const buyerId = req.user._id;

    if (!auctionId) {
      return res.status(400).json({ message: "auctionId is required" });
    }

    // derive sellerId from auction if not provided
    if (!sellerId) {
      const auc = await Auction.findById(auctionId).select("sellerId");
      if (!auc) return res.status(404).json({ message: "Auction not found" });
      sellerId = auc.sellerId;
    }

    if (!sellerId) {
      return res.status(400).json({ message: "Seller not found" });
    }

    // prevent chatting with self
    if (sellerId.toString() === buyerId.toString()) {
      return res.status(400).json({ message: "Cannot start chat with yourself" });
    }

    let chat = await Chat.findOne({
      users: { $all: [buyerId, sellerId] },
      auctionId
    });

    if (!chat) {
      chat = await Chat.create({
        users: [buyerId, sellerId],
        auctionId,
        lastMessageAt: new Date()
      });
    }

    res.json(chat);
  } catch (e) {
    res.status(500).json({ message: "Failed to start chat" });
  }
};

// get user's inbox with unread counts
exports.getChats = async (req, res) => {
  const userId = req.user._id;
  const chats = await Chat.find({ users: userId })
    .populate("users", "name email kycVerified")
    .populate("auctionId", "title image")
    .sort({ lastMessageAt: -1 })
    .lean();

  const chatIds = chats.map((c) => c._id);
  const unreadAgg = await Message.aggregate([
    { $match: { chatId: { $in: chatIds }, seen: false, senderId: { $ne: userId } } },
    { $group: { _id: "$chatId", count: { $sum: 1 } } }
  ]);
  const unreadMap = Object.fromEntries(unreadAgg.map((u) => [u._id.toString(), u.count]));

  const withUnread = chats.map((c) => ({ ...c, unread: unreadMap[c._id.toString()] || 0 }));
  res.json(withUnread);
};

// get messages from chat
exports.getMessages = async (req, res) => {
  const { chatId } = req.params;

  const messages = await Message.find({ chatId }).populate("senderId", "name");

  // mark all messages from others as seen
  await Message.updateMany(
    { chatId, senderId: { $ne: req.user._id } },
    { $set: { seen: true } }
  );

  res.json(messages);
};

// send new message
exports.sendMessage = async (req, res) => {
  const { chatId } = req.params;
  const { text } = req.body;
  const safeText = sanitizeText(text, 2000);

  const chatDoc = await Chat.findById(chatId);
  if (!chatDoc) return res.status(404).json({ message: "Chat not found" });
  if (chatDoc.closed) return res.status(400).json({ message: "Chat is closed" });

  const msg = await Message.create({
    chatId,
    senderId: req.user._id,
    message: safeText
  });

  await Chat.findByIdAndUpdate(chatId, {
    lastMessage: safeText,
    lastMessageAt: new Date()
  });

  // send notification to the other user
  const chat = await Chat.findById(chatId).lean();
  if (chat && Array.isArray(chat.users)) {
    const me = req.user._id.toString();
    const recipients = chat.users.map((u) => u.toString()).filter((u) => u !== me);
    if (recipients.length > 0) {
      // Only notify the other participant(s)
      for (const rcp of recipients) {
        await createNotification({
          userId: rcp,
          message: "New message received",
          link: `/chat/${chatId}`
        });
      }
    }
  }

  res.json(msg);
};

// close a chat (participant can close)
exports.closeChat = async (req, res) => {
  const { chatId } = req.params;
  const chatDoc = await Chat.findById(chatId);
  if (!chatDoc) return res.status(404).json({ message: "Chat not found" });
  // Ensure the requester is part of the chat
  const isParticipant = chatDoc.users.some((u) => u.toString() === req.user._id.toString());
  if (!isParticipant) return res.status(403).json({ message: "Not a participant" });

  chatDoc.closed = true;
  chatDoc.closedBy = req.user._id;
  chatDoc.closedAt = new Date();
  await chatDoc.save();
  res.json({ message: "Chat closed" });
};
// presence check for a userId
exports.getPresence = async (req, res) => {
  try {
    const { userId } = req.params;
    const online = global.onlineUsers?.has(userId) || false;
    res.json({ online });
  } catch (e) {
    res.json({ online: false });
  }
};
