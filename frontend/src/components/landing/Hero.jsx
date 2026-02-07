import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import { toast } from "react-toastify";
import {
  ArrowRight,
  Shield,
  Star,
  Heart,
  Activity,
  Droplet,
  Weight,
  Zap,
  Brain,
} from "lucide-react";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <div>
      <section className="relative pt-40 pb-24 overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] -mr-64 -mt-64"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-slate-100 rounded-full shadow-sm">
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Simple Health Management
                </span>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold text-slate-900 tracking-tight leading-[1.1]">
                Your Health, <span className="text-primary">Simplified.</span>
              </h1>

              <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-lg">
                HealthLens helps you track your vitals, understand medical
                reports, and manage family health in one secure app.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate("/signup")}
                  className="px-10 py-4 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-2 group"
                >
                  Get Started{" "}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <Link
                  to="/about"
                  className="px-10 py-4 bg-white border border-slate-100 text-slate-900 rounded-2xl font-bold hover:bg-slate-50 transition-all flex items-center justify-center shadow-sm"
                >
                  Learn More
                </Link>
              </div>

              <div className="flex gap-8 pt-6">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-slate-300" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Secure Storage
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-primary" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    AI Powered
                  </span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-10 bg-primary/10 rounded-full blur-3xl opacity-30"></div>
              <div className="relative bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-xl">
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-50">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white">
                      <Heart className="w-6 h-6" />
                    </div>
                    <span className="font-bold text-slate-900">
                      Health Overview
                    </span>
                  </div>
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-bold uppercase tracking-widest">
                    Stable
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {[
                    {
                      label: "Blood Pressure",
                      value: "120/80",
                      color: "text-rose-500",
                      icon: Activity,
                    },
                    {
                      label: "Blood Sugar",
                      value: "95",
                      color: "text-primary",
                      icon: Droplet,
                    },
                    {
                      label: "Weight",
                      value: "72 kg",
                      color: "text-violet-500",
                      icon: Weight,
                    },
                    {
                      label: "Heart Rate",
                      value: "72 bpm",
                      color: "text-orange-500",
                      icon: Zap,
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="bg-slate-50 p-6 rounded-2xl border border-slate-50 hover:border-primary/10 transition-all"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <item.icon className={`w-4 h-4 ${item.color}`} />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          {item.label}
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-slate-900">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 p-4 bg-slate-900 rounded-2xl flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                    <Brain className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-xs text-slate-300 font-medium">
                    All vitals are within normal range. Good job!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;
