// middlewares/authMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const connectDB = require("../connection");

const authMiddleware = async (req, res, next) => {
  try {
    await connectDB();

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("🔐 No token - proceeding as guest");
      req.user = null;
      return next();
    }

    const token = authHeader.split(" ")[1];
    
    if (!token) {
      console.log("🔐 Empty token - proceeding as guest");
      req.user = null;
      return next();
    }

    // Verify the token
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user by ID
      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        console.log("🔐 User not found - proceeding as guest");
        req.user = null;
        return next();
      }

      // Attach user to request object
      req.user = user;
      console.log("🔐 User authenticated:", user._id);
      next();
    } catch (tokenError) {
   
      console.log("🔐 Token error - proceeding as guest:", tokenError.message);
      req.user = null;
      return next();
    }
  } catch (err) {
    console.error("Auth middleware error:", err.message);
   
    req.user = null;
    return next();
  }
};

module.exports = authMiddleware;