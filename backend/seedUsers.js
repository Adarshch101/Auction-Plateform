const mongoose = require("mongoose");
const User = require("./models/User");
const dotenv = require("dotenv");
dotenv.config();
mongoose.connect(process.env.MONGO_URI);

async function seed() {
  await User.deleteMany();

  await User.insertMany([
    { _id: "674abc1234567890abcdef99", name: "Test User 1", email:"u1@test.com", password:"123456" },
    { _id: "674abc1234567890abcdef88", name: "Test User 2", email:"u2@test.com", password:"123456" },
    { _id: "674abc1234567890abcdef77", name: "Test User 3", email:"u3@test.com", password:"123456" },
    { _id: "674abc1234567890abcdef66", name: "Test User 4", email:"u4@test.com", password:"123456" },
    { _id: "674abc1234567890abcdef55", name: "Test User 5", email:"u5@test.com", password:"123456" },
  ]);

  console.log("✔ Seeded Users");
  process.exit();
}

seed();
