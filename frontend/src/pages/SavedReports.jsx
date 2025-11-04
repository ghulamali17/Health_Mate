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
      const sortedReports = response.data.reports?.sort(
        (a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt)
      ) || [];
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
    if (!bytes) return "0 B";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  // Helper function to extract file extension
  const getFileExtension = (filenameOrUrl) => {
    if (!filenameOrUrl) return 'pdf';
    
    let filename = filenameOrUrl;
    if (filenameOrUrl.includes('/')) {
      filename = filenameOrUrl.split('/').pop() || '';
    }
    
    const extension = filename.split('.').pop()?.toLowerCase();
    const validExtensions = ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx', 'txt'];
    return validExtensions.includes(extension) ? extension : 'pdf';
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
      
      if (!response.ok) throw new Error('Download failed');
      
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      
      const fileExtension = getFileExtension(report.fileName || report.fileUrl);
      const fileName = report.fileName && !report.fileName.includes('.') 
        ? `${report.fileName}.${fileExtension}`
        : report.fileName || `report.${fileExtension}`;
      
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      
      toast.success('Report downloaded successfully');
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Failed to download report');
      window.open(report.fileUrl, '_blank');
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
    <title>${report.fileName || 'Report'} - AI Summary</title>
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

      const originalName = report.fileName?.split('.')[0] || 'report';
      const fileName = `${originalName}_summary.html`;
      
      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success('Summary downloaded successfully');
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Failed to download summary');
    }
  };

  // Calculate statistics
  const totalReports = reports.length;
  const avgFileSize = reports.length > 0 
    ? formatFileSize(reports.reduce((acc, r) => acc + (r.fileSize || 0), 0) / reports.length)
    : "0 B";
  
  const recentReportsCount = reports.filter(report => {
    const reportDate = new Date(report.uploadedAt);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return reportDate > thirtyDaysAgo;
  }).length;

  const thisWeekCount = reports.filter(report => {
    const reportDate = new Date(report.uploadedAt);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return reportDate > weekAgo;
  }).length;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 text-sm">Loading your reports...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
                <p className="text-sm text-gray-500">Manage your medical reports</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={fetchReports}
                className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
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
            <div className="bg-green-50 rounded-lg p-4 border border-green-100">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-green-500" />
                <p className="text-xs text-gray-600 font-medium">Total Reports</p>
              </div>
              <p className="text-2xl font-bold text-gray-900">{totalReports}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border border-green-100">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <p className="text-xs text-gray-600 font-medium">Avg File Size</p>
              </div>
              <p className="text-2xl font-bold text-gray-900">{avgFileSize}</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-blue-500" />
                <p className="text-xs text-gray-600 font-medium">Last 30 Days</p>
              </div>
              <p className="text-2xl font-bold text-gray-900">{recentReportsCount}</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-purple-500" />
                <p className="text-xs text-gray-600 font-medium">This Week</p>
              </div>
              <p className="text-2xl font-bold text-gray-900">{thisWeekCount}</p>
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
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
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

        {/* Results */}
        {filteredReports.length === 0 ? (
          <div className="text-center py-20">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {search ? "No Reports Found" : "No Reports Uploaded Yet"}
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              {search ? "Try a different search term" : "Upload your first medical report to get started"}
            </p>
            <button 
              onClick={() => window.location.href = "/upload-report"} 
              className="px-6 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
            >
              Upload First Report
            </button>
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing {filteredReports.length} {filteredReports.length === 1 ? 'report' : 'reports'}
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Filter className="w-4 h-4" />
                Latest First
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredReports.map((report) => (
                <div
                  key={report._id}
                  className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow relative group"
                >
                  <button
                    onClick={() => deleteReport(report._id)}
                    className="absolute top-3 right-3 p-2 bg-red-50 text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="mb-4 pb-3 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-green-500" />
                        <span className="text-sm font-semibold text-gray-900 capitalize">
                          {report.reportType}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
                        {new Date(report.uploadedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h3 className="font-semibold text-gray-900 mb-3 line-clamp-2">
                      {report.fileName}
                    </h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center justify-between">
                        <span>Uploaded</span>
                        <span className="font-medium">
                          {new Date(report.uploadedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>File Size</span>
                        <span className="font-medium">
                          {formatFileSize(report.fileSize)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => viewReport(report._id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                    >
                      <Eye className="w-4 h-4" />
                      View Summary
                    </button>
                    <button
                      onClick={() => downloadReport(report)}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>

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

      {/* Summary Modal */}
      {showModal && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedReport.fileName}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Uploaded: {formatDate(selectedReport.uploadedAt)}
                </p>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => downloadReport(selectedReport)}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                >
                  <Download className="w-4 h-4" />
                  Original
                </button>
                {selectedReport.aiSummary && (
                  <button
                    onClick={() => downloadAISummary(selectedReport)}
                    className="flex items-center gap-2 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                  >
                    <FileText className="w-4 h-4" />
                    Summary
                  </button>
                )}
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  ×
                </button>
              </div>
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
                  <p className="text-gray-500">No AI summary available</p>
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