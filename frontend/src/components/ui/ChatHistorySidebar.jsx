import React from "react";
import { X, Trash2, PlusCircle } from "lucide-react";

const ChatHistorySidebar = ({
  user,
  sessions,
  sessionId,
  isSidebarOpen,
  setIsSidebarOpen,
  loadSession,
  deleteSession,
  startNewSession,
  loading,
}) => {
  return (
    <div
      className={`fixed  inset-y-0 left-0 w-80 bg-white border-r border-gray-200 shadow-lg z-20 transform transition-transform duration-300 ${
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
          className="w-full flex items-center gap-2 p-3 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg font-medium text-sm transition-opacity mb-4"
          disabled={loading}
        >
          <PlusCircle className="w-5 h-5" />
          New Chat
        </button>
        {sessions.length === 0 ? (
          <p className="text-center text-gray-500 py-4 text-sm">No chat history</p>
        ) : (
          <div className="space-y-2">
            {sessions.map((session) => (
              <div
                key={session.sessionId}
                className={`p-3 rounded-lg cursor-pointer flex justify-between items-center ${
                  session.sessionId === sessionId ? "bg-green-50" : "hover:bg-gray-50"
                }`}
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
                  title="Delete session"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatHistorySidebar;