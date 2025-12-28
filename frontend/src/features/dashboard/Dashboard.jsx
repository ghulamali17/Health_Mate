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
import Header from "../../components/ui/Header";

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
          err.response?.data || err.message
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
          error.response?.data?.error || "Failed to delete vital record"
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Enhanced Header with Gradient */}
      <Header />

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Enhanced Stats Cards with Glass Effect */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="group relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all border border-white/50 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <FileText className="w-7 h-7 text-white" />
                </div>
                {/* <div className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
                     +2 new
                   </div> */}
              </div>
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">
                  Total Reports
                </p>
                <p className="text-4xl font-bold text-gray-900 mb-2">
                  {totalReports}
                </p>
                <div className="flex items-center gap-2 text-xs">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-green-600 font-semibold">
                    12% increase
                  </span>
                  <span className="text-gray-400">this month</span>
                </div>
              </div>
            </div>
          </div>

          <div className="group relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all border border-white/50 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Heart className="w-7 h-7 text-white" />
                </div>
                <Activity className="w-6 h-6 text-red-400 animate-pulse" />
              </div>
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">
                  Vitals Recorded
                </p>
                <p className="text-4xl font-bold text-gray-900 mb-2">
                  {stats.totalVitals}
                </p>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-gray-700 font-medium">
                    BP: {stats.lastVital.bp} mmHg
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="group relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all border border-white/50 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <MessageSquare className="w-7 h-7 text-white" />
                </div>
                <Sparkles className="w-6 h-6 text-yellow-500" />
              </div>
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">
                  AI Conversations
                </p>
                <p className="text-4xl font-bold text-gray-900 mb-2">
                  {stats.totalChats}
                </p>
                <div className="flex items-center gap-2 text-xs">
                  <Shield className="w-4 h-4 text-emerald-500" />
                  <span className="text-gray-700 font-medium">
                    Health queries resolved
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Quick Actions */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
              <Plus className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Existing Cards */}
            <button
              onClick={() => navigate("/add-vitals")}
              className="group cursor-pointer relative bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-5 hover:shadow-xl transition-all border border-red-100 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/0 to-pink-500/0 group-hover:from-red-500/5 group-hover:to-pink-500/5 transition-all"></div>
              <div className="relative flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-bold text-gray-900 mb-1">Add Vitals</p>
                  <p className="text-xs text-gray-600">
                    Record BP, Sugar, Weight
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            <button
              onClick={() => navigate("/summarize")}
              className="group cursor-pointer relative bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-5 hover:shadow-xl transition-all border border-blue-100 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-cyan-500/0 group-hover:from-blue-500/5 group-hover:to-cyan-500/5 transition-all"></div>
              <div className="relative flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                  <Upload className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-bold text-gray-900 mb-1">Upload Report</p>
                  <p className="text-xs text-gray-600">AI will summarize it</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            <button
              onClick={() => navigate("/chat")}
              className="group cursor-pointer relative bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-5 hover:shadow-xl transition-all border border-emerald-100 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-teal-500/0 group-hover:from-emerald-500/5 group-hover:to-teal-500/5 transition-all"></div>
              <div className="relative flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-bold text-gray-900 mb-1">Ask AI</p>
                  <p className="text-xs text-gray-600">
                    Health questions & advice
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* Family Members Card */}
            <button
              onClick={() => navigate("/family-members")}
              className="group cursor-pointer relative bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-5 hover:shadow-xl transition-all border border-indigo-100 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 to-purple-500/0 group-hover:from-indigo-500/5 group-hover:to-purple-500/5 transition-all"></div>
              <div className="relative flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-bold text-gray-900 mb-1">Family Members</p>
                  <p className="text-xs text-gray-600">Manage family health</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* New Card 1: Health Timeline */}
            <button
              onClick={() => navigate("/timeline")}
              className="group cursor-pointer relative bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-5 hover:shadow-xl transition-all border border-amber-100 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 to-orange-500/0 group-hover:from-amber-500/5 group-hover:to-orange-500/5 transition-all"></div>
              <div className="relative flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-bold text-gray-900 mb-1">
                    Health Timeline
                  </p>
                  <p className="text-xs text-gray-600">
                    View your health journey
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* New Card 2: Emergency Contacts */}
            <button
              onClick={() => navigate("/emergency-contacts")}
              className="group cursor-pointer relative bg-gradient-to-br from-rose-50 to-red-50 rounded-xl p-5 hover:shadow-xl transition-all border border-rose-100 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-rose-500/0 to-red-500/0 group-hover:from-rose-500/5 group-hover:to-red-500/5 transition-all"></div>
              <div className="relative flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-red-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-bold text-gray-900 mb-1">
                    Emergency Contacts
                  </p>
                  <p className="text-xs text-gray-600">Quick access to help</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Reports */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">
                  Recent Reports
                </h2>
              </div>
              {recentReports.length > 0 && (
                <button
                  onClick={() => navigate("/reports")}
                  className="text-sm text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 hover:gap-2 transition-all"
                >
                  View All
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>

            {recentReports.length > 0 ? (
              <div className="space-y-3">
                {recentReports.map((report) => (
                  <div
                    key={report._id}
                    onClick={() => {
                      setSelectedReport(report);
                      setShowModal(true);
                    }}
                    className="group flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-blue-50/50 rounded-xl hover:shadow-md transition-all cursor-pointer border border-gray-100"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate mb-1">
                        {report.fileName}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        <span>
                          {new Date(report.uploadedAt).toLocaleDateString()}
                        </span>
                        <span className="text-gray-300">•</span>
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-medium">
                          {report.reportType}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Reports Yet
                </h3>
                <p className="text-gray-500 text-sm mb-4 max-w-sm mx-auto">
                  You haven't uploaded any medical reports yet. Start by
                  uploading your first report to keep track of your health
                  records.
                </p>
                <button
                  onClick={() => navigate("/reports")}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Upload First Report
                </button>
              </div>
            )}
          </div>

          {/* Recent Vitals */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">
                  Recent Vitals
                </h2>
              </div>
              {vitals.length > 0 && (
                <button
                  onClick={() => navigate("/all-vitals")}
                  className="text-sm text-red-600 hover:text-red-700 font-semibold flex items-center gap-1 hover:gap-2 transition-all"
                >
                  View All
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>

            {vitals.length > 0 ? (
              <div className="space-y-3">
                {vitals
                  .slice(-3)
                  .reverse()
                  .map((vital) => (
                    <div
                      key={vital._id}
                      className="p-4 bg-gradient-to-r from-gray-50 to-red-50/50 rounded-xl border border-gray-100"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <p className="text-sm font-semibold text-gray-900">
                            {new Date(vital.measuredAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500 bg-white px-2 py-1 rounded-lg">
                          <Clock className="w-3 h-3" />
                          {new Date(vital.measuredAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div className="bg-gradient-to-br from-red-50 to-pink-50 p-3 rounded-xl border border-red-100">
                          <div className="flex items-center gap-2 mb-1">
                            <Activity className="w-4 h-4 text-red-500" />
                            <p className="text-xs font-medium text-gray-600">
                              Blood Pressure
                            </p>
                          </div>
                          <p className="text-sm md:text-lg font-bold text-gray-900">
                            {vital.bloodPressure?.systolic || "--"}/
                            {vital.bloodPressure?.diastolic || "--"}
                          </p>
                        </div>

                        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-3 rounded-xl border border-blue-100">
                          <div className="flex items-center gap-2 mb-1">
                            <Droplet className="w-4 h-4 text-blue-500" />
                            <p className="text-xs md:text-sm font-medium text-gray-600">
                              Blood Sugar
                            </p>
                          </div>
                          <p className="text-sm md:text-lg font-bold text-gray-900">
                            {vital.bloodSugar || "--"}
                          </p>
                        </div>

                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-3 rounded-xl border border-purple-100">
                          <div className="flex items-center gap-2 mb-1">
                            <Weight className="w-4 h-4 text-purple-500" />
                            <p className="text-xs md:text-sm font-medium text-gray-600">
                              Weight
                            </p>
                          </div>
                          <p className="text-sm md:text-lg font-bold text-gray-900">
                            {vital.weight || "--"} kg
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Activity className="w-8 h-8 text-red-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Vitals Recorded
                </h3>
                <p className="text-gray-500 text-sm mb-4 max-w-sm mx-auto">
                  Start tracking your health measurements. Record your first
                  vitals to monitor your blood pressure, sugar levels, and more.
                </p>
                <button
                  onClick={() => navigate("/add-vitals")}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Record First Vitals
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Health Tip Banner */}
        <div className="relative bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl p-6 shadow-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>

          <div className="relative flex items-start gap-5">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-xl text-white mb-2 flex items-center gap-2">
                💡 Daily Health Tip
              </h3>
              <p className="text-emerald-50 text-sm leading-relaxed mb-4">
                Regular monitoring of vitals helps in early detection of health
                issues. Roz apne BP aur Sugar check karein! Consistency is the
                key to better health management.
              </p>
              <button className="px-5 py-2.5 bg-white text-emerald-600 rounded-xl text-sm font-bold hover:bg-emerald-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                Learn More Tips
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Disclaimer */}
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-2xl p-5 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Shield className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-amber-900 leading-relaxed">
                <strong className="font-bold">⚠️ Medical Disclaimer:</strong>{" "}
                HealthLens AI is designed for understanding your reports only,
                not for medical advice. Always consult your doctor before making
                any health decisions.
                <span className="font-semibold">
                  {" "}
                  Yeh AI sirf samajhne ke liye hai, ilaaj ke liye nahi.
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Modal */}
      {showModal && selectedReport && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 flex items-center justify-between">
              <div className="flex-1">
                <h2 className="text-xl font-bold text-white mb-1">
                  {selectedReport.fileName}
                </h2>
                <p className="text-emerald-100 text-sm">
                  Uploaded: {formatDate(selectedReport.uploadedAt)}
                </p>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => downloadReport(selectedReport)}
                  className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-all text-sm font-semibold"
                >
                  <Download className="w-4 h-4" />
                  Original
                </button>
                {selectedReport.aiSummary && (
                  <button
                    onClick={() => downloadAISummary(selectedReport)}
                    className="flex items-center gap-2 px-4 py-2 bg-white text-emerald-600 rounded-xl hover:bg-emerald-50 transition-all text-sm font-semibold shadow-lg"
                  >
                    <FileText className="w-4 h-4" />
                    Summary
                  </button>
                )}
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 text-white hover:bg-white/20 rounded-xl transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)] bg-gradient-to-br from-gray-50 to-white">
              {selectedReport.aiSummary ? (
                <div
                  dangerouslySetInnerHTML={{ __html: selectedReport.aiSummary }}
                  className="prose max-w-none"
                />
              ) : (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">
                    No AI summary available
                  </p>
                  <p className="text-gray-400 text-sm mt-2">
                    Upload a new report to get AI insights
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
