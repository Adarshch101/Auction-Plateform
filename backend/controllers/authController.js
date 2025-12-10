const User = require("../models/User.js");
const jwt = require("jsonwebtoken");

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
  const user = await User.findOne({ email: req.body.email });

  if (!user || !(await user.matchPassword(req.body.password)))
    return res.status(400).json({ message: "Invalid credentials" });

  res.json({
    token: genToken(user._id),
    role: user.role,
    userId: user._id
  });
};
