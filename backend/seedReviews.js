const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Review = require("./models/Review");

dotenv.config();
mongoose.connect(process.env.MONGO_URI);

async function seed() {
  await Review.deleteMany();

  await Review.insertMany([
    { userId: "674abc1234567890abcdef99", sellerId: "674abc1234567890abcdef12", rating: 5, comment: "Excellent seller!" },
    { userId: "674abc1234567890abcdef88", sellerId: "674abc1234567890abcdef12", rating: 4, comment: "Fast delivery." },
    { userId: "674abc1234567890abcdef77", sellerId: "674abc1234567890abcdef12", rating: 5, comment: "Item was as described." },
    { userId: "674abc1234567890abcdef66", sellerId: "674abc1234567890abcdef12", rating: 4, comment: "Packaging could be better." },
    { userId: "674abc1234567890abcdef55", sellerId: "674abc1234567890abcdef12", rating: 3, comment: "Good but slow shipping." },

    { userId: "674abc1234567890abcdef99", sellerId: "674abc1234567890abcdef12", rating: 5, comment: "Amazing quality collectibles." },
    { userId: "674abc1234567890abcdef88", sellerId: "674abc1234567890abcdef12", rating: 4, comment: "Great communication!" },
    { userId: "674abc1234567890abcdef77", sellerId: "674abc1234567890abcdef12", rating: 5, comment: "Highly recommended!" },
    { userId: "674abc1234567890abcdef66", sellerId: "674abc1234567890abcdef12", rating: 2, comment: "Item was slightly scratched." },
    { userId: "674abc1234567890abcdef55", sellerId: "674abc1234567890abcdef12", rating: 4, comment: "Good experience." },
  ]);

  console.log("✔ Seeded 10 Reviews");
  process.exit();
}

seed();
