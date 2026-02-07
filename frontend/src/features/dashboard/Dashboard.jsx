import React, { useState, useEffect } from "react";
import {
  Activity,
  FileText,
  MessageSquare,
  Plus,
  TrendingUp,
  Heart,
  Upload,
  LayoutDashboard,
  Sparkles,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import api from "../../config/api";
import { useAuth } from "../../context/authContext";
import { toast } from "react-toastify";

import Navbar from "../../components/ui/Navbar";
import StatsCard from "../../components/dashboard/StatsCard";
import QuickActions from "../../components/dashboard/QuickActions";
import RecentReports from "../../components/dashboard/RecentReports";
import RecentVitals from "../../components/dashboard/RecentVitals";
import HealthTipBanner from "../../components/dashboard/HealthTipBanner";
import Disclaimer from "../../components/dashboard/Disclaimer";
import ReportModal from "../../components/dashboard/ReportModal";

import { downloadReport, downloadAISummary } from "../../utils/reportHelpers";

const Dashboard = () => {
  const { user, logout } = useAuth();

  const navigate = useNavigate();

  // States
  const [vitals, setVitals] = useState([]);
  const [loadingVitals, setLoadingVitals] = useState(false);
  const [recentReports, setRecentReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(true);
  const [totalReports, setTotalReports] = useState(0);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Stats
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

  // Update stats
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

  useEffect(() => {
    fetchVitals();
  }, []);

  // Fetch vitals
  const fetchVitals = async () => {
    try {
      setLoadingVitals(true);
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

  // Get reports
  useEffect(() => {
    fetchRecentReports();
  }, []);

  const fetchRecentReports = async () => {
    try {
      setLoadingReports(true);
      const response = await api.get("/api/reports");

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
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <StatsCard
            title="Total Reports"
            value={totalReports}
            icon={FileText}
            secondaryIcon={TrendingUp}
            secondaryIconClassName="text-cta"
            trend="+2 this week"
            trendClassName="text-cta font-semibold"
          />
          <StatsCard
            title="Vitals Tracked"
            value={stats.totalVitals}
            icon={Heart}
            secondaryIcon={Activity}
            secondaryIconClassName="text-primary animate-pulse"
            trend={`${stats.lastVital.bp} mmHg`}
            trendClassName="text-slate-500 truncate"
          />
          <StatsCard
            title="AI Credits"
            value={stats.totalChats}
            icon={MessageSquare}
            secondaryIcon={Sparkles}
            secondaryIconClassName="text-cta"
            trend="Chats resolved"
            trendClassName="text-slate-500"
          />
          <StatsCard
            title="Health Score"
            value="84"
            icon={TrendingUp}
            iconBgClassName="bg-cta/10 dark:bg-cta/20"
            iconColorClassName="text-cta"
            trend="Optimal"
            trendClassName="text-cta font-semibold"
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5 text-primary" />
            </div>
            <h2 className="font-heading text-lg font-bold text-slate-900 dark:text-white">
              Quick Actions
            </h2>
          </div>
          <QuickActions />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentReports
            recentReports={recentReports}
            setSelectedReport={setSelectedReport}
            setShowModal={setShowModal}
          />

          <RecentVitals vitals={vitals} />
        </div>

        {/* Health Tip Banner */}
        <HealthTipBanner />

        {/* Disclaimer */}
        <Disclaimer />
        {/* Report Modal */}
        <ReportModal
          showModal={showModal}
          selectedReport={selectedReport}
          setShowModal={setShowModal}
          downloadReport={downloadReport}
          downloadAISummary={downloadAISummary}
          formatDate={formatDate}
        />
      </main>
    </div>
  );
};

export default Dashboard;
