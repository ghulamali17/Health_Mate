const express = require("express");
const cors = require("cors");
const userRouter = require("./routes/userRoutes");
const chatRouter = require("./routes/chatRoutes");
const cookieParser = require("cookie-parser");
const vitalRouter = require("./routes/vitalRoutes");
const healthmateRouter = require("./routes/healthmateRoutes");
const summarizeRouter = require("./routes/summarizeRoutes");
const reportRoutes = require("./routes/reportRoutes");

const app = express();

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      "https://health-mate-pearl.vercel.app",
      "https://health-mate-s6gc.vercel.app", 
      "http://localhost:5173"
    ];
    
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('CORS blocked for origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  preflightContinue: false,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

// Handle preflight requests globally
app.options('*', cors(corsOptions));
// app.use(
//   cors({
//     origin: [
//       "https://health-mate-pearl.vercel.app",
//       "https://health-mate-s6gc.vercel.app", 
//       "http://localhost:5173"
//     ],
//     credentials: true,
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
//   })
// );

// // Handle preflight requests
// app.options('*', cors());

app.use(express.json());
app.use(cookieParser());

app.use("/images", express.static("public/images"));

// verify required environment variables
const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingEnvVars);
  if (process.env.NODE_ENV !== 'production') {
    process.exit(1);
  }
}

// Routes
app.use("/api/users", userRouter);
app.use("/api/chat", chatRouter);
app.use("/api/vitals", vitalRouter);
app.use("/api/healthmate", healthmateRouter);
app.use("/api/summarize", summarizeRouter);
app.use("/api/reports", reportRoutes);

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

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
});

module.exports = app;