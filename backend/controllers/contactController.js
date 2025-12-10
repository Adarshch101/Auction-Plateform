const ContactMessage = require("../models/ContactMessage");
const User = require("../models/User");
const { createNotification } = require("./notificationController");

exports.createContact = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body || {};
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const doc = await ContactMessage.create({
      name,
      email,
      subject,
      message,
      userId: req.user?._id,
      meta: { ip: req.ip, ua: req.headers["user-agent"] }
    });

    // Notify all admins
    try {
      const admins = await User.find({ role: "admin" }, "_id");
      for (const admin of admins) {
        await createNotification({
          userId: admin._id,
          message: `New contact message: ${subject} from ${name}`,
          link: `/admin/notifications`
        });
      }
    } catch (e) {
      // non-fatal
    }

    return res.status(201).json({ message: "Thanks for contacting us!", id: doc._id });
  } catch (err) {
    next(err);
  }
};
