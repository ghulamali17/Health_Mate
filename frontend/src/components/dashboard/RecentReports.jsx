import React from "react";
import { FileText, Clock, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const RecentReports = ({ recentReports, setSelectedReport, setShowModal }) => {
  const navigate = useNavigate();

  return (
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
            Your medical summary awaits. Securely store and analyze reports with
            one click.
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
  );
};

export default RecentReports;
