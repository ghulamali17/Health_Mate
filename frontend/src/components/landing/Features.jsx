import React from "react";
import {
  Activity,
  FileText,
  Users,
  MessageSquare,
  Shield,
  Sparkles,
} from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: <Activity className="w-6 h-6" />,
      title: "Vitals Tracking",
      description:
        "Keep track of blood pressure, sugar levels, and heart rate with easy-to-read charts.",
      color: "text-rose-500",
      bgColor: "bg-rose-50",
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Smart Reports",
      description:
        "Upload your medical reports and get simple, clear summaries powered by AI.",
      color: "text-primary",
      bgColor: "bg-blue-50",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Family Care",
      description:
        "Manage health records for your entire family in one secure and private place.",
      color: "text-emerald-500",
      bgColor: "bg-emerald-50",
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "AI Health Chat",
      description:
        "Get instant answers to your health questions from our 24/7 AI health assistant.",
      color: "text-sky-500",
      bgColor: "bg-sky-50",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure & Private",
      description:
        "Your health data is encrypted and kept private. You always have full control.",
      color: "text-indigo-500",
      bgColor: "bg-indigo-50",
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "Health Insights",
      description:
        "Receive personalized health tips based on your data to help you stay healthy.",
      color: "text-amber-500",
      bgColor: "bg-amber-50",
    },
  ];
  return (
    <section id="features" className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900">
            Features built for you
          </h2>
          <p className="text-lg text-slate-500 font-medium">
            Everything you need to manage your health in one simple app.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <div
              key={i}
              className="group bg-white p-10 border border-slate-100 rounded-[2rem] hover:shadow-lg hover:border-primary/10 transition-all duration-300"
            >
              <div
                className={`w-12 h-12 ${feature.bgColor} ${feature.color} rounded-xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-all`}
              >
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-slate-500 font-medium leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
