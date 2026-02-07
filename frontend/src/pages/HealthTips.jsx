import React from "react";
import {
  Activity,
  Heart,
  Droplet,
  Weight,
  Thermometer,
  Leaf,
  Sparkles,
  Shield,
  Clock,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/ui/Navbar";

const HealthTips = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 py-16">
        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold uppercase tracking-widest mb-8 border border-emerald-100">
            <Sparkles className="w-3.5 h-3.5" />
            Health Tips
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-6">
            Live <span className="text-primary">Healthy</span>
          </h1>

          <p className="text-slate-500 font-medium max-w-2xl leading-relaxed text-lg">
            Small changes in your daily routine can lead to big improvements in
            your health and energy levels over time.
          </p>
        </div>

        {/* Tips Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {[
            {
              icon: Heart,
              title: "Heart Health",
              desc: "Regularly checking your blood pressure helps you stay aware of your heart health and reduces stress on your body.",
              color: "text-rose-500",
              bgColor: "bg-rose-50",
            },
            {
              icon: Droplet,
              title: "Blood Sugar",
              desc: "Tracking your sugar levels helps keep your energy steady and prevents long-term health issues.",
              color: "text-sky-500",
              bgColor: "bg-sky-50",
            },
            {
              icon: Weight,
              title: "Weight Care",
              desc: "Keeping an eye on your weight is a good way to see how your body is responding to your diet and activity.",
              color: "text-violet-500",
              bgColor: "bg-violet-50",
            },
            {
              icon: Thermometer,
              title: "Temperature",
              desc: "Tracking your temperature can help you spot early signs of illness or stress in your body.",
              color: "text-amber-500",
              bgColor: "bg-amber-50",
            },
            {
              icon: Activity,
              title: "Stay Active",
              desc: "Regular exercise improves your blood flow and helps your brain stay sharp and focused.",
              color: "text-emerald-500",
              bgColor: "bg-emerald-50",
            },
            {
              icon: Shield,
              title: "Rest & Hydrate",
              desc: "Getting enough sleep and staying hydrated are essential for your body to repair itself and stay energized.",
              color: "text-primary",
              bgColor: "bg-blue-50",
            },
          ].map((tip, i) => (
            <div
              key={i}
              className="group bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-500"
            >
              <div
                className={`w-14 h-14 ${tip.bgColor} ${tip.color} rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-all`}
              >
                <tip.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4 tracking-tight">
                {tip.title}
              </h3>
              <p className="text-slate-500 font-medium leading-relaxed">
                {tip.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Vision Banner */}
        <div className="relative bg-slate-900 rounded-[3rem] p-12 md:p-16 text-white shadow-xl overflow-hidden group">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -mr-48 -mt-48"></div>

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
            <div className="w-24 h-24 bg-primary/20 backdrop-blur-xl border border-white/10 rounded-[2rem] flex items-center justify-center flex-shrink-0">
              <Activity className="w-10 h-10 text-primary" />
            </div>

            <div className="flex-1 text-center md:text-left">
              <p className="text-2xl md:text-3xl font-medium leading-tight mb-6 italic text-slate-100">
                "Your body stays healthy when you pay attention to it and make
                conscious, small improvements."
              </p>
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    AI Insights Enabled
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Real-time Data
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate("/dashboard")}
              className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-bold text-sm hover:bg-slate-50 transition-all active:scale-95 shadow-lg"
            >
              Back Home
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-20 pt-10 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-8 text-slate-400">
          <div className="flex items-center gap-6">
            <span className="text-[10px] font-bold uppercase tracking-widest">
              © 2025 HealthLens
            </span>
            <div className="w-1 h-1 bg-slate-200 rounded-full"></div>
            <span className="text-[10px] font-bold uppercase tracking-widest">
              Personal Health Tips
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">
              Updated Daily
            </span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HealthTips;
