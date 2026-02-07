import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import { toast } from "react-toastify";
import {
  ArrowRight,
  Shield,
  CheckCircle2,
  TrendingUp,
  Users,
  FileText,
  Activity,
  Calendar,
  Clock,
} from "lucide-react";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <div className="relative">
      {/* Subtle grid pattern instead of gradient blob */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          {/* Asymmetric Layout */}
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            {/* Left Column - 7 cols */}
            <div className="lg:col-span-7 space-y-10 pt-8">
              {/* Trust Badge */}
              <div className="flex items-center gap-6">
                <div className="flex -space-x-3">
                  <img
                    src="https://randomuser.me/api/portraits/women/44.jpg"
                    alt="User"
                    className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                  />
                  <img
                    src="https://randomuser.me/api/portraits/men/32.jpg"
                    alt="User"
                    className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                  />
                  <img
                    src="https://randomuser.me/api/portraits/women/68.jpg"
                    alt="User"
                    className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                  />
                  <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-slate-600 text-xs font-bold">
                    +2K
                  </div>
                </div>
                <div className="text-sm">
                  <p className="font-bold text-slate-900">
                    Trusted by 2,000+ families
                  </p>
                  <p className="text-slate-500 text-xs">
                    Managing health together
                  </p>
                </div>
              </div>

              {/* Main Headline - More editorial, less marketing */}
              <div className="space-y-6">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 tracking-tight leading-[1.05]">
                  Track health.{" "}
                  <span className="block mt-2 text-slate-400">
                    Understand reports.
                  </span>{" "}
                  <span className="block mt-2">
                    <span className="relative">
                      Stay informed.
                      <svg
                        className="absolute -bottom-2 left-0 w-full"
                        height="12"
                        viewBox="0 0 300 12"
                        fill="none"
                      >
                        <path
                          d="M2 10C52 4 252 4 298 10"
                          stroke="#10B981"
                          strokeWidth="3"
                          strokeLinecap="round"
                        />
                      </svg>
                    </span>
                  </span>
                </h1>

                <p className="text-lg text-slate-600 leading-relaxed max-w-xl font-normal">
                  A straightforward platform for tracking vital signs, storing
                  medical documents, and keeping your family's health
                  information organized in one secure place.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate("/signup")}
                  className="px-8 py-4 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 group shadow-lg shadow-slate-900/10"
                >
                  Start tracking for free
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <Link
                  to="/about"
                  className="px-8 py-4 bg-white border-2 border-slate-200 text-slate-900 rounded-xl font-semibold hover:border-slate-300 transition-all flex items-center justify-center"
                >
                  How it works
                </Link>
              </div>

              {/* Features list - More specific, less generic */}
              <div className="grid grid-cols-2 gap-4 pt-4">
                {[
                  { text: "Blood pressure & vitals tracking", icon: Activity },
                  { text: "AI report summaries", icon: FileText },
                  { text: "Family health profiles", icon: Users },
                  { text: "Timeline visualization", icon: TrendingUp },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-600 font-medium">
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - 5 cols - Realistic health data cards */}
            <div className="lg:col-span-5 space-y-4">
              {/* Recent Vital Card */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                    <span className="text-sm font-semibold text-slate-900">
                      Latest Reading
                    </span>
                  </div>
                  <span className="text-xs text-slate-500">2 mins ago</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-slate-500 font-medium">
                      Blood Pressure
                    </p>
                    <p className="text-2xl font-bold text-slate-900">
                      118<span className="text-lg text-slate-400">/76</span>
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-slate-500 font-medium">
                      Heart Rate
                    </p>
                    <p className="text-2xl font-bold text-slate-900">
                      68<span className="text-sm text-slate-400"> bpm</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Weekly Summary */}
              <div className="bg-gradient-to-br from-primary to-emerald-500 rounded-2xl p-6 text-white">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <p className="text-sm opacity-90 mb-1">This Week</p>
                    <p className="text-3xl font-bold">5 Records</p>
                  </div>
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div className="bg-white rounded-full h-2 w-3/4"></div>
                  </div>
                  <span className="text-xs opacity-90 whitespace-nowrap">
                    75% complete
                  </span>
                </div>
              </div>

              {/* Family Member Quick Card */}
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <Users className="w-4 h-4 text-slate-400" />
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Family Circle
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    <img
                      src="https://randomuser.me/api/portraits/women/65.jpg"
                      alt="Family member"
                      className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                    />
                    <img
                      src="https://randomuser.me/api/portraits/men/86.jpg"
                      alt="Family member"
                      className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                    />
                    <img
                      src="https://randomuser.me/api/portraits/women/12.jpg"
                      alt="Family member"
                      className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                    />
                  </div>
                  <span className="text-sm text-slate-600 font-medium">
                    3 members tracked
                  </span>
                </div>
              </div>

              {/* Security Badge */}
              <div className="flex items-center gap-3 px-4 py-3 bg-slate-900 rounded-xl">
                <Shield className="w-5 h-5 text-emerald-400" />
                <div className="flex-1">
                  <p className="text-xs font-semibold text-white">
                    End-to-end encrypted
                  </p>
                  <p className="text-xs text-slate-400">
                    Your data stays private
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
