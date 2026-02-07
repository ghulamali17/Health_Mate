import React from "react";

const Stats = () => {
  return (
    <section className="py-16 border-y border-slate-100 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: "Patients", value: "15k+" },
            { label: "Countries", value: "20+" },
            { label: "Reports Analyzed", value: "50k+" },
            { label: "Success Rate", value: "99%" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <p className="text-3xl font-bold text-slate-900 mb-1">
                {stat.value}
              </p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
