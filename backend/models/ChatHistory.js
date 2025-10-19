const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["user", "assistant", "error"],
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  isFile: {
    type: Boolean,
    default: false,
  },
  isSummary: {
    type: Boolean,
    default: false,
  },
  fileName: {
    type: String,
    default: null,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const chatHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  sessionId: {
    type: String,
    required: true,
    index: true,
  },
  messages: [messageSchema],
  lastActive: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for efficient queries
chatHistorySchema.index({ userId: 1, lastActive: -1 });

const ChatHistory = mongoose.model("ChatHistory", chatHistorySchema);
module.exports = ChatHistory;