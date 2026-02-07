import React from "react";
import { Activity } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-100 py-20">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12">
        <div className="col-span-2 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg">
              <Activity className="w-5 h-5" />
            </div>
            <span className="text-2xl font-bold text-slate-900">
              HealthLens
            </span>
          </div>
          <p className="text-slate-500 font-medium max-w-xs">
            Connecting people with their health data through simple and secure
            AI.
          </p>
        </div>

        <div className="space-y-6">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest">
            Company
          </h4>
          <ul className="space-y-4 text-sm font-bold text-slate-400">
            <li className="hover:text-primary cursor-pointer">About Us</li>
            <li className="hover:text-primary cursor-pointer">Features</li>
            <li className="hover:text-primary cursor-pointer">Security</li>
          </ul>
        </div>

        <div className="space-y-6">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest">
            Privacy
          </h4>
          <ul className="space-y-4 text-sm font-bold text-slate-400">
            <li className="hover:text-primary cursor-pointer">Terms</li>
            <li className="hover:text-primary cursor-pointer">
              Privacy Policy
            </li>
            <li className="hover:text-primary cursor-pointer">Compliance</li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-12 mt-12 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          © 2026 HealthLens. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
