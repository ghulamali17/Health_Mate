const express = require("express");
const {
  register,
  login,
  getCurrentUser,
} = require("../controllers/userController");

const userRouter = express.Router();

// Login
userRouter.post("/login", login);

// Register
userRouter.post("/register", register);

// Get current user
userRouter.get("/current", getCurrentUser);

module.exports = userRouter;
