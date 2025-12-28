const app = require("../app");
const connectDB = require("../connection");

let dbConnected = false;

const handler = async (req, res) => {
  try {
    if (!dbConnected) {
      await connectDB();
      dbConnected = true;
      console.log("✅ Database connected successfully");
    }

    return app(req, res);
  } catch (error) {
    console.error("❌ Server error:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: error.message,
      ...(process.env.NODE_ENV !== "production" && { stack: error.stack }),
    });
  }
};

module.exports = handler;
