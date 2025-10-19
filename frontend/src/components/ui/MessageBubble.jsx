import React from "react";
import { FileText } from "lucide-react";

const MessageBubble = ({ message }) => {
  return (
    <div className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] rounded-2xl p-4 ${
          message.type === "user"
            ? "bg-gradient-to-br from-green-500 to-green-600 text-white shadow-md"
            : message.type === "error"
            ? "bg-red-50 text-red-800 border border-red-200"
            : "bg-white text-gray-900 border border-gray-200 shadow-sm"
        }`}
      >
        {message.isFile && <FileText className="w-4 h-4 mr-2 inline-block align-middle" />}
        {message.isSummary && <FileText className="w-4 h-4 mr-2 text-green-600 inline-block align-middle" />}
        <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">{message.text}</pre>
        {message.timestamp && (
          <p className="text-xs mt-2 opacity-70">
            {new Date(message.timestamp).toLocaleTimeString()}
          </p>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;