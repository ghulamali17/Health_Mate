const ChatHistory = require("../models/ChatHistory");

// Save a message to chat history
const saveMessage = async (req, res) => {
  try {
    const { userId, sessionId, message } = req.body;

    if (!userId || !sessionId || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    let chat = await ChatHistory.findOne({ userId, sessionId });

    if (!chat) {
      chat = new ChatHistory({
        userId,
        sessionId,
        messages: [message],
      });
    } else {
      chat.messages.push(message);
      chat.lastActive = new Date();
    }

    await chat.save();
    res.json({ success: true, chat });
  } catch (err) {
    console.error("Save message error:", err);
    res.status(500).json({ error: "Failed to save message" });
  }
};

// Get chat history for a specific session
const getChatHistory = async (req, res) => {
  try {
    const { userId, sessionId } = req.params;

    const chat = await ChatHistory.findOne({ userId, sessionId });

    if (!chat) {
      return res.json({ messages: [] });
    }

    res.json({ messages: chat.messages });
  } catch (err) {
    console.error("Get chat history error:", err);
    res.status(500).json({ error: "Failed to fetch chat history" });
  }
};

// Get all chat sessions for a user
const getAllSessions = async (req, res) => {
  try {
    const { userId } = req.params;

    const sessions = await ChatHistory.find({ userId })
      .sort({ lastActive: -1 })
      .select("sessionId lastActive createdAt messages")
      .lean();

    const formattedSessions = sessions.map((session) => ({
      sessionId: session.sessionId,
      lastActive: session.lastActive,
      createdAt: session.createdAt,
      messageCount: session.messages.length,
      preview: session.messages[0]?.text.substring(0, 50) || "New conversation",
    }));

    res.json({ sessions: formattedSessions });
  } catch (err) {
    console.error("Get sessions error:", err);
    res.status(500).json({ error: "Failed to fetch sessions" });
  }
};

// Delete a chat session
const deleteSession = async (req, res) => {
  try {
    const { userId, sessionId } = req.params;

    await ChatHistory.findOneAndDelete({ userId, sessionId });

    res.json({ success: true, message: "Session deleted successfully" });
  } catch (err) {
    console.error("Delete session error:", err);
    res.status(500).json({ error: "Failed to delete session" });
  }
};

// Clear all messages in a session
const clearSession = async (req, res) => {
  try {
    const { userId, sessionId } = req.params;

    const chat = await ChatHistory.findOne({ userId, sessionId });

    if (!chat) {
      return res.status(404).json({ error: "Session not found" });
    }

    chat.messages = [];
    chat.lastActive = new Date();
    await chat.save();

    res.json({ success: true, message: "Session cleared successfully" });
  } catch (err) {
    console.error("Clear session error:", err);
    res.status(500).json({ error: "Failed to clear session" });
  }
};

module.exports = {
  saveMessage,
  getChatHistory,
  getAllSessions,
  deleteSession,
  clearSession
};