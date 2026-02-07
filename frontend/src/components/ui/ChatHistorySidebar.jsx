import React from "react";
import {
  X,
  Trash2,
  PlusCircle,
  MessageSquare,
  Clock,
  Shield,
  Plus,
} from "lucide-react";
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
  const {
    sessions,
    sessionId,
    isLoading: sessionLoading,
  } = useSelector((state) => state.session);

  return (
    <div
      className={`fixed inset-y-0 left-0 w-80 bg-white border-r border-slate-200 z-50 transform transition-all duration-300 ease-in-out ${
        isSidebarOpen ? "translate-x-0 outline-none" : "-translate-x-full"
      } md:translate-x-0 md:static md:flex md:flex-col shadow-sm`}
    >
      {/* Sidebar Header */}
      <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-white">
        <div className="flex items-center gap-2">
          <div className="w-1 h-5 bg-primary rounded-full"></div>
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest">
            History
          </h3>
        </div>
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="p-2 hover:bg-slate-50 rounded-lg transition-all md:hidden text-slate-400"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-5 flex-1 overflow-y-auto custom-scrollbar bg-white">
        {/* New Chat Button */}
        <button
          onClick={startNewSession}
          className="w-full flex items-center justify-center gap-2.5 p-4 bg-slate-900 text-white rounded-xl font-bold text-sm transition-all mb-8 shadow-md hover:bg-slate-800 active:scale-95 disabled:opacity-50 cursor-pointer"
          disabled={sessionLoading || loading}
        >
          <Plus className="w-4 h-4 text-primary" />
          New Chat
        </button>

        {/* Sessions List */}
        <div className="space-y-6">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">
            Recent
          </p>

          {sessionLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, index) => (
                <div
                  key={index}
                  className="h-16 rounded-xl bg-slate-50 animate-pulse border border-slate-100"
                ></div>
              ))}
            </div>
          ) : sessions.length === 0 ? (
            <div className="text-center py-10 opacity-30">
              <MessageSquare className="w-8 h-8 mx-auto mb-2" />
              <p className="text-[10px] font-bold uppercase tracking-widest">
                No history
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {sessions.map((session) => {
                const isActive = session.sessionId === sessionId;
                return (
                  <div
                    key={session.sessionId}
                    onClick={() => loadSession(session.sessionId)}
                    className={`group p-4 rounded-xl cursor-pointer flex justify-between items-center transition-all ${
                      isActive
                        ? "bg-primary/5 border border-primary/20 text-primary"
                        : "bg-transparent border border-transparent hover:bg-slate-50 text-slate-600"
                    }`}
                  >
                    <div className="flex-1 min-w-0 pr-2">
                      <p
                        className={`text-sm font-bold truncate ${isActive ? "text-primary" : "text-slate-700"}`}
                      >
                        {session.title || session.preview || "Untitled Chat"}
                      </p>
                      <span className="text-[9px] font-bold opacity-50 uppercase tracking-widest">
                        {new Date(
                          session.createdAt || session.lastActive,
                        ).toLocaleDateString()}
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteSession(session.sessionId);
                      }}
                      className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-rose-50 hover:text-rose-500 transition-all text-slate-300"
                      disabled={sessionLoading || loading}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* User Status */}
      {user && (
        <div className="p-6 border-t border-slate-50 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center font-bold text-white shadow-sm ring-4 ring-slate-50">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-900 truncate">
                {user.name}
              </p>
              <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">
                Protected Session
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatHistorySidebar;
