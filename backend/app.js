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

// CORS Configuration - MUST be before other middleware
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      "https://health-mate-pearl.vercel.app",
      "https://health-mate-s6gc.vercel.app", 
      "http://localhost:5173"
    ];
    
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['set-cookie']
};

app.use(cors(corsOptions));

// Handle preflight requests explicitly
app.options('*', cors(corsOptions));

app.use(express.json());
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
    environment: process.env.NODE_ENV || 'development',
    endpoints: {
      healthmate: "/api/healthmate",
      summarize: "/api/summarize",
      users: "/api/users",
      chat: "/api/chat",
      vitals: "/api/vitals",
    },
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

module.exports = app;