import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  Activity,
  Shield,
  Sparkles,
} from "lucide-react";
import Navbar from "../components/ui/Navbar";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 flex flex-col">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20 mt-12">
        <div className="relative mb-16">
          <div className="absolute inset-0 bg-rose-500/10 rounded-full blur-[80px] animate-pulse"></div>
          <div className="relative w-32 h-32 bg-white border border-slate-200 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-slate-900/5 rotate-3 hover:rotate-0 transition-transform duration-500">
            <AlertCircle className="w-16 h-16 text-rose-500" />
          </div>
          <div className="absolute -top-4 -right-4 w-12 h-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center shadow-lg transform rotate-12">
            <span className="text-xl font-black text-slate-900">404</span>
          </div>
        </div>

        <div className="text-center space-y-8 max-w-lg">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
              <Shield className="w-3.5 h-3.5 text-primary" />
              Page Not Found
            </div>

            <h1 className="text-4xl md:text-5xl font-heading font-black text-slate-900 tracking-tight leading-tight">
              Oops! <span className="text-primary italic">Page Not Found</span>
            </h1>

            <p className="text-slate-500 font-medium text-lg leading-relaxed">
              The page you're looking for doesn't exist. It might have been
              moved or deleted.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <button
              onClick={() => navigate("/")}
              className="w-full sm:w-auto px-10 py-5 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-slate-800 transition-all active:scale-95 shadow-2xl shadow-slate-900/20 flex items-center justify-center gap-3"
            >
              <ArrowLeft className="w-5 h-5 text-primary" />
              Go Back Home
            </button>

            <Link
              to="/health-tips"
              className="w-full sm:w-auto px-10 py-5 bg-white border border-slate-200 text-slate-500 rounded-2xl font-bold text-sm hover:bg-slate-50 transition-all text-center"
            >
              Browse Health Tips
            </Link>
          </div>
        </div>

        <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-20 pointer-events-none">
          {[Activity, Shield, Sparkles, Activity].map((Icon, i) => (
            <div key={i} className="flex flex-col items-center gap-3">
              <Icon className="w-8 h-8 text-slate-400" />
              <div className="h-1 w-12 bg-slate-200 rounded-full"></div>
            </div>
          ))}
        </div>
      </main>

      <footer className="p-10 border-t border-slate-50 text-center">
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
          © 2025 HealthLens • Your Health, Simplified
        </p>
      </footer>
    </div>
  );
}

export default NotFound;
