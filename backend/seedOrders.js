const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Order = require("./models/Order");

dotenv.config();
mongoose.connect(process.env.MONGO_URI);

async function seed() {
  await Order.deleteMany();

  await Order.insertMany([
    {
      buyerId: "674abc1234567890abcdef99",
      sellerId: "674abc1234567890abcdef12",
      auctionId: "674abc1234567890aaaaaaa5",
      amount: 15000
    },
    {
      buyerId: "674abc1234567890abcdef88",
      sellerId: "674abc1234567890abcdef12",
      auctionId: "674abc1234567890aaaaaa10",
      amount: 26000
    },
    {
      buyerId: "674abc1234567890abcdef77",
      sellerId: "674abc1234567890abcdef12",
      auctionId: "674abc1234567890aaaaaaa2",
      amount: 21000
    },
    {
      buyerId: "674abc1234567890abcdef66",
      sellerId: "674abc1234567890abcdef12",
      auctionId: "674abc1234567890aaaaaaa7",
      amount: 9000
    },
    {
      buyerId: "674abc1234567890abcdef55",
      sellerId: "674abc1234567890abcdef12",
      auctionId: "674abc1234567890aaaaaaa8",
      amount: 15000
    }
  ]);

  console.log("✔ Seeded 5 Orders");
  process.exit();
}

seed();
