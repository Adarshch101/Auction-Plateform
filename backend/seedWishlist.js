const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Wishlist = require("./models/Wishlist");

dotenv.config();
mongoose.connect(process.env.MONGO_URI);

async function seed() {
  await Wishlist.deleteMany();

  await Wishlist.insertMany([
    {
      userId: "674abc1234567890abcdef99",
      items: [
        { auctionId: "674abc1234567890aaaaaaa1" },
        { auctionId: "674abc1234567890aaaaaaa4" },
        { auctionId: "674abc1234567890aaaaaaa8" }
      ]
    },
    {
      userId: "674abc1234567890abcdef88",
      items: [
        { auctionId: "674abc1234567890aaaaaaa2" },
        { auctionId: "674abc1234567890aaaaaaa3" }
      ]
    },
    {
      userId: "674abc1234567890abcdef77",
      items: [
        { auctionId: "674abc1234567890aaaaaaa7" },
        { auctionId: "674abc1234567890aaaaaa10" }
      ]
    },
    {
      userId: "674abc1234567890abcdef66",
      items: [
        { auctionId: "674abc1234567890aaaaaaa9" }
      ]
    },
    {
      userId: "674abc1234567890abcdef55",
      items: [
        { auctionId: "674abc1234567890aaaaaaa5" },
        { auctionId: "674abc1234567890aaaaaaa8" }
      ]
    }
  ]);

  console.log("✔ Seeded 5 Wishlists");
  process.exit();
}

seed();
