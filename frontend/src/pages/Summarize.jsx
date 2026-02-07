import React, { useState, useEffect } from "react";
import {
  Upload,
  FileText,
  Loader2,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Sparkles,
  Shield,
  Activity,
  User,
  X,
  Printer,
  ChevronRight,
} from "lucide-react";
import api from "../config/api";
import Navbar from "../components/ui/Navbar";
import { useNavigate } from "react-router-dom";

const UploadReportPage = () => {
  const navigate = useNavigate();
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

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        setLoadingUser(true);
        const response = await api.get("/api/users/current");
        setUser(response.data);
      } catch (err) {
        console.error("Failed to fetch user:", err);
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

      const response = await api.post("/api/summarize", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const data = response.data;

      if (data.isGuestMode) {
        setError(
          "Report analyzed but not saved. Please login to save records.",
        );
      } else if (data.reportId) {
        setSuccess(true);
      }

      const summaryText = data.summary || data.error;
      setSummary(summaryText);
    } catch (err) {
      console.error("Upload error:", err);
      if (err.response?.status === 401) {
        setError("Session expired. Please login again.");
        navigate("/login");
      } else {
        setError("Failed to analyze report. Please try again.");
      }
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
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 py-16 mt-12">
        <div className="space-y-10">
          {/* Page Intro */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-4">
              Report Summary
            </h1>
            <p className="text-slate-500 font-medium max-w-xl mx-auto leading-relaxed">
              Upload your medical records for a clear, AI-powered breakdown of
              your health data in seconds.
            </p>
          </div>

          {/* Upload Card  */}
          <div className="bg-white border border-slate-100 rounded-[2.5rem] p-1 shadow-sm overflow-hidden">
            <div
              className={`relative rounded-[2.3rem] p-12 md:p-20 text-center transition-all duration-500 ${
                dragActive
                  ? "bg-primary/[0.02] border-primary/20"
                  : "bg-transparent border-transparent"
              } border-2 border-dashed`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center max-w-md mx-auto">
                <div
                  className={`w-20 h-20 rounded-[1.5rem] flex items-center justify-center mb-8 transition-all duration-500 ${
                    file
                      ? "bg-primary text-white scale-105 shadow-xl shadow-primary/20"
                      : "bg-slate-50 text-slate-400"
                  }`}
                >
                  {file ? (
                    <FileText className="w-8 h-8" />
                  ) : (
                    <Upload className="w-8 h-8" />
                  )}
                </div>

                <h3 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">
                  {file ? file.name : "Select a Report"}
                </h3>
                <p className="text-slate-500 font-medium mb-12 text-sm leading-relaxed">
                  Drop your PDF or image here, or use the button below to browse
                  your files.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 w-full">
                  {!file ? (
                    <label className="flex-1 inline-flex items-center justify-center gap-3 px-8 py-4.5 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all cursor-pointer active:scale-95 shadow-lg shadow-slate-900/10">
                      <FileText className="w-4 h-4 text-primary" />
                      Choose File
                      <input
                        type="file"
                        onChange={handleFileChange}
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="hidden"
                      />
                    </label>
                  ) : (
                    <>
                      <button
                        onClick={handleFileUpload}
                        disabled={loading}
                        className="flex-[2] flex items-center justify-center gap-3 px-8 py-4.5 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 disabled:bg-slate-100 disabled:text-slate-300 transition-all active:scale-[0.98]"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-5 h-5" />
                            Summarize Now
                          </>
                        )}
                      </button>
                      <button
                        onClick={resetForm}
                        disabled={loading}
                        className="flex-1 px-8 py-4.5 bg-slate-50 text-slate-500 rounded-2xl font-bold hover:bg-slate-100 transition-all active:scale-95 text-xs uppercase tracking-widest"
                      >
                        Remove
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Error/Success Notifications */}
            {(error || (success && !loading)) && (
              <div className="p-8 pt-0 animate-fadeIn">
                {error && (
                  <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3">
                    <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
                    <p className="text-[11px] font-bold text-rose-800 uppercase tracking-wide">
                      {error}
                    </p>
                  </div>
                )}
                {success && !loading && (
                  <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <p className="text-[11px] font-bold text-emerald-800 uppercase tracking-wide">
                      Analysis Complete
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Results Area */}
          {summary && (
            <div className="animate-slideUp pt-6">
              <div className="bg-white rounded-[3rem] border border-slate-100 overflow-hidden shadow-sm">
                <div className="bg-slate-900 px-10 py-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-primary/20 backdrop-blur-xl border border-white/10 rounded-[1.5rem] flex items-center justify-center text-primary shadow-inner">
                      <Sparkles className="w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-bold text-white tracking-tight">
                        AI Summary
                      </h4>
                      <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
                        <Activity className="w-3 h-3" />
                        Health Analysis Engine
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => window.print()}
                    className="px-6 py-3 bg-white/10 border border-white/10 hover:bg-white/20 rounded-xl text-white text-[10px] font-bold uppercase tracking-[0.2em] transition-all flex items-center gap-2 group active:scale-95"
                  >
                    <Printer className="w-4 h-4 opacity-50 group-hover:opacity-100" />
                    Save Report
                  </button>
                </div>

                <div className="p-12 md:p-20 relative">
                  <div className="max-w-none">
                    <div
                      className="text-slate-700 leading-relaxed font-medium text-lg space-y-6"
                      dangerouslySetInnerHTML={{ __html: summary }}
                    />
                  </div>

                  <div className="mt-20 pt-10 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                        Private Recording
                      </span>
                    </div>
                    <div className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                      Report ID:{" "}
                      {Math.random().toString(36).substr(2, 9).toUpperCase()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Security & Feature Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                label: "Security",
                value: "AES-256 Bit",
                icon: Shield,
                color: "text-emerald-500",
              },
              {
                label: "AI Engine",
                value: "Smart Scan",
                icon: Sparkles,
                color: "text-primary",
              },
              {
                label: "Privacy",
                value: "Private Data",
                icon: Activity,
                color: "text-sky-500",
              },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-white rounded-3xl p-6 border border-slate-100 flex items-center gap-5 hover:border-primary/10 transition-all"
              >
                <div className={`p-3 bg-slate-50 rounded-2xl ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
                    {stat.label}
                  </p>
                  <p className="text-sm font-bold text-slate-900">
                    {stat.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default UploadReportPage;
