const mongoose = require("mongoose");

const kycSubmissionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    idProofUrl: { type: String, default: "" },
    addressProofUrl: { type: String, default: "" },
    bankProofUrl: { type: String, default: "" },
    note: { type: String, default: "" },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    reviewedAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("KycSubmission", kycSubmissionSchema);
