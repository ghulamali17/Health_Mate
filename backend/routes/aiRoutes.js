const express = require("express");
const multer = require("multer");
const router = express.Router();
const aiController = require("../controllers/aiController");
const upload = require("../middlewares/upload");

// AI routes
router.get("/health", aiController.healthCheck); 
router.post("/healthmate", aiController.healthMate);

router.post("/summarize", (req, res, next) => {
  console.log("📤 File upload request received");
  console.log("Content-Type:", req.headers['content-type']);
  
  upload.single("file")(req, res, function(err) {
    if (err instanceof multer.MulterError) {
      console.error("❌ Multer error:", err.code, err.message);
      
      // Multer-specific errors
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          error: "File too large. Please upload files smaller than 10MB."
        });
      }
      
      if (err.code === 'LIMIT_FILE_COUNT') {
        return res.status(400).json({
          success: false,
          error: "Too many files. Please upload only one file at a time."
        });
      }
      
      if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.status(400).json({
          success: false,
          error: "Unexpected file field. Please use 'file' as the field name."
        });
      }
      
      return res.status(400).json({
        success: false,
        error: `File upload error: ${err.message}`
      });
    } else if (err) {
      console.error("❌ File validation error:", err.message);
      return res.status(400).json({
        success: false,
        error: err.message
      });
    }
    
    // No error, proceed to controller
    console.log("✅ File upload middleware passed");
    next();
  });
}, aiController.summarizeFile);

module.exports = router;