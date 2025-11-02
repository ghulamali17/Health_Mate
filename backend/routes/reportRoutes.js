const express = require("express");
const router = express.Router();
const Report = require("../models/Report");
const authMiddleware = require("../middlewares/authMiddleware");
const fileUploadService = require("../services/fileUploadService");

// Get all reports for logged-in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const reports = await Report.find({ userId: req.user._id })
      .sort({ uploadedAt: -1 })
      .select("-extractedText"); 

    res.json({
      success: true,
      reports,
    });
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({ error: "Failed to fetch reports" });
  }
});

// Get single report
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const report = await Report.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!report) {
      return res.status(404).json({ error: "Report not found" });
    }

    res.json({
      success: true,
      report,
    });
  } catch (error) {
    console.error("Error fetching report:", error);
    res.status(500).json({ error: "Failed to fetch report" });
  }
});

// Delete report
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const report = await Report.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!report) {
      return res.status(404).json({ error: "Report not found" });
    }

    // Delete from Cloudinary
    try {
      await fileUploadService.deleteFromCloudinary(report.cloudinaryPublicId);
    } catch (err) {
      console.error("Failed to delete from Cloudinary:", err);
    }

    // Delete from database
    await Report.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Report deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting report:", error);
    res.status(500).json({ error: "Failed to delete report" });
  }
});

module.exports = router;