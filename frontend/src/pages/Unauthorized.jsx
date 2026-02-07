import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock, ShieldAlert, ArrowLeft, Shield } from "lucide-react";
import Navbar from "../components/ui/Navbar";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 flex flex-col">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20 mt-12">
        <div className="relative mb-16">
          <div className="absolute inset-0 bg-primary/10 rounded-full blur-[80px]"></div>
          <div className="relative w-32 h-32 bg-slate-900 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-slate-900/20">
            <Lock className="w-14 h-14 text-white" />
          </div>
          <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center shadow-lg transform -rotate-12">
            <ShieldAlert className="w-6 h-6 text-rose-500" />
          </div>
        </div>

        <div className="text-center space-y-8 max-w-lg">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 border border-emerald-100">
              <Shield className="w-3.5 h-3.5" />
              Access Denied
            </div>

            <h1 className="text-4xl md:text-5xl font-heading font-black text-slate-900 tracking-tight leading-tight">
              Access <span className="text-primary italic">Denied</span>
            </h1>

            <p className="text-slate-500 font-medium text-lg leading-relaxed">
              You don't have permission to access this page. Please log in with
              an authorized account.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <button
              onClick={() => navigate("/")}
              className="w-full sm:w-auto px-10 py-5 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-slate-800 transition-all active:scale-95 shadow-2xl shadow-slate-900/20 flex items-center justify-center gap-3"
            >
              <ArrowLeft className="w-5 h-5 text-primary" />
              Go Home
            </button>

            <button
              onClick={() => navigate("/login")}
              className="w-full sm:w-auto px-10 py-5 bg-white border border-slate-200 text-slate-500 rounded-2xl font-bold text-sm hover:bg-slate-50 transition-all"
            >
              Sign In
            </button>
          </div>
        </div>
      </main>

      <footer className="p-10 border-t border-slate-50 text-center">
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
          © 2025 HealthLens • Your Health, Simplified
        </p>
      </footer>
    </div>
  );
};

export default Unauthorized;
