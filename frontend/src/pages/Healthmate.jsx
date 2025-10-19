import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/authContext";
import Header from "../components/ui/Header";
import ChatHistorySidebar from "../components/ui/ChatHistorySidebar";
import ConversationArea from "../components/ui/ConversationArea";
import InputArea from "../components/ui/InputArea";
import "./Styles.css";

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
  const [sessions, setSessions] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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

        const response = await axios.get("https://health-mate-dcv3.vercel.app/api/users/current", {
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
      const response = await axios.get(`https://health-mate-dcv3.vercel.app/api/chat/sessions/${user._id}`);
      setSessions(response.data.sessions || []);
    } catch (err) {
      console.error("Failed to fetch sessions:", err);
    }
  };

  const loadChatHistory = async () => {
    if (!user || !sessionId) return;
    try {
      const response = await axios.get(
        `https://health-mate-dcv3.vercel.app/api/chat/history/${user._id}/${sessionId}`
      );
      setConversation(response.data.messages || []);
    } catch (err) {
      console.error("Failed to load chat history:", err);
    }
  };

  const saveChatMessage = async (message) => {
    if (!user || !sessionId) return;
    try {
      await axios.post("https://health-mate-dcv3.vercel.app/api/chat/save", {
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
    setIsSidebarOpen(false);
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
    setIsSidebarOpen(false);
  };

  const deleteSession = async (sessionIdToDelete) => {
    if (!user) return;
    try {
      await axios.delete(`https://health-mate-dcv3.vercel.app/api/chat/session/${user._id}/${sessionIdToDelete}`);
      fetchSessions();
      if (sessionIdToDelete === sessionId) {
        startNewSession();
      }
    } catch (err) {
      console.error("Failed to delete session:", err);
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
      const res = await fetch("https://health-mate-dcv3.vercel.app/api/healthmate", {
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

      const res = await fetch("https://health-mate-dcv3.vercel.app/api/summarize", {
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

  const handleTextareaChange = (e) => {
    setPrompt(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-b from-gray-50 to-white font-sans">
      <ChatHistorySidebar
        user={user}
        sessions={sessions}
        sessionId={sessionId}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        loadSession={loadSession}
        deleteSession={deleteSession}
        startNewSession={startNewSession}
        loading={loading}
      />
      <div className="flex-1 flex flex-col">
        <Header
          user={user}
          loadingUser={loadingUser}
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        <ConversationArea
          conversation={conversation}
          loading={loading}
          scrollRef={scrollRef}
        />
        <InputArea
          prompt={prompt}
          file={file}
          error={error}
          loading={loading}
          textareaRef={textareaRef}
          setPrompt={setPrompt}
          setFile={setFile}
          handleTextareaChange={handleTextareaChange}
          handleTextSubmit={handleTextSubmit}
          handleFileUpload={handleFileUpload}
        />
      </div>
    </div>
  );
};

export default Healthmate;