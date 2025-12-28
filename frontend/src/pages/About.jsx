import React from "react";
import { Activity, Heart, Droplet, Weight, Brain, Users } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12 px-6">
      <div className="max-w-5xl mx-auto text-center mb-12">
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
            <Activity className="w-7 h-7 text-white" />
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          About <span className="text-green-600">HealthLens</span>
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Your personal health companion — designed to help you understand,
          track, and manage your health data with ease. Because taking care of
          yourself should be simple, smart, and stress-free.
        </p>
      </div>

      {/* Features Section */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-16">
        {[
          {
            icon: <Heart className="w-6 h-6 text-red-500" />,
            title: "Track Your Vitals",
            desc: "Record and monitor your daily health metrics — BP, sugar, temperature, heart rate, and more — all in one place.",
          },
          {
            icon: <Droplet className="w-6 h-6 text-blue-500" />,
            title: "Smart Health Insights",
            desc: "AI helps you understand trends in your reports and vitals, providing insights in simple, human-friendly language.",
          },
          {
            icon: <Weight className="w-6 h-6 text-purple-500" />,
            title: "Easy Report Summaries",
            desc: "Upload lab or medical reports, and HealthLens will summarize them — saving time and reducing confusion.",
          },
          {
            icon: <Brain className="w-6 h-6 text-yellow-500" />,
            title: "Ask AI Anything",
            desc: "Get answers to health-related questions using AI-powered chat — your 24/7 smart dost for health queries.",
          },
          {
            icon: <Users className="w-6 h-6 text-green-500" />,
            title: "Personalized Experience",
            desc: "Each account is private, secure, and customized for your health journey, ensuring data safety and control.",
          },
          {
            icon: <Activity className="w-6 h-6 text-emerald-600" />,
            title: "Daily Health Tips",
            desc: "Simple, practical advice to help you build healthier habits and stay motivated every day.",
          },
        ].map((f, i) => (
          <div
            key={i}
            className="bg-white border border-green-100 rounded-xl p-5 text-left shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-50 rounded-lg">{f.icon}</div>
              <h3 className="font-semibold text-gray-900">{f.title}</h3>
            </div>
            <p className="text-sm text-gray-600">{f.desc}</p>
          </div>
        ))}
      </div>

      {/* Mission Section */}
      <div className="max-w-4xl mx-auto bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-8 text-white shadow-lg text-center">
        <h2 className="text-2xl font-bold mb-3">Our Mission 🌿</h2>
        <p className="text-green-50 text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
          HealthLens aims to make health awareness accessible for everyone.
          Whether it’s understanding your reports, keeping track of vitals, or
          simply staying informed — we empower users to take charge of their
          wellbeing with confidence.
        </p>
      </div>

      {/* Footer Note */}
      <div className="text-center mt-12 text-gray-500 text-sm">
        <p>
          © {new Date().getFullYear()} HealthLens. Built with ❤️ for a healthier
          tomorrow.
        </p>
      </div>
    </div>
  );
};

export default About;
