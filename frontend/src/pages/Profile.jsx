import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../config/api";
import { useAuth } from "../context/authContext";
import Header from "../components/ui/Header";
import {
  Loader2,
  User,
  Mail,
  Calendar,
  Shield,
  Activity,
  FileText,
  ArrowLeft,
  TrendingUp,
  Award,
} from "lucide-react";

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("pos-token");
        if (!token) {
          navigate("/login");
          return;
        }
        const response = await api.get("/api/users/current");
        setUser(response.data);
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
        if (err.response?.status === 401) navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, [navigate]);

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
        <Header />
        <div className="flex flex-col justify-center items-center py-32 gap-4">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
            Loading Profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900">
      <Header />
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Identity Card */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm relative overflow-hidden">
              <div className="w-24 h-24 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white text-3xl font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-xl font-bold text-slate-900 text-center tracking-tight mb-1">
                {user?.name}
              </h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center mb-6">
                Verified Member
              </p>

              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    Status
                  </span>
                  <span className="text-[10px] font-bold text-emerald-500 uppercase">
                    Active
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    Tier
                  </span>
                  <span className="text-[10px] font-bold text-primary uppercase">
                    Premium
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-lg shadow-slate-900/10">
              <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6">
                Activity Scan
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    label: "Reports",
                    value: "08",
                    icon: FileText,
                    color: "text-primary",
                  },
                  {
                    label: "Vitals",
                    value: "42",
                    icon: Activity,
                    color: "text-emerald-500",
                  },
                  {
                    label: "Stability",
                    value: "98%",
                    icon: TrendingUp,
                    color: "text-sky-400",
                  },
                  {
                    label: "Wellness",
                    value: "84",
                    icon: Award,
                    color: "text-amber-400",
                  },
                ].map((stat, i) => (
                  <div key={i} className="space-y-1">
                    <p className="text-xl font-bold">{stat.value}</p>
                    <div className="flex items-center gap-1.5 opacity-50">
                      <stat.icon className={`w-3 h-3 ${stat.color}`} />
                      <span className="text-[8px] font-bold uppercase tracking-widest">
                        {stat.label}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white border border-slate-100 rounded-3xl p-8 lg:p-10 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-8 tracking-tight">
                Account Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">
                    Full Name
                  </label>
                  <div className="p-4 bg-slate-50 border border-slate-50 rounded-xl font-bold text-slate-700">
                    {user?.name}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">
                    Email Address
                  </label>
                  <div className="p-4 bg-slate-50 border border-slate-50 rounded-xl font-bold text-slate-700">
                    {user?.email}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">
                    Member Since
                  </label>
                  <div className="p-4 bg-slate-50 border border-slate-50 rounded-xl font-bold text-slate-700">
                    {user?.createdAt
                      ? formatDate(user.createdAt)
                      : "January 2025"}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">
                    Encryption
                  </label>
                  <div className="p-4 bg-slate-50 border border-slate-50 rounded-xl font-bold text-slate-700 flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5 text-emerald-500" /> AES-256
                    Protected
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-slate-50 grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
                <div className="p-4 bg-primary/5 rounded-2xl flex items-center justify-center gap-3">
                  <Shield className="w-5 h-5 text-primary" />
                  <p className="text-[10px] font-bold text-primary uppercase tracking-widest">
                    End-to-End Private
                  </p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl flex items-center justify-center gap-3">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Your data is yours alone.
                  </p>
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
