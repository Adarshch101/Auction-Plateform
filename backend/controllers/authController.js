const User = require("../models/User.js");
const jwt = require("jsonwebtoken");
const { sendMail } = require("../config/mailer.js");

const genToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });


exports.registerUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.json({
      token: genToken(user._id),
      role: user.role,
      userId: user._id
    });
  } catch (err) {
    res.status(400).json({ error: err });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password, otp } = req.body || {};
  const user = await User.findOne({ email });

  if (!user || !(await user.matchPassword(password))) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  // If 2FA is enabled, require OTP per login
  if (user.twoFactorEnabled) {
    // If OTP is provided, verify it
    if (otp) {
      if (!user.twoFactorTempOtp || !user.twoFactorOtpExpires) {
        return res.status(400).json({ message: "OTP not requested" });
      }
      if (new Date(user.twoFactorOtpExpires).getTime() < Date.now()) {
        return res.status(400).json({ message: "OTP expired" });
      }
      if (String(otp).trim() !== String(user.twoFactorTempOtp).trim()) {
        return res.status(400).json({ message: "Invalid OTP" });
      }
      // OTP OK -> clear and login
      user.twoFactorTempOtp = "";
      user.twoFactorOtpExpires = null;
      await user.save();

      return res.json({ token: genToken(user._id), role: user.role, userId: user._id });
    }

    // No OTP supplied: generate and email one, then ask client to provide it
    const loginOtp = String(Math.floor(100000 + Math.random() * 900000));
    const expires = new Date(Date.now() + 1* 60 * 1000);
    user.twoFactorTempOtp = loginOtp;
    user.twoFactorOtpExpires = expires;
    await user.save();

    try {
      await sendMail({
        to: user.email,
        subject: "Your login verification code",
        text: `Your login code is ${loginOtp}. It expires in 10 minutes.`,
        html: `<p>Your login verification code is</p><h2>${loginOtp}</h2><p>It expires in ${expires} minutes.</p>`,
      });
    } catch (e) {
      // log and still allow dev testing by returning OTP in non-prod
      console.warn("[login 2FA] Failed to send OTP email:", e?.message);
    }

    const body = { require2fa: true, message: "OTP sent to your email" };
    if (process.env.NODE_ENV !== 'production') body.otp = loginOtp;
    return res.json(body);
  }

  // No 2FA -> normal login
  return res.json({ token: genToken(user._id), role: user.role, userId: user._id });
};
