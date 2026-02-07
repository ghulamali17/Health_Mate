import React from "react";
import { FileText, Download, X } from "lucide-react";

const ReportModal = ({
  showModal,
  selectedReport,
  setShowModal,
  downloadReport,
  downloadAISummary,
  formatDate,
}) => {
  if (!showModal || !selectedReport) return null;

  return (
    <div>
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
    </div>
  );
};

export default ReportModal;
