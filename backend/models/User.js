const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, default: "user" }, // user, admin, seller
    phone: { type: String, default: "" },
    address: { type: String, default: "" },
    avatar: { type: String, default: "" },
    wallet: { type: Number, default: 0 },
    kycVerified: { type: Boolean, default: false },
    kycRequested: { type: Boolean, default: false },
    storeBio: { type: String, default: "" },
    instagram: { type: String, default: "" },
    website: { type: String, default: "" },
    prefs: {
      type: Object,
      default: {
        notifyOnBid: true,
        notifyOnOrder: true,
        allowOfferMessages: true,
        defaultShippingProvider: "Custom",
        defaultHandlingDays: 3,
        requireKYC: false,
        payoutMethod: "bank",
      }
    }
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
