const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

// Login
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json("No record found");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json("Incorrect password");
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "2d" }
    );

    return res.json({
      message: "success",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json("Something went wrong");
  }
};

// Register
const register = async (req, res) => {
  try {
    const { name, email, password, profileImage } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      profileImage,
    });
    res.json({ message: "User registered successfully", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get current user
const getCurrentUser = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("Get current user error:", err);
    res.status(500).json({ error: "Failed to get user" });
  }
};

// Mail send
const sendWelcomeEmail = async (req, res) => {
  const { email, name } = req.body;

  try {
    await sendEmail(
      email,
      "Welcome to Hackathon App",
      `<p>Hi <b>${name}</b>, your account has been created successfully.</p>`
    );
    res.status(200).json({ message: "Email sent successfully" });
  } catch (err) {
    console.error("Email error:", err.message);
    res.status(500).json({ error: "Failed to send email" });
  }
};

module.exports = {
  register,
  login,
  getCurrentUser,
  sendWelcomeEmail,
};