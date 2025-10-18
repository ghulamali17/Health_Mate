const express = require("express");
const { register, login,sendWelcomeEmail} = require("../controllers/userController");

const userRouter = express.Router();

// login
userRouter.post("/login", login);

// register
userRouter.post("/register", register);

// welcome email 
userRouter.post("/send-email", sendWelcomeEmail)

module.exports = userRouter;
