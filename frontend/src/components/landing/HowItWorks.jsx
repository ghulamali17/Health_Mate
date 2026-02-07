import React from "react";

const HowItWorks = () => {
  return (
    <section
      id="how-it-works"
      className="py-24 bg-slate-900 overflow-hidden relative"
    >
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -mr-48 -mt-48"></div>
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center space-y-12">
        <div className="space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold text-white">
            Understand your reports
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl">
            Our AI engine explains complex medical reports in simple language.
          </p>
        </div>
        <button
          onClick={() => navigate("/summarize")}
          className="px-10 py-4 bg-white text-slate-900 rounded-xl font-bold hover:bg-slate-50 transition-all"
        >
          Try it Now
        </button>

        <div className="w-full max-w-3xl bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
          <div className="space-y-6 text-left">
            {[
              {
                title: "Summary",
                content:
                  "Your blood work looks great. All indicators are stable.",
                color: "border-primary",
              },
              {
                title: "Tip",
                content: "Consider drinking more water and stay active daily.",
                color: "border-emerald-500",
              },
            ].map((item, i) => (
              <div
                key={i}
                className={`p-6 bg-white/5 border-l-4 ${item.color} rounded-xl`}
              >
                <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-2">
                  {item.title}
                </p>
                <p className="text-sm text-slate-300 font-medium">
                  {item.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
