import React from "react";
import { Send, Loader2, Upload, AlertCircle } from "lucide-react";

const InputArea = ({
  prompt,
  file,
  error,
  loading,
  textareaRef,
  setPrompt,
  setFile,
  handleTextareaChange,
  handleTextSubmit,
  handleFileUpload,
}) => {
  return (
    <div className="sticky bottom-0 bg-white border-t border-gray-200 shadow-[0_-4px_6px_rgba(0,0,0,0.05)]">
      <div className="max-w-4xl mx-auto p-4">
        {error && (
          <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}
        <div className="mb-3 flex items-center gap-3">
          <label className="flex items-center gap-2 p-2.5 bg-gray-100 rounded-lg border border-gray-300 cursor-pointer hover:bg-gray-200 transition-colors">
            <Upload className="w-5 h-5 text-gray-600" />
            <span className="text-sm text-gray-600 max-w-[200px] truncate">
              {file ? file.name : "Upload PDF, TXT, or DOCX"}
            </span>
            <input
              type="file"
              accept=".pdf,.txt,.docx"
              onChange={(e) => setFile(e.target.files[0])}
              className="hidden"
              disabled={loading}
            />
          </label>
          {file && (
            <button
              onClick={handleFileUpload}
              disabled={loading}
              className={`px-4 py-2.5 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg font-medium text-sm transition-opacity flex items-center justify-center ${
                loading ? "opacity-50 cursor-not-allowed" : "opacity-100"
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 text-white spin mr-2" />
                  Summarizing...
                </>
              ) : (
                "Summarize"
              )}
            </button>
          )}
        </div>
        <div className="bg-white rounded-xl border border-gray-300 shadow-sm">
          <div className="flex items-center p-2">
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
              placeholder="Ask me anything..."
              rows={1}
              disabled={loading}
              className={`flex-1 border-none outline-none resize-none text-sm text-gray-900 bg-transparent p-2 font-sans leading-relaxed min-h-[40px] max-h-[200px] ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            />
            <button
              onClick={handleTextSubmit}
              disabled={loading || !prompt.trim()}
              className={`flex items-center justify-center w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg transition-opacity ${
                loading || !prompt.trim() ? "opacity-40 cursor-not-allowed" : "opacity-100"
              }`}
            >
              {loading ? <Loader2 className="w-5 h-5 text-white spin" /> : <Send className="w-5 h-5 text-white" />}
            </button>
          </div>
        </div>
        <p className="text-xs text-gray-500 text-center mt-3">
          HealthMate may produce inaccurate information. Please verify important details.
        </p>
      </div>
    </div>
  );
};

export default InputArea;