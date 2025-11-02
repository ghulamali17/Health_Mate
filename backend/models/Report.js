const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    cloudinaryPublicId: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      required: true,
      enum: ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain"],
    },
    fileSize: {
      type: Number, 
      required: true,
    },
    reportType: {
      type: String,
      enum: ["lab", "prescription", "xray", "scan", "general", "other"],
      default: "general",
    },
    aiSummary: {
      type: String,
      default: null,
    },
    extractedText: {
      type: String,
      default: null,
    },
    tags: [{
      type: String,
    }],
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
    lastAccessedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
reportSchema.index({ userId: 1, uploadedAt: -1 });
reportSchema.index({ tags: 1 });

const Report = mongoose.model("Report", reportSchema);

module.exports = Report;