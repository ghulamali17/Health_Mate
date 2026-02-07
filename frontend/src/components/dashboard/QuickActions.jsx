import React from "react";
import {
  Heart,
  Upload,
  MessageSquare,
  Users,
  Calendar,
  Phone,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const QuickActions = () => {
  const navigate = useNavigate();
  const quickActions = [
    {
      label: "Add Vitals",
      icon: Heart,
      path: "/add-vitals",
      color: "bg-red-500",
      desc: "BP, Sugar, Weight",
    },
    {
      label: "Upload",
      icon: Upload,
      path: "/summarize",
      color: "bg-blue-500",
      desc: "Report discovery",
    },
    {
      label: "Ask AI",
      icon: MessageSquare,
      path: "/chat",
      color: "bg-cta",
      desc: "AI Consultant",
    },
    {
      label: "Family",
      icon: Users,
      path: "/family-members",
      color: "bg-indigo-500",
      desc: "Record sharing",
    },
    {
      label: "Timeline",
      icon: Calendar,
      path: "/timeline",
      color: "bg-primary",
      desc: "Health journey",
    },
    {
      label: "Emergency",
      icon: Phone,
      path: "/emergency-contacts",
      color: "bg-rose-500",
      desc: "Quick help",
    },
  ];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {quickActions.map((action, idx) => (
        <button
          key={idx}
          onClick={() => navigate(action.path)}
          className="group flex flex-col p-4 bg-slate-50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800 hover:border-primary dark:hover:border-primary rounded-xl transition-all cursor-pointer text-left shadow-sm"
        >
          <div
            className={`w-10 h-10 ${action.color} text-white rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-md`}
          >
            <action.icon className="w-5 h-5" />
          </div>
          <p className="font-bold text-slate-900 dark:text-white text-sm mb-1">
            {action.label}
          </p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
            {action.desc}
          </p>
        </button>
      ))}
    </div>
  );
};

export default QuickActions;
