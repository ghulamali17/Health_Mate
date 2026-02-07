import React from "react";
import { Shield } from "lucide-react";

const Disclaimer = () => {
  return (
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
            HealthLens AI provides health information and analysis. It is not a
            medical diagnosis. Please consult a qualified doctor for any medical
            decisions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Disclaimer;
