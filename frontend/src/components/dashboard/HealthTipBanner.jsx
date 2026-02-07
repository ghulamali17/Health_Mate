import React from "react";
import { Sparkles } from "lucide-react";

const HealthTipBanner = () => {
  return (
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
            Tracking your vitals regularly helps you stay on top of your health.
            Keep adding your blood pressure and sugar levels to get the best
            insights.
          </p>
        </div>
        <button className="whitespace-nowrap px-6 py-3 bg-cta text-white rounded-lg font-bold text-sm shadow-lg hover:opacity-90 transition-all cursor-pointer">
          View Insights
        </button>
      </div>
    </div>
  );
};

export default HealthTipBanner;
