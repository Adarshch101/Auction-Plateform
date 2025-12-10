const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Chat = require("./models/Chat");
const Message = require("./models/Message");

dotenv.config();
mongoose.connect(process.env.MONGO_URI);

async function seed(clear = true) {
  if (clear) {
    await Chat.deleteMany();
    await Message.deleteMany();
  }

  // Use your existing auction IDs
  const auctionIds = [
    "674abc1234567890aaaaaaa1",
    "674abc1234567890aaaaaaa2",
    "674abc1234567890aaaaaaa3",
    "674abc1234567890aaaaaaa4",
    "674abc1234567890aaaaaaa5"
  ];

  // user IDs
  const buyers = [
    "674abc1234567890abcdef99",
    "674abc1234567890abcdef88",
    "674abc1234567890abcdef77",
    "674abc1234567890abcdef66",
    "674abc1234567890abcdef55"
  ];

  const sellerId = "674abc1234567890abcdef12";

  const chats = [];

  // Create 5 chats (each linked to an auction)
  for (let i = 0; i < 5; i++) {
    const chat = await Chat.create({
      users: [buyers[i], sellerId],
      auctionId: auctionIds[i]  // FIXED: add required field
    });
    chats.push(chat);
  }

  // Insert messages for each chat
  await Message.insertMany([
    {
      chatId: chats[0]._id,
      senderId: buyers[0],
      text: "Hi, is this authentic?"
    },
    {
      chatId: chats[0]._id,
      senderId: sellerId,
      text: "Yes, fully certified!"
    },
    {
      chatId: chats[1]._id,
      senderId: buyers[1],
      text: "Can you ship tomorrow?"
    },
    {
      chatId: chats[1]._id,
      senderId: sellerId,
      text: "Absolutely, yes."
    },
    {
      chatId: chats[2]._id,
      senderId: buyers[2],
      text: "Any defects on the item?"
    },
    {
      chatId: chats[2]._id,
      senderId: sellerId,
      text: "Perfect condition."
    },
    {
      chatId: chats[3]._id,
      senderId: buyers[3],
      text: "Can I see more pictures?"
    },
    {
      chatId: chats[3]._id,
      senderId: sellerId,
      text: "Sending now!"
    },
    {
      chatId: chats[4]._id,
      senderId: buyers[4],
      text: "Is the price negotiable?"
    },
    {
      chatId: chats[4]._id,
      senderId: sellerId,
      text: "Bid to win! 😊"
    },
  ]);

  console.log("✔ Seeded 5 Chats & 10 Messages");
  process.exit();
}

seed();
