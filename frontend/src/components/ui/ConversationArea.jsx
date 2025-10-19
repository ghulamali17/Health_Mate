import React from "react";
import { Loader2, Send, FileText } from "lucide-react";
import Logo from "../../assets/logo2.png";
import MessageBubble from "./MessageBubble";

const ConversationArea = ({ conversation, loading, scrollRef }) => {
  return (
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
            <MessageBubble key={idx} message={msg} />
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
  );
};

export default ConversationArea;