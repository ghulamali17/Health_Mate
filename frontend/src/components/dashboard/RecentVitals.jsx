import React from "react";
import { Heart, Activity, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

const RecentVitals = ({ vitals }) => {
  const navigate = useNavigate();

  return (
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
            Start tracking your health today. Record vitals to see trends and
            get personalized tips.
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
  );
};

export default RecentVitals;
