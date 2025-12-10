const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary.js");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: "auctions",
      allowed_formats: ["jpg", "png", "jpeg"],
      public_id: `${Date.now()}-${file.originalname}`
    };
  }
});

// IMPORTANT FIX → create multer instance
const upload = multer({ storage });
// Also provide a memory storage fallback (captures file.buffer) so we can manually upload
const memoryStorage = multer.memoryStorage();
const memoryUpload = multer({ storage: memoryStorage });

exports.upload = upload;
exports.memory = memoryUpload;
