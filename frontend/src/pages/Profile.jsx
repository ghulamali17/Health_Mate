import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../config/api";
import { useAuth } from "../context/authContext";
import Navbar from "../components/ui/Navbar";
import {
  Loader2,
  User,
  Mail,
  Calendar,
  Shield,
  Activity,
  FileText,
  Lock,
  ArrowRight,
  TrendingUp,
  Award,
  Sparkles,
} from "lucide-react";

function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <Navbar />
        <div className="flex flex-col justify-center items-center py-32 gap-4">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
            Syncing Identity...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 selection:bg-primary/10">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 py-16 mt-8">
        {/* Main Profile Card - Matching our Premium Theme */}
        <div className="bg-white border border-slate-200 rounded-[3rem] shadow-xl shadow-slate-200/40 overflow-hidden">
          {/* Cover/Top Section */}
          <div className="h-32 bg-slate-900 relative">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary via-transparent to-transparent"></div>
          </div>

          <div className="px-10 pb-12">
            {/* Identity Header */}
            <div className="relative -mt-12 mb-12 flex flex-col items-center">
              <div className="relative inline-block">
                <div className="w-28 h-28 bg-white p-1.5 rounded-[2rem] shadow-2xl">
                  <div className="w-full h-full bg-slate-900 rounded-[1.8rem] flex items-center justify-center text-white text-4xl font-bold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1 w-9 h-9 bg-emerald-500 border-4 border-white rounded-full flex items-center justify-center shadow-lg">
                  <Shield className="w-4 h-4 text-white" />
                </div>
              </div>

              <div className="mt-6 text-center">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                  {user?.name}
                </h1>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Premium Member
                  </span>
                  <div className="w-1 h-1 bg-slate-200 rounded-full"></div>
                  <span className="text-[10px] font-bold text-primary uppercase tracking-widest">
                    {user?.email}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-4">
              {/* Account Overview */}
              <div className="space-y-10">
                <div className="space-y-6">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <User className="w-3.5 h-3.5" />
                    Account Details
                  </h3>

                  <div className="space-y-4">
                    {[
                      {
                        label: "Status",
                        value: "Active Account",
                        color: "text-emerald-500",
                        bg: "bg-emerald-50",
                      },
                      {
                        label: "Security",
                        value: "AES-256 Protected",
                        color: "text-primary",
                        bg: "bg-blue-50",
                      },
                      {
                        label: "Joined",
                        value: user?.createdAt
                          ? formatDate(user.createdAt)
                          : "January 2025",
                        color: "text-slate-500",
                        bg: "bg-slate-50",
                      },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-50 transition-all hover:bg-white hover:border-slate-200 hover:shadow-sm"
                      >
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          {item.label}
                        </span>
                        <span className={`${item.color} font-bold text-sm`}>
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Activity Snapshot */}
              <div className="space-y-10">
                <div className="space-y-6">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Activity className="w-3.5 h-3.5" />
                    Activity Snapshot
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    {[
                      {
                        label: "Records",
                        value: "12",
                        icon: FileText,
                        color: "text-primary",
                        sub: "Summarized",
                      },
                      {
                        label: "Vitals",
                        value: "58",
                        icon: Activity,
                        color: "text-rose-500",
                        sub: "Monitored",
                      },
                      {
                        label: "Growth",
                        value: "+14%",
                        icon: TrendingUp,
                        color: "text-emerald-500",
                        sub: "Monthly",
                      },
                      {
                        label: "Rank",
                        value: "Elite",
                        icon: Award,
                        color: "text-amber-500",
                        sub: "Premium",
                      },
                    ].map((stat, i) => (
                      <div
                        key={i}
                        className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm hover:border-primary/20 transition-all group"
                      >
                        <div
                          className={`w-10 h-10 ${stat.color} bg-slate-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-inner`}
                        >
                          <stat.icon className="w-5 h-5" />
                        </div>
                        <p className="text-2xl font-bold text-slate-900 leading-none mb-1">
                          {stat.value}
                        </p>
                        <p className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.2em]">
                          {stat.sub}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Privacy Banner */}
                <div className="pt-4">
                  <div className="p-6 bg-emerald-50/50 border border-emerald-100 rounded-[2rem] flex items-center gap-5">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                      <Lock className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        End-to-End Private
                      </p>
                      <p className="text-[10px] font-medium text-slate-500 leading-relaxed max-w-[180px]">
                        Your health data is locked and never shared with third
                        parties.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions Footer - Syncing with overall theme's grid style */}
            <div className="mt-16 pt-10 border-t border-slate-50">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div></div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => navigate("/dashboard")}
                    className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-xs hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-900/10"
                  >
                    View Dashboard
                    <ArrowRight className="w-4 h-4 text-primary" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Profile;
