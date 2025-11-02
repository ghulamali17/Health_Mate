import React, { useState, useEffect } from "react";
import {
  FileText,
  Download,
  Trash2,
  Eye,
  Calendar,
  FileType,
  Loader2,
  Search,
  Filter,
  TrendingUp,
  ArrowLeft,
  User,
  AlertCircle
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

const SavedReports = () => {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchCurrentUser();
    fetchReports();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem("pos-token");
      if (!token) return;
      
      const response = await fetch(`${API_URL}/api/users/current`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setUser(data);
    } catch (err) {
      console.error("Failed to fetch user:", err);
    }
  };

  const fetchReports = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("pos-token");
      const response = await axios.get(`${API_URL}/api/reports`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const sortedReports = response.data.reports.sort(
        (a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt)
      );
      setReports(sortedReports);
      setFilteredReports(sortedReports);
    } catch (error) {
      console.error("Failed to fetch reports:", error);
      toast.error("Failed to fetch reports");
    } finally {
      setLoading(false);
    }
  };

  const viewReport = async (reportId) => {
    try {
      const token = localStorage.getItem("pos-token");
      const response = await axios.get(`${API_URL}/api/reports/${reportId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedReport(response.data.report);
      setShowModal(true);
    } catch (error) {
      console.error("Failed to fetch report:", error);
      toast.error("Failed to load report");
    }
  };

  const deleteReport = async (reportId) => {
    if (!window.confirm("Are you sure you want to delete this report?")) return;

    try {
      const token = localStorage.getItem("pos-token");
      await axios.delete(`${API_URL}/api/reports/${reportId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReports(reports.filter((r) => r._id !== reportId));
      setFilteredReports(filteredReports.filter((r) => r._id !== reportId));
      toast.success("Report deleted successfully");
    } catch (error) {
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
          report.reportType?.toLowerCase().includes(q)
      )
    );
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

  // Calculate statistics
  const totalReports = reports.length;
  const avgFileSize = reports.length > 0 
    ? formatFileSize(reports.reduce((acc, r) => acc + (r.fileSize || 0), 0) / reports.length)
    : "0 B";
  const recentReports = reports.filter(report => {
    const reportDate = new Date(report.uploadedAt);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return reportDate > thirtyDaysAgo;
  }).length;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 text-sm">Loading your reports...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => window.history.back()}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Saved Reports</h1>
                <p className="text-sm text-gray-500">Apni puri medical reports dekhen aur manage karen</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={fetchReports}
                className="px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg text-sm font-medium hover:from-green-600 hover:to-blue-600 transition-all shadow-sm"
              >
                Refresh
              </button>
              {user && (
                <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
                  <User className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">{user.name}</span>
                </div>
              )}
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-4 border border-green-100">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-green-500" />
                <p className="text-xs text-gray-600 font-medium">Total Reports</p>
              </div>
              <p className="text-2xl font-bold text-gray-900">{totalReports}</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-4 border border-green-100">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <p className="text-xs text-gray-600 font-medium">Avg File Size</p>
              </div>
              <p className="text-2xl font-bold text-gray-900">{avgFileSize}</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-100">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-blue-500" />
                <p className="text-xs text-gray-600 font-medium">Last 30 Days</p>
              </div>
              <p className="text-2xl font-bold text-gray-900">{recentReports}</p>
            </div>
           <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-100">
  <div className="flex items-center gap-2 mb-2">
    <Calendar className="w-4 h-4 text-purple-500" />
    <p className="text-xs text-gray-600 font-medium">This Week</p>
  </div>
  <p className="text-2xl font-bold text-gray-900">
    {reports.filter(report => {
      const reportDate = new Date(report.uploadedAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return reportDate > weekAgo;
    }).length}
  </p>
</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        {/* Search Bar */}
        <div className="mb-6 relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-4 top-3.5" />
          <input
            type="text"
            placeholder="Search by report name, type..."
            value={search}
            onChange={handleSearch}
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
          />
          {search && (
            <button
              onClick={() => {
                setSearch("");
                setFilteredReports(reports);
              }}
              className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500 text-sm">Loading your reports...</p>
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {search ? "No Reports Found" : "No Reports Uploaded Yet"}
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              {search ? "Try a different search term" : "Upload your first medical report to get started"}
            </p>
            <button 
              onClick={() => window.location.href = "/upload-report"} 
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg font-medium hover:from-green-600 hover:to-blue-600 transition-all shadow-md"
            >
              Upload First Report
            </button>
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing <span className="font-semibold text-gray-900">{filteredReports.length}</span> {filteredReports.length === 1 ? 'report' : 'reports'}
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Filter className="w-4 h-4" />
                Latest First
              </div>
            </div>

            {/* Reports Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredReports.map((report) => (
                <div
                  key={report._id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-5 border border-gray-100 relative group"
                >
                  {/* Delete Button */}
                  <button
                    onClick={() => deleteReport(report._id)}
                    className="absolute top-3 right-3 p-2 bg-red-50 text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  {/* Header: Report Type + Icon */}
                  <div className="mb-4 pb-3 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-green-500" />
                        <span className="text-sm font-semibold text-gray-900 capitalize">
                          {report.reportType}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
                        <Calendar className="w-3 h-3" />
                        {new Date(report.uploadedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Report Details */}
                  <div className="mb-4">
                    <h3 className="font-semibold text-gray-900 mb-3 line-clamp-2">
                      {report.fileName}
                    </h3>

                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span>Uploaded</span>
                        </div>
                        <span className="font-medium text-gray-900">
                          {new Date(report.uploadedAt).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileType className="w-4 h-4 text-gray-400" />
                          <span>File Size</span>
                        </div>
                        <span className="font-medium text-gray-900">
                          {formatFileSize(report.fileSize)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => viewReport(report._id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:from-green-600 hover:to-blue-600 transition-all text-sm font-medium"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                    <a
                      href={report.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all flex items-center justify-center"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  </div>

                  {/* AI Summary Available Indicator */}
                  {report.aiSummary && (
                    <div className="mt-3 p-2 bg-green-50 rounded-lg border border-green-100">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-green-700">
                          AI Summary Available
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Modal for viewing report */}
      {showModal && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedReport.fileName}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Uploaded: {formatDate(selectedReport.uploadedAt)}
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {selectedReport.aiSummary ? (
                <div
                  dangerouslySetInnerHTML={{ __html: selectedReport.aiSummary }}
                  className="prose max-w-none"
                />
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No AI summary available for this report</p>
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