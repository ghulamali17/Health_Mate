const bcrypt = require("bcryptjs");
const User = require("./models/User");
const connectDB = require("./connection");
require("dotenv").config();

const register = async () => {
  try {
    await connectDB(); 

    const existingUser = await User.findOne({ email: process.env.ADMIN_EMAIL });
    if (existingUser) {
      console.log("Admin already exists.");
      return;
    }

    const hashPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

    const newUser = new User({
      name: "admin",
      email: process.env.ADMIN_EMAIL,
      password: hashPassword,
      role: "admin",
    });

    await newUser.save();
    console.log("Admin successfully created");
  } catch (error) {
    console.log("Seeding error:", error.message);
  }
};

register();
