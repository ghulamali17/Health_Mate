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

// CORS Configuration 
const allowedOrigins = [
  "https://health-mate-dcv3.vercel.app",
  "http://localhost:5173",
  "https://your-frontend-domain.vercel.app" 
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log(`Blocked by CORS: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

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


// app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

module.exports = app;