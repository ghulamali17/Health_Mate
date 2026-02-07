import React from "react";
import { Send, Loader2, AlertCircle, Shield } from "lucide-react";

const InputArea = ({
  prompt,
  error,
  loading,
  textareaRef,
  handleTextareaChange,
  handleTextSubmit,
}) => {
  return (
    <div className="w-full">
      {/* Error Alert */}
      {error && (
        <div className="mb-4 p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-3 animate-shake">
          <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
          <p className="text-xs font-bold text-rose-700 uppercase tracking-widest">
            {error}
          </p>
        </div>
      )}

      {/* Input Field Area */}
      <div className="relative bg-white border border-slate-200 rounded-2xl shadow-sm focus-within:border-primary/40 focus-within:shadow-md transition-all duration-300">
        <div className="flex items-end p-2 gap-2">
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
            placeholder="Ask me a health question..."
            rows={1}
            disabled={loading}
            className={`flex-1 border-none outline-none resize-none text-[15px] text-slate-800 bg-transparent py-3 px-4 font-medium leading-relaxed max-h-[150px] placeholder:text-slate-400 ${
              loading ? "opacity-30" : ""
            }`}
          />

          <button
            onClick={handleTextSubmit}
            disabled={loading || !prompt.trim()}
            className={`flex items-center justify-center w-11 h-11 rounded-xl transition-all ${
              loading || !prompt.trim()
                ? "bg-slate-50 text-slate-300"
                : "bg-primary text-white hover:bg-primary/90 shadow-sm active:scale-95 cursor-pointer"
            }`}
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Subtle Footer */}
      <div className="flex flex-col sm:flex-row justify-between items-center px-2 mt-4 gap-2">
        <div className="flex items-center gap-2">
          <Shield className="w-3.5 h-3.5 text-emerald-500" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            End-to-End Secure
          </span>
        </div>
        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest text-center">
          AI assistant for guidance. Not a substitute for medical advice.
        </p>
      </div>
    </div>
  );
};

export default InputArea;
