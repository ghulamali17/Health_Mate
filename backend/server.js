const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration
const allowedOrigins = [
  "http://localhost:5173",
  "https://health-mate-dcv3.vercel.app",
  "https://health-mate-3x6x-h4sg0hzj5-ghulam-alis-projects-b7b1d0e4.vercel.app",
  "https://health-mate-git-main-ghulam-alis-projects-b7b1d0e4.vercel.app",
  "https://health-mate-*.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.some(allowedOrigin => {
      if (allowedOrigin.includes('*')) {
        const regex = new RegExp(allowedOrigin.replace('*', '.*'));
        return regex.test(origin);
      }
      return allowedOrigin === origin;
    })) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
}));

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

// Static files
app.use("/images", express.static("public/images"));

// Database connection
connectDB();

// Import routes
const userRoutes = require("./routes/userRoutes");
const aiRoutes = require("./routes/aiRoutes");
const healthRoutes = require("./routes/healthRoutes");

// Use routes
app.use("/api/users", userRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/health", healthRoutes);

// Root endpoint
app.get("/", (req, res) => {
  res.json({ 
    success: true,
    message: "HealthMate Backend API is running!",
    version: "1.0.0",
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: "/api/health",
      users: "/api/users",
      ai: "/api/ai"
    }
  });
});

// 404 handler for undefined routes
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
    path: req.originalUrl,
    availableEndpoints: {
      health: "/api/health",
      users: "/api/users",
      ai: "/api/ai"
    }
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);
  res.status(500).json({
    success: false,
    error: "Internal server error",
    details: process.env.NODE_ENV === 'production' ? "Something went wrong" : error.message
  });
});

// Export the app for Vercel
module.exports = app;

// Start server only in local development
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`✅ Server is running at http://localhost:${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}