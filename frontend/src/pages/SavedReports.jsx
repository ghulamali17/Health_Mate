import React, { useState, useEffect } from "react";
import {
  FileText,
  Download,
  Trash2,
  Eye,
  Calendar,
  FileType,
  Search,
  Filter,
  TrendingUp,
  X,
  Loader2,
} from "lucide-react";
import api from "../config/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/ui/Navbar";

const SavedReports = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/reports");
      const sortedReports =
        response.data.reports?.sort(
          (a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt),
        ) || [];
      setReports(sortedReports);
      setFilteredReports(sortedReports);
    } catch (error) {
      console.error("Failed to fetch reports:", error);
      toast.error("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  const viewReport = async (reportId) => {
    try {
      const response = await api.get(`/api/reports/${reportId}`);
      setSelectedReport(response.data.report);
      setShowModal(true);
    } catch (error) {
      console.error("Failed to fetch report:", error);
      toast.error("Failed to load report details");
    }
  };

  const deleteReport = async (reportId) => {
    if (!window.confirm("Are you sure you want to delete this report?")) return;

    try {
      await api.delete(`/api/reports/${reportId}`);
      setReports(reports.filter((r) => r._id !== reportId));
      setFilteredReports(filteredReports.filter((r) => r._id !== reportId));
      toast.success("Report deleted successfully");
    } catch (error) {
      // ...
      console.error("Failed to delete report:", error);
      toast.error("Failed to delete report");
    }
  };

  const handleSearch = (e) => {
    const q = e.target.value.toLowerCase();
    setSearch(q);
    setFilteredReports(
      reports.filter(
        (report) =>
          report.fileName?.toLowerCase().includes(q) ||
          report.reportType?.toLowerCase().includes(q),
      ),
    );
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 B";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  const downloadReport = async (report) => {
    if (!report?.fileUrl) {
      toast.error("No file available for download");
      return;
    }
    window.open(report.fileUrl, "_blank");
  };

  const totalReportsCount = reports.length;
  const avgFileSize =
    reports.length > 0
      ? formatFileSize(
          reports.reduce((acc, r) => acc + (r.fileSize || 0), 0) /
            reports.length,
        )
      : "0 B";

  const last30DaysCount = reports.filter((report) => {
    const reportDate = new Date(report.uploadedAt);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return reportDate > thirtyDaysAgo;
  }).length;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#F8FAFC]">
        <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
          Syncing Archive...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-12 mt-12">
        {/* Title Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              Saved Reports
            </h1>
            <p className="text-slate-500 font-medium">
              Your medical document archive and summaries.
            </p>
          </div>

          <button
            onClick={fetchReports}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all shadow-sm"
          >
            <TrendingUp className="w-4 h-4" />
            Refresh Archive
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {[
            {
              label: "Total Reports",
              value: totalReportsCount,
              icon: FileText,
              color: "text-slate-500",
              bg: "bg-slate-50",
            },
            {
              label: "Archive Size",
              value: avgFileSize,
              icon: FileType,
              color: "text-blue-500",
              bg: "bg-blue-50",
            },
            {
              label: "Active Month",
              value: last30DaysCount,
              icon: Calendar,
              color: "text-violet-500",
              bg: "bg-violet-50",
            },
            {
              label: "Health Status",
              value: "Optimal",
              icon: TrendingUp,
              color: "text-emerald-500",
              bg: "bg-emerald-50",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 ${stat.bg} rounded-lg ${stat.color}`}>
                  <stat.icon className="w-4 h-4" />
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {stat.label}
                </p>
              </div>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="mb-12 relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search reports by filename or category..."
            value={search}
            onChange={handleSearch}
            className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:outline-none focus:border-primary/40 transition-all font-medium text-slate-700 placeholder:text-slate-400"
          />
          {search && (
            <button
              onClick={() => {
                setSearch("");
                setFilteredReports(reports);
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-slate-900"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {filteredReports.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
            <div className="w-20 h-20 bg-slate-50 flex items-center justify-center mx-auto mb-6 rounded-2xl">
              <FileText className="w-10 h-10 text-slate-200" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">
              No reports found
            </h2>
            <p className="text-slate-500 font-medium mb-8">
              Upload a medical report to get an AI-powered summary.
            </p>
            <button
              onClick={() => navigate("/summarize")}
              className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all active:scale-95 shadow-lg"
            >
              Upload Now
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReports.map((report) => (
              <div
                key={report._id}
                className="group bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md hover:border-primary/10 transition-all relative overflow-hidden"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-slate-50 text-slate-400 rounded-lg">
                      <FileType className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest">
                      {report.reportType || "Health Report"}
                    </span>
                  </div>
                  <button
                    onClick={() => deleteReport(report._id)}
                    className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="text-lg font-bold text-slate-900 leading-tight mb-6 line-clamp-2">
                  {report.fileName}
                </h3>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center bg-slate-50 p-2 rounded-lg">
                    <span className="text-[9px] font-bold text-slate-400 uppercase">
                      Uploaded
                    </span>
                    <span className="text-xs font-bold text-slate-700">
                      {formatDate(report.uploadedAt)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center bg-slate-50 p-2 rounded-lg">
                    <span className="text-[9px] font-bold text-slate-400 uppercase">
                      Size
                    </span>
                    <span className="text-xs font-bold text-slate-700">
                      {formatFileSize(report.fileSize)}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => viewReport(report._id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all text-xs font-bold shadow-sm shadow-primary/10"
                  >
                    <Eye className="w-4 h-4" />
                    View Analysis
                  </button>
                  <button
                    onClick={() => downloadReport(report)}
                    className="p-3 bg-slate-50 text-slate-400 border border-slate-50 rounded-xl hover:bg-slate-100 transition-all"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Analysis Modal */}
      {showModal && selectedReport && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-[1000] animate-fadeIn overflow-hidden">
          <div className="bg-white rounded-[1.5rem] sm:rounded-3xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] flex flex-col shadow-2xl border border-slate-200">
            <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 bg-primary/5 text-primary rounded-lg flex-shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 truncate">
                    {selectedReport.fileName}
                  </h2>
                  <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {formatDate(selectedReport.uploadedAt)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 text-slate-400 hover:text-slate-900 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-4 sm:p-8 overflow-y-auto custom-scrollbar flex-1 bg-slate-50/30">
              {selectedReport.aiSummary ? (
                <div className="prose prose-slate max-w-none">
                  <div
                    className="p-5 sm:p-8 bg-white rounded-2xl border border-slate-100 font-medium text-slate-700 leading-relaxed text-sm sm:text-base"
                    dangerouslySetInnerHTML={{
                      __html: selectedReport.aiSummary,
                    }}
                  />
                </div>
              ) : (
                <div className="text-center py-20 bg-white rounded-2xl border border-slate-50">
                  <Loader2 className="w-10 h-10 text-slate-200 mx-auto mb-4" />
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    No summary generated
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

export default SavedReports;
