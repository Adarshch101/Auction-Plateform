const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Auction = require("./models/Auction");

dotenv.config();
mongoose.connect(process.env.MONGO_URI);

async function seed() {
  await Auction.deleteMany();

  await Auction.insertMany([
    {
      _id: "674abc1234567890aaaaaaa1",
      title: "Vintage Brass Compass",
      image: "https://i.ibb.co/Gd1B9kV/antique-compass.jpg",
      category: "artifacts",
      startingPrice: 5000,
      currentPrice: 5000,
      status: "active",
      startTime: new Date(Date.now() - 1000 * 60 * 5),
      endTime: new Date(Date.now() + 1000 * 60 * 60),
      sellerId: "674abc1234567890abcdef12"
    },
    {
      _id: "674abc1234567890aaaaaaa2",
      title: "Roman Bronze Warrior Statue",
      image: "https://i.ibb.co/TP9zG6k/vintage-clock.jpg",
      category: "sculpture",
      startingPrice: 20000,
      currentPrice: 20000,
      status: "active",
      startTime: new Date(),
      endTime: new Date(Date.now() + 1000 * 60 * 20),
      sellerId: "674abc1234567890abcdef12"
    },
    {
      _id: "674abc1234567890aaaaaaa3",
      title: "Persian Dagger (Silver)",
      image: "https://i.ibb.co/hcHCtF5/persian-dagger.jpg",
      category: "weapons",
      startingPrice: 8000,
      currentPrice: 8000,
      status: "upcoming",
      startTime: new Date(Date.now() + 86400000),
      endTime: new Date(Date.now() + 90000000),
      sellerId: "674abc1234567890abcdef12"
    },
    {
      _id: "674abc1234567890aaaaaaa4",
      title: "Ottoman Empire Coin Set",
      image: "https://i.ibb.co/k4pJHcM/coins.jpg",
      category: "coins",
      startingPrice: 3500,
      currentPrice: 3500,
      status: "active",
      startTime: new Date(),
      endTime: new Date(Date.now() + 7200000),
      sellerId: "674abc1234567890abcdef12"
    },
    {
      _id: "674abc1234567890aaaaaaa5",
      title: "Victorian Era Pocket Watch",
      image: "https://i.ibb.co/mHWSbwR/pocket-watch.jpg",
      category: "watches",
      startingPrice: 15000,
      currentPrice: 15000,
      status: "ended",
      startTime: new Date(Date.now() - 90000000),
      endTime: new Date(Date.now() - 80000000),
      sellerId: "674abc1234567890abcdef12"
    },
    {
      _id: "674abc1234567890aaaaaaa6",
      title: "Japanese Katana (1860)",
      image: "https://i.ibb.co/H7xhZfh/katana.jpg",
      category: "weapons",
      startingPrice: 45000,
      currentPrice: 45000,
      status: "upcoming",
      startTime: new Date(Date.now() + 172800000),
      endTime: new Date(Date.now() + 180000000),
      sellerId: "674abc1234567890abcdef12"
    },
    {
      _id: "674abc1234567890aaaaaaa7",
      title: "Ancient Greek Vase",
      image: "https://i.ibb.co/Rz5g7vh/greek-vase.jpg",
      category: "artifacts",
      startingPrice: 7000,
      currentPrice: 7000,
      status: "active",
      startTime: new Date(),
      endTime: new Date(Date.now() + 5400000),
      sellerId: "674abc1234567890abcdef12"
    },
    {
      _id: "674abc1234567890aaaaaaa8",
      title: "Rare Mughal Miniature Painting",
      image: "https://i.ibb.co/Pm8Z0Km/mughal-painting.jpg",
      category: "paintings",
      startingPrice: 12000,
      currentPrice: 12000,
      status: "active",
      startTime: new Date(),
      endTime: new Date(Date.now() + 3000000),
      sellerId: "674abc1234567890abcdef12"
    },
    {
      _id: "674abc1234567890aaaaaaa9",
      title: "Queen Victoria Royal Letter",
      image: "https://i.ibb.co/WcV98GL/royal-letter.jpg",
      category: "documents",
      startingPrice: 9000,
      currentPrice: 9000,
      status: "upcoming",
      startTime: new Date(Date.now() + 86400000 * 3),
      endTime: new Date(Date.now() + 86400000 * 3 + 7200000),
      sellerId: "674abc1234567890abcdef12"
    },
    {
      _id: "674abc1234567890aaaaaa10",
      title: "Viking Shield Replica",
      image: "https://i.ibb.co/5MRyqCL/viking-shield.jpg",
      category: "weapons",
      startingPrice: 25000,
      currentPrice: 25000,
      status: "ended",
      startTime: new Date(Date.now() - 86400000 * 2),
      endTime: new Date(Date.now() - 86400000),
      sellerId: "674abc1234567890abcdef12"
    }
  ]);

  console.log("✔ Seeded 10 Auctions");
  process.exit();
}

seed();