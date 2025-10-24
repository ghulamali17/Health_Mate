import React, { useState, useEffect } from "react";
import { Upload, FileText, Loader2, CheckCircle, AlertCircle, ArrowLeft,User } from "lucide-react";
import axios from "axios";
const UploadReportPage = () => {
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [user, setUser] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [loadingUser, setLoadingUser] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };
    // Fetch current user
    useEffect(() => {
      const fetchCurrentUser = async () => {
        try {
          setLoadingUser(true);
          const token = localStorage.getItem("pos-token");
          if (!token) return;
  
          const response = await axios.get("http://localhost:3001/api/users/current", {
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

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setError("");
      setSuccess(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError("");
      setSuccess(false);
    }
  };

  const handleFileUpload = async () => {
    if (!file) {
      setError("Please select a file first!");
      return;
    }

    setSummary("");
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("http://localhost:3001/api/summarize", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      const summaryText = data.summary || data.error;
      setSummary(summaryText);
      setSuccess(true);
    } catch (err) {
      setError("File summarization failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setSummary("");
    setError("");
    setSuccess(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => window.history.back()}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">💚 HealthMate</h1>
                <p className="text-sm text-gray-500">Upload & Analyze Medical Reports</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
             <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
  <User className="w-4 h-4 text-gray-600" />
  <span className="text-sm font-medium text-gray-700">
    {loadingUser ? "Loading..." : user?.name || "Guest"}
  </span>
</div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white font-semibold">
              {user?.name ? user.name.charAt(0).toUpperCase() : "G"}

              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Upload Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Upload Medical Report</h2>
            
            {/* Drag and Drop Zone */}
            <div
              className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${
                dragActive
                  ? "border-green-500 bg-green-50"
                  : "border-gray-300 hover:border-green-400 bg-gray-50"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className={`w-16 h-16 mx-auto mb-4 ${dragActive ? "text-green-500" : "text-gray-400"}`} />
              <p className="text-lg font-medium text-gray-700 mb-2">
                {file ? file.name : "Drag & drop your report here"}
              </p>
              <p className="text-sm text-gray-500 mb-4">or</p>
              <label className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors cursor-pointer">
                <FileText className="w-5 h-5" />
                Browse Files
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                />
              </label>
              <p className="text-xs text-gray-400 mt-4">Supported: PDF, JPG, PNG (Max 10MB)</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Success Message */}
            {success && !loading && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <p className="text-sm text-green-700">Report analyzed successfully!</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-6 flex gap-3">
              <button
                onClick={handleFileUpload}
                disabled={!file || loading}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    Analyze Report
                  </>
                )}
              </button>
              {file && (
                <button
                  onClick={resetForm}
                  disabled={loading}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors font-medium"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Summary Section */}
        {summary && (
          <div className="mt-6 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6">
              <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                <FileText className="w-6 h-6" />
                AI Analysis Report
              </h3>
              <p className="text-green-50 text-sm mt-1">
                Generated for: {file?.name}
              </p>
            </div>
            <div className="p-8">
              <div className="prose max-w-none">
                <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {summary}
                </div>
              </div>
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  ⚠️ <strong>Disclaimer:</strong> This AI analysis is for informational purposes only. 
                  Always consult your doctor before making any medical decisions.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Quick Tips */}
        <div className="mt-8 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
          <h4 className="font-semibold text-gray-900 mb-3">💡 Quick Tips</h4>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• Upload clear, high-quality scans for best results</li>
            <li>• Supported formats: PDF, JPG, PNG</li>
            <li>• AI can read lab reports, prescriptions, and X-ray results</li>
            <li>• Your reports are analyzed securely and privately</li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default UploadReportPage;