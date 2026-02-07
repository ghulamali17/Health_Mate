import React from "react";
import { FileText, User, Sparkles, AlertCircle, Clock } from "lucide-react";

const MessageBubble = ({ message, isLast }) => {
  const isUser = message.type === "user";
  const isError = message.type === "error";

  return (
    <div
      className={`flex flex-col ${isUser ? "items-end" : "items-start"} animate-slideUp group`}
    >
      {/* Sender Label */}
      <div className={`flex items-center gap-2 mb-1.5 px-1`}>
        {isUser ? (
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            You
          </span>
        ) : (
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-primary" />
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">
              Health AI
            </span>
          </div>
        )}
      </div>

      {/* Bubble Design */}
      <div
        className={`max-w-[85%] md:max-w-[80%] rounded-2xl p-4 md:p-5 shadow-sm transition-all duration-300 ${
          isUser
            ? "bg-slate-900 text-white rounded-tr-none"
            : isError
              ? "bg-rose-50 text-rose-800 border border-rose-100 rounded-tl-none"
              : "bg-white text-slate-800 border border-slate-200 rounded-tl-none"
        }`}
      >
        <div className="flex flex-col gap-3">
          {(message.isFile || message.isSummary) && (
            <div
              className={`flex items-center gap-2 p-2 rounded-lg border ${isUser ? "bg-white/10 border-white/10" : "bg-slate-50 border-slate-100"}`}
            >
              <FileText
                className={`w-4 h-4 ${isUser ? "text-white" : "text-primary"}`}
              />
              <span
                className={`text-[10px] font-bold uppercase tracking-widest ${isUser ? "text-white/80" : "text-slate-500"}`}
              >
                Attached Document
              </span>
            </div>
          )}

          {isError && (
            <div className="flex items-center gap-2 text-rose-500 mb-0.5">
              <AlertCircle className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-widest">
                System Error
              </span>
            </div>
          )}

          <div
            className={`text-sm md:text-[15px] leading-relaxed font-medium ${isUser ? "text-slate-100" : "text-slate-700"}`}
          >
            <div className="whitespace-pre-wrap">{message.text}</div>
          </div>
        </div>
      </div>

      {/* Timestamp */}
      {message.timestamp && (
        <div
          className={`mt-2 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isUser ? "mr-1" : "ml-1"}`}
        >
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      )}
    </div>
  );
};

export default MessageBubble;
