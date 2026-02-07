import React from "react";
import {
  Activity,
  Heart,
  Droplet,
  Weight,
  Brain,
  Users,
  Sparkles,
  Shield,
  Rocket,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/ui/Navbar";

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 py-16 mt-8">
        {/* Intro Section */}
        <div className="flex flex-col items-center text-center mb-24">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold uppercase tracking-widest mb-8 border border-emerald-100">
            <Rocket className="w-3.5 h-3.5" />
            Our Vision
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-6">
            Making Health Tech{" "}
            <span className="text-primary">Accessible for Everyone</span>
          </h1>

          <p className="text-slate-500 font-medium max-w-3xl leading-relaxed text-lg">
            HealthLens is an AI-powered health platform that helps you track
            your vitals, understand medical reports, and manage your health with
            ease and privacy.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24 transition-all duration-500">
          {[
            {
              icon: Heart,
              title: "Track Vitals",
              desc: "Easily log and track your blood pressure, sugar levels, heart rate, and more in one centralized place.",
              color: "text-rose-500",
              bgColor: "bg-rose-50",
            },
            {
              icon: Brain,
              title: "AI Analysis",
              desc: "Our AI processes your health history to give you clear, easy-to-understand insights about your well-being.",
              color: "text-primary",
              bgColor: "bg-blue-50",
            },
            {
              icon: Droplet,
              title: "Report Summary",
              desc: "Upload any medical report and get a simple AI-powered summary instantly, removing complex medical jargon.",
              color: "text-sky-500",
              bgColor: "bg-sky-50",
            },
            {
              icon: Sparkles,
              title: "AI Assistant",
              desc: "Get answers to your health questions 24/7 with our intelligent and personalized AI health assistant.",
              color: "text-violet-500",
              bgColor: "bg-violet-50",
            },
            {
              icon: Shield,
              title: "Secure & Private",
              desc: "Your data is protected with industry-standard encryption, ensuring it stays private and under your control.",
              color: "text-emerald-500",
              bgColor: "bg-emerald-50",
            },
            {
              icon: Activity,
              title: "Health Tips",
              desc: "Get personalized tips and advice to help you build healthy habits and stay well for the long term.",
              color: "text-slate-600",
              bgColor: "bg-slate-50",
            },
          ].map((f, i) => (
            <div
              key={i}
              className="group bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-500"
            >
              <div
                className={`w-14 h-14 ${f.bgColor} ${f.color} rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-all`}
              >
                <f.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4 tracking-tight">
                {f.title}
              </h3>
              <p className="text-slate-500 font-medium leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Mission Statement */}
        <div className="relative bg-slate-900 rounded-[3rem] p-12 md:p-20 text-white shadow-xl overflow-hidden group">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -mr-48 -mt-48"></div>

          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-primary/20 border border-white/10 rounded-[2rem] flex items-center justify-center mb-10">
              <Shield className="w-10 h-10 text-primary" />
            </div>

            <h2 className="text-3xl md:text-4xl font-bold mb-8 tracking-tight">
              Our Mission
            </h2>

            <p className="text-slate-300 text-lg md:text-xl leading-relaxed max-w-3xl mb-12 font-medium">
              "We believe that understanding your health is the first step to a
              better life. Our goal is to make health management simple, smart,
              and accessible to everyone, everywhere."
            </p>

            <button
              onClick={() => navigate("/dashboard")}
              className="px-10 py-5 bg-white text-slate-900 rounded-2xl font-bold text-sm hover:bg-slate-50 transition-all active:scale-95 shadow-lg"
            >
              Get Started Today
            </button>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-24 pt-12 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-6">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              HealthLens v2.0
            </span>
            <div className="w-1 h-1 bg-slate-200 rounded-full"></div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Secure & Private
            </span>
          </div>

          <div className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
            Built for your health and privacy
          </div>
        </div>
      </main>
    </div>
  );
};

export default About;
