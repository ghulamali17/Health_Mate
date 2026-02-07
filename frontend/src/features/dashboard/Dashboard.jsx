import React, { useState, useRef, useEffect } from "react";
import {
  Activity,
  FileText,
  MessageSquare,
  Plus,
  Download,
  TrendingUp,
  Heart,
  Calendar,
  Clock,
  ArrowRight,
  Upload,
  ChevronRight,
  Droplet,
  Weight,
  Thermometer,
  BarChart3,
  User,
  Settings,
  LogOut,
  LayoutDashboard,
  Sparkles,
  Shield,
  Phone,
  Users,
  X,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import api from "../../config/api";
import { useAuth } from "../../context/authContext";
import { toast } from "react-toastify";
import useClickOutside from "../../hooks/useClickOutside";
import axios from "axios";
import Navbar from "../../components/ui/Navbar";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [vitals, setVitals] = useState([]);
  const [loadingVitals, setLoadingVitals] = useState(false);
  const [loadingUser, setLoadingUser] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [recentReports, setRecentReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(true);
  // const [recentReports, setRecentReports] = useState([]);
  const [totalReports, setTotalReports] = useState(0);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const { logout } = useAuth();
  const navigate = useNavigate();

  // Stats state with real data
  const [stats, setStats] = useState({
    totalReports: 12,
    totalVitals: 0,
    totalChats: 0,
    lastVital: {
      bp: "--/--",
      sugar: "--",
      date: "No data",
    },
  });

  // Update stats when vitals change
  useEffect(() => {
    if (vitals.length === 0) return;

    const lastVital = vitals[vitals.length - 1];
    setStats((prev) => ({
      ...prev,
      totalVitals: vitals.length,
      lastVital: {
        bp:
          lastVital.bloodPressure?.systolic &&
          lastVital.bloodPressure?.diastolic
            ? `${lastVital.bloodPressure.systolic}/${lastVital.bloodPressure.diastolic}`
            : "--/--",
        sugar: lastVital.bloodSugar || "--",
        date: lastVital.measuredAt
          ? new Date(lastVital.measuredAt).toLocaleDateString()
          : "No data",
      },
    }));
  }, [vitals]);

  const handleLogout = () => {
    logout();
    localStorage.removeItem("pos-token");
    setIsDropdownOpen(false);
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsDropdownOpen(false);
  };

  const dropdownRef = useRef(null);

  // Use the click outside hook
  useClickOutside(dropdownRef, () => {
    setIsDropdownOpen(false);
  });

  // Fetch current user
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        setLoadingUser(true);
        const token = localStorage.getItem("pos-token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await api.get("/api/users/current");
        setUser(response.data);
      } catch (err) {
        console.error(
          "Failed to fetch user:",
          err.response?.data || err.message,
        );

        if (err.response?.status === 401) {
          toast.error("Session expired. Please login again.");
          localStorage.removeItem("pos-token");
          navigate("/login");
        }
      } finally {
        setLoadingUser(false);
      }
    };

    fetchCurrentUser();
  }, [navigate]);

  // Fetch all vitals on load
  useEffect(() => {
    fetchVitals();
  }, []);

  // Fetch vitals
  const fetchVitals = async () => {
    try {
      setLoadingVitals(true);
      const token = localStorage.getItem("pos-token");
      if (!token) {
        navigate("/login");
        return;
      }

      const res = await api.get("/api/vitals/useritems");
      setVitals(res.data);
    } catch (err) {
      console.error("Fetch vitals error:", err.response?.data || err.message);

      if (err.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("pos-token");
        navigate("/login");
      } else if (err.code === "ERR_NETWORK") {
        toast.error("Network error. Please check your connection.");
      } else {
        toast.error("Failed to fetch vitals");
      }
    } finally {
      setLoadingVitals(false);
    }
  };

  // Delete vital
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this vital record?")) {
      return;
    }

    try {
      const token = localStorage.getItem("pos-token");
      if (!token) {
        toast.error("Unauthorized request. Please login again.");
        navigate("/login");
        return;
      }

      await api.delete(`/api/vitals/deleteitem/${id}`);

      setVitals((prev) => prev.filter((v) => v._id !== id));
      toast.success("Vital record deleted successfully");
    } catch (error) {
      console.error("Delete error:", error.response?.data || error.message);

      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("pos-token");
        navigate("/login");
      } else if (error.response?.status === 404) {
        toast.error("Vital record not found");
      } else if (error.code === "ERR_NETWORK") {
        toast.error("Network error. Please check your connection.");
      } else {
        toast.error(
          error.response?.data?.error || "Failed to delete vital record",
        );
      }
    }
  };

  // Get reports
  useEffect(() => {
    fetchRecentReports();
  }, []);

  const fetchRecentReports = async () => {
    try {
      setLoadingReports(true);
      const token = localStorage.getItem("pos-token");
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

      const response = await axios.get(`${API_URL}/api/reports`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const allReports = Array.isArray(response.data)
        ? response.data
        : response.data.reports || [];

      setTotalReports(allReports.length);
      setRecentReports(allReports.slice(-3).reverse());
    } catch (error) {
      console.error("Failed to fetch recent reports:", error);
    } finally {
      setLoadingReports(false);
    }
  };
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };
  // Helper function to extract file extension
  const getFileExtension = (filenameOrUrl) => {
    if (!filenameOrUrl) return "pdf";

    let filename = filenameOrUrl;
    if (filenameOrUrl.includes("/")) {
      filename = filenameOrUrl.split("/").pop() || "";
    }

    const extension = filename.split(".").pop()?.toLowerCase();
    const validExtensions = ["pdf", "jpg", "jpeg", "png", "doc", "docx", "txt"];
    return validExtensions.includes(extension) ? extension : "pdf";
  };

  // Download original report file
  const downloadReport = async (report) => {
    if (!report?.fileUrl) {
      toast.error("No file available for download");
      return;
    }

    try {
      const token = localStorage.getItem("pos-token");
      const response = await fetch(report.fileUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Download failed");

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;

      const fileExtension = getFileExtension(report.fileName || report.fileUrl);
      const fileName =
        report.fileName && !report.fileName.includes(".")
          ? `${report.fileName}.${fileExtension}`
          : report.fileName || `report.${fileExtension}`;

      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

      toast.success("Report downloaded successfully");
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to download report");
      window.open(report.fileUrl, "_blank");
    }
  };

  // Download AI summary as optimized HTML
  const downloadAISummary = (report) => {
    if (!report?.aiSummary) {
      toast.error("No AI summary available to download");
      return;
    }

    try {
      const htmlContent = `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${report.fileName || "Report"} - AI Summary</title>
      <style>
          body { 
              font-family: system-ui, -apple-system, sans-serif; 
              line-height: 1.6; 
              margin: 0; 
              padding: 20px; 
              background: #f8fafc; 
              color: #1f2937;
          }
          .container { 
              max-width: 800px; 
              margin: 0 auto; 
              background: white; 
              border-radius: 12px; 
              box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); 
              overflow: hidden;
          }
          .header { 
              background: linear-gradient(135deg, #059669, #047857); 
              color: white; 
              padding: 24px; 
              text-align: center;
          }
          .header h1 { 
              margin: 0 0 8px 0; 
              font-size: 24px; 
              font-weight: 700;
          }
          .header p { 
              margin: 0; 
              opacity: 0.9;
          }
          .content { 
              padding: 24px;
          }
          @media print {
              body { background: white; padding: 0; }
              .container { box-shadow: none; border-radius: 0; }
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">
              <h1>Health Report Summary</h1>
              <p>${report.fileName} • ${new Date().toLocaleDateString()}</p>
          </div>
          <div class="content">
              ${report.aiSummary}
          </div>
      </div>
  </body>
  </html>`;

      const originalName = report.fileName?.split(".")[0] || "report";
      const fileName = `${originalName}_summary.html`;

      const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Summary downloaded successfully");
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to download summary");
    }
  };

  return (
    <div className="min-h-screen bg-background dark:bg-slate-950 font-body transition-colors duration-300">
      <Navbar />

      <main className="max-w-[1440px] mx-auto mt-18 p-4 md:p-6 lg:p-8 space-y-6 md:space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
              Dashboard Overview
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Welcome back, {user?.name || "User"}. Here is your health summary.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/add-vitals")}
              className="btn-primary flex items-center gap-2 text-sm px-4 py-2.5 bg-cta text-white rounded-lg font-bold cursor-pointer hover:opacity-90 transition-all shadow-md"
            >
              <Plus className="w-4 h-4" />
              Add Record
            </button>
            <button
              onClick={() => navigate("/summarize")}
              className="flex items-center gap-2 text-sm px-4 py-2.5 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-lg font-bold cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm"
            >
              <Upload className="w-4 h-4" />
              Upload Report
            </button>
          </div>
        </div>
        {/* Enhanced Stats Cards with Glass Effect */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <div className="card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary dark:text-blue-400" />
              </div>
              <TrendingUp className="w-5 h-5 text-cta" />
            </div>
            <div>
              <p className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                Total Reports
              </p>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold text-slate-900 dark:text-white">
                  {totalReports}
                </p>
                <span className="text-xs text-cta font-semibold">
                  +2 this week
                </span>
              </div>
            </div>
          </div>

          <div className="card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6 text-primary dark:text-blue-400" />
              </div>
              <Activity className="w-5 h-5 text-primary animate-pulse" />
            </div>
            <div>
              <p className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                Vitals Tracked
              </p>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold text-slate-900 dark:text-white">
                  {stats.totalVitals}
                </p>
                <span className="text-xs text-slate-500 truncate">
                  {stats.lastVital.bp} mmHg
                </span>
              </div>
            </div>
          </div>

          <div className="card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-primary dark:text-blue-400" />
              </div>
              <Sparkles className="w-5 h-5 text-cta" />
            </div>
            <div>
              <p className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                AI Credits
              </p>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold text-slate-900 dark:text-white">
                  {stats.totalChats}
                </p>
                <span className="text-xs text-slate-500">Chats resolved</span>
              </div>
            </div>
          </div>

          <div className="card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-cta/10 dark:bg-cta/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-cta" />
              </div>
            </div>
            <div>
              <p className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                Health Score
              </p>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold text-slate-900 dark:text-white">
                  84
                </p>
                <span className="text-xs text-cta font-semibold">Optimal</span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Quick Actions */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5 text-primary" />
            </div>
            <h2 className="font-heading text-lg font-bold text-slate-900 dark:text-white">
              Quick Actions
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {[
              {
                label: "Add Vitals",
                icon: Heart,
                path: "/add-vitals",
                color: "bg-red-500",
                desc: "BP, Sugar, Weight",
              },
              {
                label: "Upload",
                icon: Upload,
                path: "/summarize",
                color: "bg-blue-500",
                desc: "Report discovery",
              },
              {
                label: "Ask AI",
                icon: MessageSquare,
                path: "/chat",
                color: "bg-cta",
                desc: "AI Consultant",
              },
              {
                label: "Family",
                icon: Users,
                path: "/family-members",
                color: "bg-indigo-500",
                desc: "Record sharing",
              },
              {
                label: "Timeline",
                icon: Calendar,
                path: "/timeline",
                color: "bg-primary",
                desc: "Health journey",
              },
              {
                label: "Emergency",
                icon: Phone,
                path: "/emergency-contacts",
                color: "bg-rose-500",
                desc: "Quick help",
              },
            ].map((action, idx) => (
              <button
                key={idx}
                onClick={() => navigate(action.path)}
                className="group flex flex-col p-4 bg-slate-50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800 hover:border-primary dark:hover:border-primary rounded-xl transition-all cursor-pointer text-left shadow-sm"
              >
                <div
                  className={`w-10 h-10 ${action.color} text-white rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-md`}
                >
                  <action.icon className="w-5 h-5" />
                </div>
                <p className="font-bold text-slate-900 dark:text-white text-sm mb-1">
                  {action.label}
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                  {action.desc}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <h2 className="font-heading text-lg font-bold text-slate-900 dark:text-white">
                  Recent Reports
                </h2>
              </div>
              <button
                onClick={() => navigate("/reports")}
                className="text-sm font-semibold text-primary hover:text-blue-700 transition-colors"
              >
                Explore All
              </button>
            </div>

            {recentReports.length > 0 ? (
              <div className="space-y-4">
                {recentReports.map((report) => (
                  <div
                    key={report._id}
                    onClick={() => {
                      setSelectedReport(report);
                      setShowModal(true);
                    }}
                    className="group flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl transition-all cursor-pointer"
                  >
                    <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-lg flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                      <FileText className="w-6 h-6 text-primary dark:text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-900 dark:text-white truncate mb-1">
                        {report.fileName}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-medium">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(report.uploadedAt).toLocaleDateString()}
                        </span>
                        <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-md uppercase tracking-tighter">
                          {report.reportType}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-300 transition-transform group-hover:translate-x-1" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center py-12 text-center">
                <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                  <FileText className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-2 text-lg">
                  Empty Vault
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs mb-6">
                  Your medical summary awaits. Securely store and analyze
                  reports with one click.
                </p>
                <button
                  onClick={() => navigate("/reports")}
                  className="px-6 py-2.5 bg-primary text-white rounded-lg font-bold text-sm shadow-md hover:opacity-90 transition-all cursor-pointer"
                >
                  Initiate Upload
                </button>
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-primary" />
                </div>
                <h2 className="font-heading text-lg font-bold text-slate-900 dark:text-white">
                  Recent Vitals
                </h2>
              </div>
              <button
                onClick={() => navigate("/all-vitals")}
                className="text-sm font-semibold text-primary hover:text-blue-700 transition-colors"
              >
                Track History
              </button>
            </div>

            {vitals.length > 0 ? (
              <div className="space-y-4">
                {vitals
                  .slice(-2)
                  .reverse()
                  .map((vital) => (
                    <div
                      key={vital._id}
                      className="p-4 bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 rounded-xl"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                          <Calendar className="w-4 h-4" />
                          <p className="text-xs font-bold uppercase tracking-widest leading-none">
                            {new Date(vital.measuredAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                          Verified Record
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-slate-800 shadow-sm">
                          <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">
                            BP
                          </p>
                          <p className="text-sm md:text-base font-bold text-slate-900 dark:text-white">
                            {vital.bloodPressure?.systolic || "--"}/
                            {vital.bloodPressure?.diastolic || "--"}
                          </p>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-slate-800 shadow-sm">
                          <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">
                            Sugar
                          </p>
                          <p className="text-sm md:text-base font-bold text-slate-900 dark:text-white">
                            {vital.bloodSugar || "--"}
                          </p>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-slate-800 shadow-sm">
                          <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">
                            Weight
                          </p>
                          <p className="text-sm md:text-base font-bold text-slate-900 dark:text-white">
                            {vital.weight || "--"} kg
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center py-12 text-center">
                <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                  <Activity className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-2 text-lg">
                  No Records Yet
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs mb-6">
                  Start tracking your health today. Record vitals to see trends
                  and get personalized tips.
                </p>
                <button
                  onClick={() => navigate("/add-vitals")}
                  className="px-6 py-2.5 bg-primary text-white rounded-lg font-bold text-sm shadow-md hover:opacity-90 transition-all cursor-pointer"
                >
                  Create Record
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Health Tip Banner */}
        <div className="bg-primary shadow-xl rounded-xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
          <div className="relative flex flex-col md:flex-row items-center gap-6">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center flex-shrink-0 border border-white/20">
              <Sparkles className="w-8 h-8 text-cta" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="font-heading font-bold text-xl text-white mb-2 uppercase tracking-wide">
                Smart Health Tip
              </h3>
              <p className="text-blue-100 text-sm leading-relaxed max-w-3xl">
                Tracking your vitals regularly helps you stay on top of your
                health. Keep adding your blood pressure and sugar levels to get
                the best insights.
              </p>
            </div>
            <button className="whitespace-nowrap px-6 py-3 bg-cta text-white rounded-lg font-bold text-sm shadow-lg hover:opacity-90 transition-all cursor-pointer">
              View Insights
            </button>
          </div>
        </div>

        {/* Enhanced Disclaimer */}
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-slate-200 dark:bg-slate-800 rounded-lg flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed uppercase tracking-tight font-medium">
                <span className="text-slate-900 dark:text-white font-bold mr-2">
                  MEDICAL DISCLAIMER:
                </span>
                HealthLens AI provides health information and analysis. It is
                not a medical diagnosis. Please consult a qualified doctor for
                any medical decisions.
              </p>
            </div>
          </div>
        </div>
        {showModal && selectedReport && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 z-[1000] animate-fadeIn">
            <div className="bg-white dark:bg-slate-900 rounded-[1.5rem] sm:rounded-2xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800">
              <div className="bg-slate-50 dark:bg-slate-800 p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 dark:border-slate-700 gap-4">
                <div className="flex-1 min-w-0">
                  <h2 className="font-heading text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-1 uppercase tracking-tight truncate">
                    {selectedReport.fileName}
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400 text-[10px] font-semibold uppercase tracking-widest">
                    UPLOADED: {formatDate(selectedReport.uploadedAt)}
                  </p>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <button
                    onClick={() => downloadReport(selectedReport)}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-2 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 transition-all text-[10px] sm:text-xs font-bold cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span className="hidden xs:inline">DOC</span>
                  </button>
                  {selectedReport.aiSummary && (
                    <button
                      onClick={() => downloadAISummary(selectedReport)}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-all text-[10px] sm:text-xs font-bold shadow-md cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span className="hidden xs:inline">SUM</span>
                    </button>
                  )}
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-5 sm:p-8 overflow-y-auto max-h-[calc(95vh-120px)] sm:max-h-[calc(90vh-100px)]">
                {selectedReport.aiSummary ? (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: selectedReport.aiSummary,
                    }}
                    className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 font-body text-sm sm:text-base leading-relaxed"
                  />
                ) : (
                  <div className="text-center py-16">
                    <FileText className="w-16 h-16 text-slate-200 dark:text-slate-800 mx-auto mb-4" />
                    <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                      Analysis Unavailable
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
