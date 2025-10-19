import React, { useState, useRef, useEffect } from "react";
import { Send, Loader2, Upload, FileText, AlertCircle, History, Trash2, PlusCircle } from "lucide-react";
import Logo from "../assets/logo2.png";
import { useAuth } from "../context/authContext";
import axios from "axios";
import "./styles.css";

const Healthmate = () => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [conversation, setConversation] = useState([]);
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [sessions, setSessions] = useState([]);
  const scrollRef = useRef(null);
  const textareaRef = useRef(null);

  const { user: authUser } = useAuth();

  // Generate session ID
  useEffect(() => {
    const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setSessionId(newSessionId);
  }, []);

  // Fetch current user
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        setLoadingUser(true);
        const token = localStorage.getItem("pos-token");
        if (!token) return;

        const response = await axios.get("http://localhost:3001/api/users/current", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (err) {
        console.error("Failed to fetch user:", err.response?.data || err.message);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchCurrentUser();
  }, []);

  // Load chat history on mount
  useEffect(() => {
    if (user && sessionId) {
      loadChatHistory();
    }
  }, [user, sessionId]);

  // Fetch all sessions
  useEffect(() => {
    if (user) {
      fetchSessions();
    }
  }, [user]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [conversation, loading]);

  const fetchSessions = async () => {
    if (!user) return;
    try {
      const response = await axios.get(`http://localhost:3001/api/chat/sessions/${user._id}`);
      setSessions(response.data.sessions || []);
    } catch (err) {
      console.error("Failed to fetch sessions:", err);
    }
  };

  const loadChatHistory = async () => {
    if (!user || !sessionId) return;
    try {
      const response = await axios.get(
        `http://localhost:3001/api/chat/history/${user._id}/${sessionId}`
      );
      setConversation(response.data.messages || []);
    } catch (err) {
      console.error("Failed to load chat history:", err);
    }
  };

  const saveChatMessage = async (message) => {
    if (!user || !sessionId) return;
    try {
      await axios.post("http://localhost:3001/api/chat/save", {
        userId: user._id,
        sessionId,
        message,
      });
    } catch (err) {
      console.error("Failed to save message:", err);
    }
  };

  const loadSession = async (selectedSessionId) => {
    setSessionId(selectedSessionId);
    setShowHistory(false);
    try {
      const response = await axios.get(
        `http://localhost:3001/api/chat/history/${user._id}/${selectedSessionId}`
      );
      setConversation(response.data.messages || []);
    } catch (err) {
      console.error("Failed to load session:", err);
    }
  };

  const startNewSession = () => {
    const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setSessionId(newSessionId);
    setConversation([]);
    setShowHistory(false);
  };

  const deleteSession = async (sessionIdToDelete) => {
    if (!user) return;
    try {
      await axios.delete(`http://localhost:3001/api/chat/session/${user._id}/${sessionIdToDelete}`);
      fetchSessions();
      if (sessionIdToDelete === sessionId) {
        startNewSession();
      }
    } catch (err) {
      console.error("Failed to delete session:", err);
    }
  };

  const handleTextareaChange = (e) => {
    setPrompt(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  };

  const handleTextSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!prompt.trim() || loading) return;

    const userMessage = { type: "user", text: prompt, timestamp: new Date() };
    setConversation((prev) => [...prev, userMessage]);
    await saveChatMessage(userMessage);

    setError("");
    setResponse("");
    setLoading(true);
    const currentPrompt = prompt;
    setPrompt("");

    try {
      const res = await fetch("http://localhost:3001/api/healthmate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: currentPrompt }),
      });

      const data = await res.json();
      const aiResponse = data.text || "No response.";
      setResponse(aiResponse);
      
      const assistantMessage = { type: "assistant", text: aiResponse, timestamp: new Date() };
      setConversation((prev) => [...prev, assistantMessage]);
      await saveChatMessage(assistantMessage);
      await fetchSessions();
    } catch (err) {
      const errorMsg = "Something went wrong. Check your backend or network.";
      setError(errorMsg);
      const errorMessage = { type: "error", text: errorMsg, timestamp: new Date() };
      setConversation((prev) => [...prev, errorMessage]);
      await saveChatMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async () => {
    if (!file) {
      setError("Please select a file first!");
      return;
    }

    setSummary("");
    setLoading(true);
    setError("");

    const fileMessage = {
      type: "user",
      text: `📄 Uploaded file: ${file.name}`,
      isFile: true,
      fileName: file.name,
      timestamp: new Date(),
    };
    setConversation((prev) => [...prev, fileMessage]);
    await saveChatMessage(fileMessage);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("http://localhost:3001/api/summarize", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      const summaryText = data.summary || data.error;
      setSummary(summaryText);
      
      const summaryMessage = {
        type: "assistant",
        text: summaryText,
        isSummary: true,
        timestamp: new Date(),
      };
      setConversation((prev) => [...prev, summaryMessage]);
      await saveChatMessage(summaryMessage);
      await fetchSessions();
    } catch (err) {
      const errorMsg = "File summarization failed.";
      setError(errorMsg);
      const errorMessage = { type: "error", text: errorMsg, timestamp: new Date() };
      setConversation((prev) => [...prev, errorMessage]);
      await saveChatMessage(errorMessage);
    } finally {
      setLoading(false);
      setFile(null);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-gray-50 to-white font-sans">
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={Logo} alt="HealthMate Logo" className="w-10 h-10 object-contain rounded-xl shadow-md" />
            <div>
              <h1 className="text-lg font-semibold text-gray-900">HealthMate Assistant</h1>
              <p className="text-xs text-gray-500">Powered by Google AI</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Chat History"
              disabled={loading}
            >
              <History className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={startNewSession}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="New Chat"
              disabled={loading}
            >
              <PlusCircle className="w-5 h-5 text-green-600" />
            </button>
            {loadingUser ? (
              <Loader2 className="w-10 h-10 text-green-600 spin" />
            ) : user ? (
              <img
                src={user.profileImage}
                alt={`${user.name}'s Profile`}
                className="w-10 h-10 object-cover rounded-xl shadow-md"
              />
            ) : null}
          </div>
        </div>
      </div>

      {showHistory && (
        <div className="absolute top-16 right-4 w-80 bg-white border border-gray-200 rounded-xl shadow-lg z-20 max-h-96 overflow-y-auto">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Chat History</h3>
          </div>
          <div className="p-2">
            {sessions.length === 0 ? (
              <p className="text-center text-gray-500 py-4 text-sm">No chat history</p>
            ) : (
              sessions.map((session) => (
                <div
                  key={session.sessionId}
                  className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer border-b border-gray-100 flex justify-between items-center"
                >
                  <div
                    onClick={() => loadSession(session.sessionId)}
                    className="flex-1"
                  >
                    <p className="text-sm text-gray-900 truncate">{session.preview}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(session.lastActive).toLocaleDateString()} • {session.messageCount} messages
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteSession(session.sessionId);
                    }}
                    className="p-1 hover:bg-red-50 rounded"
                    disabled={loading}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-8">
          {conversation.length === 0 && !loading && (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
              <img src={Logo} alt="HealthMate Logo" className="w-20 h-20 object-contain rounded-3xl shadow-lg mb-6" />
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Welcome to HealthMate</h2>
              <p className="text-gray-600 max-w-md mb-8 leading-relaxed">
                Ask me anything or upload a document to get started. I'm here to help with your questions and summarize your files.
              </p>
              <div className="grid grid-cols-2 gap-4 w-full max-w-2xl">
                <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100 text-left">
                  <Send className="w-6 h-6 text-green-600 mb-2" />
                  <h3 className="font-semibold text-gray-900 text-sm">Ask Questions</h3>
                  <p className="text-xs text-gray-600">Get intelligent answers powered by HealthMate AI</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100 text-left">
                  <FileText className="w-6 h-6 text-green-600 mb-2" />
                  <h3 className="font-semibold text-gray-900 text-sm">Upload Files</h3>
                  <p className="text-xs text-gray-600">Summarize PDFs, TXT, and DOCX files</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-6">
            {conversation.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl p-4 ${
                    msg.type === "user"
                      ? "bg-gradient-to-br from-green-500 to-green-600 text-white shadow-md"
                      : msg.type === "error"
                      ? "bg-red-50 text-red-800 border border-red-200"
                      : "bg-white text-gray-900 border border-gray-200 shadow-sm"
                  }`}
                >
                  {msg.isFile && <FileText className="w-4 h-4 mr-2 inline-block align-middle" />}
                  {msg.isSummary && <FileText className="w-4 h-4 mr-2 text-green-600 inline-block align-middle" />}
                  <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">{msg.text}</pre>
                  {msg.timestamp && (
                    <p className="text-xs mt-2 opacity-70">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </p>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm flex items-center gap-3">
                  <Loader2 className="w-5 h-5 text-green-600 spin" />
                  <span className="text-sm text-gray-600">Thinking...</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 bg-white border-t border-gray-200 shadow-[0_-4px_6px_rgba(0,0,0,0.05)]">
        <div className="max-w-4xl mx-auto p-4">
          {error && (
            <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div className="mb-3 flex items-center gap-3">
            <label className="flex items-center gap-2 p-2.5 bg-gray-100 rounded-lg border border-gray-300 cursor-pointer hover:bg-gray-200 transition-colors">
              <Upload className="w-5 h-5 text-gray-600" />
              <span className="text-sm text-gray-600 max-w-[200px] truncate">
                {file ? file.name : "Upload PDF, TXT, or DOCX"}
              </span>
              <input
                type="file"
                accept=".pdf,.txt,.docx"
                onChange={(e) => setFile(e.target.files[0])}
                className="hidden"
                disabled={loading}
              />
            </label>
            {file && (
              <button
                onClick={handleFileUpload}
                disabled={loading}
                className={`px-4 py-2.5 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg font-medium text-sm transition-opacity flex items-center justify-center ${
                  loading ? "opacity-50 cursor-not-allowed" : "opacity-100"
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 text-white spin mr-2" />
                    Summarizing...
                  </>
                ) : (
                  "Summarize"
                )}
              </button>
            )}
          </div>

          <div className="bg-white rounded-xl border border-gray-300 shadow-sm">
            <div className="flex items-center p-2">
              <textarea
                ref={textareaRef}
                value={prompt}
                onChange={handleTextareaChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleTextSubmit(e);
                  }
                }}
                placeholder="Ask me anything..."
                rows={1}
                disabled={loading}
                className={`flex-1 border-none outline-none resize-none text-sm text-gray-900 bg-transparent p-2 font-sans leading-relaxed min-h-[40px] max-h-[200px] ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              />
              <button
                onClick={handleTextSubmit}
                disabled={loading || !prompt.trim()}
                className={`flex items-center justify-center w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg transition-opacity ${
                  loading || !prompt.trim() ? "opacity-40 cursor-not-allowed" : "opacity-100"
                }`}
              >
                {loading ? <Loader2 className="w-5 h-5 text-white spin" /> : <Send className="w-5 h-5 text-white" />}
              </button>
            </div>
          </div>

          <p className="text-xs text-gray-500 text-center mt-3">
            HealthMate may produce inaccurate information. Please verify important details.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Healthmate;