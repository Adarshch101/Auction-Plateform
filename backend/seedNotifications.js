const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Notification = require("./models/Notification");

dotenv.config();
mongoose.connect(process.env.MONGO_URI);

async function seed() {
  await Notification.deleteMany();

  await Notification.insertMany([
    {
      userId: "674abc1234567890abcdef99",
      message: "Auction ending soon: Vintage Compass",
      link: "/auction/674abc1234567890aaaaaaa1",
      read: false
    },
    {
      userId: "674abc1234567890abcdef99",
      message: "Your bid on Mughal Painting was beaten!",
      link: "/auction/674abc1234567890aaaaaaa8",
      read: false
    },
    {
      userId: "674abc1234567890abcdef88",
      message: "Auction starts tomorrow: Persian Dagger",
      link: "/auction/674abc1234567890aaaaaaa3",
      read: true
    },
    {
      userId: "674abc1234567890abcdef77",
      message: "New bid placed successfully",
      link: "/auction/674abc1234567890aaaaaaa7",
      read: true
    },
    {
      userId: "674abc1234567890abcdef66",
      message: "Auction won: Victorian Pocket Watch",
      link: "/auction/674abc1234567890aaaaaaa5",
      read: false
    },
    {
      userId: "674abc1234567890abcdef55",
      message: "Item added to wishlist",
      link: "/wishlist",
      read: true
    }
  ]);

  console.log("✔ Seeded 6 Notifications");
  process.exit();
}

seed();
