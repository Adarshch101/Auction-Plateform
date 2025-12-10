const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Bid = require("../backend/models/Bid");

dotenv.config();
mongoose.connect(process.env.MONGO_URI);

async function seed() {
  await Bid.deleteMany();

  await Bid.insertMany([
    { auctionId: "674abc1234567890aaaaaaa1", userId: "674abc1234567890abcdef99", amount: 5200 },
    { auctionId: "674abc1234567890aaaaaaa1", userId: "674abc1234567890abcdef88", amount: 5400 },
    { auctionId: "674abc1234567890aaaaaaa2", userId: "674abc1234567890abcdef77", amount: 21000 },
    { auctionId: "674abc1234567890aaaaaaa7", userId: "674abc1234567890abcdef55", amount: 8000 },
    { auctionId: "674abc1234567890aaaaaaa7", userId: "674abc1234567890abcdef66", amount: 9000 },
    { auctionId: "674abc1234567890aaaaaaa8", userId: "674abc1234567890abcdef77", amount: 15000 },
    { auctionId: "674abc1234567890aaaaaaa8", userId: "674abc1234567890abcdef99", amount: 15500 },
    { auctionId: "674abc1234567890aaaaaa10", userId: "674abc1234567890abcdef88", amount: 26000 },
  ]);

  console.log("✔ Seeded 8 Bids");
  process.exit();
}

seed();
