const express = require("express");
const {
  saveMessage,
  getChatHistory,
  getAllSessions,
  deleteSession,
  clearSession,
} = require("../controllers/chatController");

const chatRouter = express.Router();

// Save a message
chatRouter.post("/save", saveMessage);

// Get chat history for a session
chatRouter.get("/history/:userId/:sessionId", getChatHistory);

// Get all sessions for a user
chatRouter.get("/sessions/:userId", getAllSessions);

// Delete a session
chatRouter.delete("/session/:userId/:sessionId", deleteSession);

// Clear a session
chatRouter.put("/session/clear/:userId/:sessionId", clearSession);

module.exports = chatRouter;