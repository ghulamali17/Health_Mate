import React from "react";
import { X, Trash2, PlusCircle } from "lucide-react";
import { useSelector } from "react-redux";

const ChatHistorySidebar = ({
  user,
  isSidebarOpen,
  setIsSidebarOpen,
  loadSession,
  deleteSession,
  startNewSession,
  loading,
}) => {
  // Get session data from Redux store
  const { sessions, sessionId, isLoading: sessionLoading } = useSelector((state) => state.session);

  return (
    <div
      className={`fixed inset-y-0 left-0 w-80 bg-white border-r border-gray-200 shadow-lg z-20 transform transition-transform duration-300 ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0 md:static md:flex md:flex-col`}
    >
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="font-semibold text-gray-900">Chat History</h3>
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors md:hidden"
          title="Close Sidebar"
          aria-label="Close chat history sidebar"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>
      </div>
      <div className="p-4 flex-1 overflow-y-auto">
        <button
          onClick={startNewSession}
          className="w-full flex items-center gap-2 p-3 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg font-medium text-sm transition-opacity mb-4 hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={sessionLoading || loading}
        >
          <PlusCircle className="w-5 h-5" />
          New Chat
        </button>
        
        {sessionLoading ? (
          <div className="space-y-2">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="p-3 rounded-lg bg-gray-100 animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : sessions.length === 0 ? (
          <p className="text-center text-gray-500 py-4 text-sm">No chat history</p>
        ) : (
          <div className="space-y-2">
            {sessions.map((session) => (
              <div
                key={session.sessionId}
                className={`p-3 rounded-lg cursor-pointer flex justify-between items-center transition-colors ${
                  session.sessionId === sessionId 
                    ? "bg-green-50 border border-green-200" 
                    : "hover:bg-gray-50 border border-transparent"
                }`}
              >
                <div
                  onClick={() => loadSession(session.sessionId)}
                  className="flex-1 min-w-0"
                >
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {session.title || session.preview || `Chat ${new Date(session.createdAt || session.lastActive).toLocaleDateString()}`}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(session.createdAt || session.lastActive).toLocaleDateString()} • 
                    {session.messageCount || 0} message{session.messageCount !== 1 ? 's' : ''}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteSession(session.sessionId);
                  }}
                  className="p-1 hover:bg-red-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={sessionLoading || loading}
                  title="Delete session"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Session info footer */}
      {sessionId && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <p className="text-xs text-gray-500 truncate">
            Current Session: <span className="font-mono">{sessionId.substring(0, 12)}...</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default ChatHistorySidebar;