import React from "react";
import { Loader2, Activity } from "lucide-react";
import MessageBubble from "./MessageBubble";

const ConversationArea = ({ conversation, loading, scrollRef }) => {
  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto custom-scrollbar bg-[#F8FAFC]"
    >
      <div className="max-w-4xl mx-auto p-6 md:p-10">
        {conversation.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-fadeIn">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
              <Activity className="w-8 h-8 text-primary" />
            </div>

            <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-3">
              Personal Health Assistant
            </h2>

            <p className="text-slate-500 font-medium max-w-sm leading-relaxed">
              I'm here to help you understand your health data. Ask me anything
              about your vitals, reports, or general wellness.
            </p>
          </div>
        )}

        <div className="flex flex-col gap-8 md:gap-10">
          {conversation.map((msg, idx) => (
            <MessageBubble
              key={idx}
              message={msg}
              isLast={idx === conversation.length - 1}
            />
          ))}

          {loading && (
            <div className="flex justify-start animate-slideUp">
              <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center gap-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                </div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Thinking...
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConversationArea;
