const express = require("express");
const multer = require("multer");
const router = express.Router();
const aiController = require("../controllers/aiController");
const upload = require("../middlewares/upload");

// Health endpoint
router.get("/health", aiController.healthCheck);

// healthlens chat endpoint
router.post("/healthlens", aiController.healthlens);

// File summarization
router.post(
  "/summarize",
  (req, res, next) => {
    console.log("📤 File upload request received");
    console.log("Content-Type:", req.headers["content-type"]);
    console.log("Origin:", req.headers["origin"]);

    upload.single("file")(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        console.error("❌ Multer error:", err.code, err.message);

        // Multer-specific errors
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({
            success: false,
            error: "File too large. Please upload files smaller than 10MB.",
          });
        }

        if (err.code === "LIMIT_FILE_COUNT") {
          return res.status(400).json({
            success: false,
            error: "Too many files. Please upload only one file at a time.",
          });
        }

        if (err.code === "LIMIT_UNEXPECTED_FILE") {
          return res.status(400).json({
            success: false,
            error:
              "Unexpected file field. Please use 'file' as the field name.",
          });
        }

        if (err.code === "LIMIT_FIELD_KEY") {
          return res.status(400).json({
            success: false,
            error: "Field name too long",
          });
        }

        if (err.code === "LIMIT_FIELD_VALUE") {
          return res.status(400).json({
            success: false,
            error: "Field value too long",
          });
        }

        if (err.code === "LIMIT_FIELD_COUNT") {
          return res.status(400).json({
            success: false,
            error: "Too many fields",
          });
        }

        if (err.code === "LIMIT_PART_COUNT") {
          return res.status(400).json({
            success: false,
            error: "Too many parts",
          });
        }

        return res.status(400).json({
          success: false,
          error: `File upload error: ${err.message}`,
        });
      } else if (err) {
        console.error("❌ File validation error:", err.message);
        return res.status(400).json({
          success: false,
          error: err.message || "File upload failed",
        });
      }

      console.log("✅ File upload middleware passed");
      console.log(
        "File details:",
        req.file
          ? {
              name: req.file.originalname,
              size: req.file.size,
              type: req.file.mimetype,
            }
          : "No file"
      );

      next();
    });
  },
  aiController.summarizeFile
);

module.exports = router;
