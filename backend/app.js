const express = require("express");
const cors = require("cors");
const connectDB = require("./connection");
const userRouter = require("./routes/userRoutes");
const chatRouter = require("./routes/chatRoutes");
const cookieParser = require("cookie-parser");
const vitalRouter = require("./routes/vitalRoutes");
const healthmateRouter = require("./routes/healthmateRoutes");
const summarizeRouter = require("./routes/summarizeRoutes");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use("/images", express.static("public/images"));

// MongoDB connection
connectDB();

// Routes
app.use("/api/users", userRouter);
app.use("/api/chat", chatRouter);
app.use("/api/vitals", vitalRouter);
app.use("/api/healthmate", healthmateRouter);
app.use("/api/summarize", summarizeRouter);

// Root endpoint
app.get("/", (req, res) => {
  res.json({ 
    message: "HealthMate Backend API is running!",
    version: "1.0.0",
    endpoints: {
      healthmate: "/api/healthmate",
      summarize: "/api/summarize",
      users: "/api/users",
      chat: "/api/chat",
      vitals: "/api/vitals"
    }
  });
});

module.exports = app;