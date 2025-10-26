import React, { useState, useRef, useEffect, useCallback } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../context/authContext";
import Header from "../components/ui/Header";
import ChatHistorySidebar from "../components/ui/ChatHistorySidebar";
import ConversationArea from "../components/ui/ConversationArea";
import InputArea from "../components/ui/InputArea";
import {
  setSessionId,
  setSessions,
  setCurrentSession,
  addSession,
  removeSession,
  setLoading as setSessionLoading,
} from "../store/slices/sessionSlice";
import "./Styles.css";

const Healthmate = () => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [conversation, setConversation] = useState([]);
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const scrollRef = useRef(null);
  const textareaRef = useRef(null);

  const { user: authUser } = useAuth();
  
  // Redux hooks
  const dispatch = useDispatch();
  const { sessionId, sessions, isLoading: sessionLoading } = useSelector((state) => state.session);

  // Generate session ID on component mount
  useEffect(() => {
    if (!sessionId) {
      const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      dispatch(setSessionId(newSessionId));
    }
  }, [dispatch, sessionId]);

  // Fetch current user
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        setLoadingUser(true);
        const token = localStorage.getItem("pos-token");
        if (!token) return;

        const response = await axios.get("https://health-mate-3x6x.vercel.app/api/users/current", {
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

  const fetchSessions = useCallback(async () => {
    if (!user) return;
    try {
      dispatch(setSessionLoading(true));
      const response = await axios.get(`https://health-mate-3x6x.vercel.app/api/chat/sessions/${user._id}`);
      dispatch(setSessions(response.data.sessions || []));
    } catch (err) {
      console.error("Failed to fetch sessions:", err);
    } finally {
      dispatch(setSessionLoading(false));
    }
  }, [user, dispatch]);

  const loadChatHistory = useCallback(async () => {
    if (!user || !sessionId) return;
    try {
      const response = await axios.get(
        `https://health-mate-3x6x.vercel.app/api/chat/history/${user._id}/${sessionId}`
      );
      setConversation(response.data.messages || []);
      
      // Get fresh sessions state
      const currentSessionsResponse = await axios.get(`https://health-mate-3x6x.vercel.app/api/chat/sessions/${user._id}`);
      const currentSession = currentSessionsResponse.data.sessions?.find(
        session => session.sessionId === sessionId
      );
      if (currentSession) {
        dispatch(setCurrentSession(currentSession));
      }
    } catch (err) {
      console.error("Failed to load chat history:", err);
    }
  }, [user, sessionId, dispatch]);

  // Load chat history when user or session changes
  useEffect(() => {
    loadChatHistory();
  }, [loadChatHistory]);

  // Fetch all sessions when user changes
  useEffect(() => {
    if (user) {
      fetchSessions();
    }
  }, [user, fetchSessions]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [conversation, loading]);

  const saveChatMessage = async (message) => {
    if (!user || !sessionId) return;
    try {
      await axios.post("https://health-mate-3x6x.vercel.app/api/chat/save", {
        userId: user._id,
        sessionId,
        message,
      });
    } catch (err) {
      console.error("Failed to save message:", err);
    }
  };

  const loadSession = async (selectedSessionId) => {
    dispatch(setSessionId(selectedSessionId));
    setIsSidebarOpen(false);
    try {
      const response = await axios.get(
        `https://health-mate-3x6x.vercel.app/api/chat/history/${user._id}/${selectedSessionId}`
      );
      setConversation(response.data.messages || []);
      
      const currentSession = sessions.find(session => session.sessionId === selectedSessionId);
      if (currentSession) {
        dispatch(setCurrentSession(currentSession));
      }
    } catch (err) {
      console.error("Failed to load session:", err);
    }
  };

  const startNewSession = () => {
    const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    dispatch(setSessionId(newSessionId));
    dispatch(setCurrentSession(null));
    setConversation([]);
    setIsSidebarOpen(false);
    
    // Add new session to Redux store
    const newSession = {
      sessionId: newSessionId,
      createdAt: new Date().toISOString(),
      messageCount: 0,
      title: "New Chat"
    };
    dispatch(addSession(newSession));
  };

  const deleteSession = async (sessionIdToDelete) => {
    if (!user) return;
    try {
      await axios.delete(`https://health-mate-3x6x.vercel.app/api/chat/session/${user._id}/${sessionIdToDelete}`);
      dispatch(removeSession(sessionIdToDelete));
      
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

  const userMessage = { 
    type: "user", 
    text: prompt, 
    timestamp: new Date().toISOString() 
  };
  
  const updatedConversation = [...conversation, userMessage];
  setConversation(updatedConversation);
  await saveChatMessage(userMessage);

  setError("");
  setResponse("");
  setLoading(true);
  const currentPrompt = prompt;
  setPrompt("");

  try {
    const res = await fetch("https://health-mate-3x6x.vercel.app/api/healthmate", { 
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: currentPrompt }),
    });

    const data = await res.json();
    const aiResponse = data.text || "No response.";
    setResponse(aiResponse);
    
    const assistantMessage = { 
      type: "assistant", 
      text: aiResponse, 
      timestamp: new Date().toISOString() 
    };
    
    const finalConversation = [...updatedConversation, assistantMessage];
    setConversation(finalConversation);
    await saveChatMessage(assistantMessage);
    await fetchSessions();
  } catch (err) {
    const errorMsg = "Something went wrong. Check your network.";
    setError(errorMsg);
    const errorMessage = { 
      type: "error", 
      text: errorMsg, 
      timestamp: new Date().toISOString() 
    };
    
    const errorConversation = [...updatedConversation, errorMessage];
    setConversation(errorConversation);
    await saveChatMessage(errorMessage);
  } finally {
    setLoading(false);
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
          sessionId={sessionId}
        />
        <ConversationArea
          conversation={conversation}
          loading={loading}
          scrollRef={scrollRef}
        />
        <InputArea
          prompt={prompt}
          error={error}
          loading={loading}
          textareaRef={textareaRef}
          handleTextareaChange={handleTextareaChange}
          handleTextSubmit={handleTextSubmit}
        />
      </div>
    </div>
  );
};

export default Healthmate;