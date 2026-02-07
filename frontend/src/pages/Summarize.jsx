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
} from "lucide-react";
import axios from "axios";
import Header from "../components/ui/Header";
import { useNavigate } from "react-router-dom";

const UploadReportPage = () => {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
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
        const token = localStorage.getItem("pos-token");
        if (!token) return;

        const response = await axios.get(`${API_URL}/api/users/current`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchCurrentUser();
  }, [API_URL]);

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

      const token = localStorage.getItem("pos-token");

      if (!token) {
        setError("Please login to save reports");
        setLoading(false);
        return;
      }

      const response = await axios.post(`${API_URL}/api/summarize`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
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
      <Header />

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="space-y-12">
          {/* Page Intro */}
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-3">
              Analyze Report
            </h1>
            <p className="text-slate-500 font-medium max-w-2xl">
              Use AI to understand your medical reports and get clear health
              insights in seconds.
            </p>
          </div>

          {/* Upload Card */}
          <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>

            <div className="relative z-10">
              <div
                className={`relative rounded-[2rem] p-16 text-center transition-all duration-500 border-2 border-dashed ${
                  dragActive
                    ? "border-primary bg-primary/5 scale-[0.99]"
                    : "border-slate-200 bg-slate-50 hover:border-primary/20 hover:bg-white"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="relative z-10 flex flex-col items-center">
                  <div
                    className={`w-24 h-24 rounded-[2rem] flex items-center justify-center mb-8 transition-all duration-500 shadow-sm ${
                      dragActive
                        ? "bg-primary text-white scale-110"
                        : "bg-white text-slate-400"
                    }`}
                  >
                    {file ? (
                      <FileText className="w-10 h-10" />
                    ) : (
                      <Upload className="w-10 h-10" />
                    )}
                  </div>

                  <h3 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">
                    {file ? file.name : "Upload Your Report"}
                  </h3>
                  <p className="text-slate-500 font-medium mb-10 max-w-xs mx-auto">
                    Drop your medical report here or select a file for private
                    AI analysis.
                  </p>

                  <label className="inline-flex items-center gap-3 px-10 py-5 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all cursor-pointer active:scale-95 shadow-lg shadow-slate-900/10">
                    <FileText className="w-5 h-5" />
                    Select File
                    <input
                      type="file"
                      onChange={handleFileChange}
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                    />
                  </label>

                  <div className="mt-8 flex items-center gap-4">
                    {["PDF", "JPG", "PNG"].map((ext) => (
                      <div
                        key={ext}
                        className="px-3 py-1 bg-white border border-slate-100 rounded-lg text-[10px] font-bold text-slate-400 tracking-widest uppercase"
                      >
                        {ext}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Feedback Messages */}
              <div className="space-y-4 mt-8">
                {error && (
                  <div className="p-5 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-4">
                    <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />
                    <p className="text-sm font-bold text-rose-700">{error}</p>
                  </div>
                )}

                {success && !loading && (
                  <div className="p-5 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-4">
                    <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    <p className="text-sm font-bold text-emerald-700">
                      Summary complete. Your report has been analyzed.
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleFileUpload}
                  disabled={!file || loading}
                  className="flex-[2] flex items-center justify-center gap-3 px-8 py-5 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 disabled:bg-slate-100 disabled:text-slate-300 transition-all active:scale-[0.98]"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Analyzing Report...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Get AI Summary
                    </>
                  )}
                </button>
                {file && (
                  <button
                    onClick={resetForm}
                    disabled={loading}
                    className="flex-1 px-8 py-5 bg-slate-50 border border-slate-200 text-slate-500 rounded-2xl font-bold hover:bg-slate-100 transition-all"
                  >
                    Remove File
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Results Area */}
          {summary && (
            <div className="animate-slideUp">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-8 bg-primary rounded-full"></div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-2">
                  Results
                </h3>
              </div>

              <div className="bg-white rounded-[3rem] border border-slate-200 overflow-hidden shadow-sm">
                <div className="bg-slate-900 p-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg">
                      <FileText className="w-7 h-7" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-white tracking-tight">
                        AI Report Summary
                      </h4>
                      <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-1">
                        Generated {new Date().toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-12 md:p-16 relative">
                  <div className="relative z-10 prose prose-slate max-w-none">
                    <div
                      className="text-slate-700 leading-relaxed space-y-8 font-medium"
                      dangerouslySetInnerHTML={{ __html: summary }}
                    />
                  </div>

                  <div className="mt-16 pt-10 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        End of Summary
                      </span>
                    </div>
                    <button
                      onClick={() => window.print()}
                      className="px-6 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 text-[10px] font-bold uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center gap-2"
                    >
                      <Printer className="w-3 h-3" />
                      Print Summary
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Security Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                label: "Secure Data",
                value: "AES-256 Bit",
                icon: Shield,
                color: "text-emerald-500",
              },
              {
                label: "AI Model",
                value: "Smart Scan",
                icon: Sparkles,
                color: "text-primary",
              },
              {
                label: "Privacy",
                value: "Private Analysis",
                icon: Activity,
                color: "text-sky-500",
              },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-white rounded-3xl p-6 border border-slate-200 flex items-center gap-5 shadow-sm"
              >
                <div className={`p-3 bg-slate-50 rounded-2xl ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {stat.label}
                  </p>
                  <p className="text-sm font-bold text-slate-900">
                    {stat.value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Upload Tips */}
          <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
            <div className="relative z-10">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                Tips for Best Results
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  "Make sure the photo or scan of your report is clear and well-lit.",
                  "We support PDF, JPG, and PNG file formats.",
                  "You can upload lab results, medical history, or radiology reports.",
                  "All analysis is private and your data remains secure at all times.",
                ].map((tip, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-6 h-6 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-primary">
                      {i + 1}
                    </div>
                    <p className="text-sm font-medium text-slate-400 leading-relaxed">
                      {tip}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UploadReportPage;
