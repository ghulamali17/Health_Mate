import React from "react";
import {
  Activity,
  Heart,
  Droplet,
  Weight,
  Thermometer,
  Leaf,
} from "lucide-react";

const HealthTips = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12 px-6">
      {/* Header */}
      <div className="max-w-4xl mx-auto text-center mb-10">
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
            <Leaf className="w-7 h-7 text-white" />
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          💡 Daily <span className="text-green-600">Health Tips</span>
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Small, consistent habits can make a big difference in your health.
          Let’s explore how monitoring vitals and making mindful lifestyle
          choices can keep you energized and strong every day.
        </p>
      </div>

      {/* Tips Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {[
          {
            icon: <Heart className="w-6 h-6 text-red-500" />,
            title: "Keep an Eye on Your Heart",
            desc: "Measure your blood pressure regularly. A consistent routine helps detect early changes and prevents long-term risks.",
          },
          {
            icon: <Droplet className="w-6 h-6 text-blue-500" />,
            title: "Monitor Blood Sugar",
            desc: "Track fasting and post-meal sugar levels. Maintaining stable glucose helps you stay active and prevents fatigue.",
          },
          {
            icon: <Weight className="w-6 h-6 text-purple-500" />,
            title: "Maintain a Healthy Weight",
            desc: "Weigh yourself weekly. Sudden changes in weight can signal underlying issues or lifestyle imbalance.",
          },
          {
            icon: <Thermometer className="w-6 h-6 text-orange-500" />,
            title: "Track Body Temperature",
            desc: "A slight fever or dip in temperature can indicate infections or health stress. Record your readings for accuracy.",
          },
          {
            icon: <Activity className="w-6 h-6 text-emerald-600" />,
            title: "Stay Physically Active",
            desc: "A brisk walk, stretching, or 30 minutes of daily activity boosts your circulation and mental wellbeing.",
          },
          {
            icon: <Leaf className="w-6 h-6 text-green-500" />,
            title: "Hydrate and Rest",
            desc: "Drink enough water, sleep 7–8 hours, and take mental breaks. Balance is the secret to long-term vitality.",
          },
        ].map((tip, i) => (
          <div
            key={i}
            className="bg-white border border-green-100 rounded-xl p-5 text-left shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-50 rounded-lg">{tip.icon}</div>
              <h3 className="font-semibold text-gray-900">{tip.title}</h3>
            </div>
            <p className="text-sm text-gray-600">{tip.desc}</p>
          </div>
        ))}
      </div>

      {/* Bottom Quote */}
      <div className="max-w-3xl mx-auto text-center mt-16 bg-gradient-to-r from-green-500 to-emerald-600 p-8 rounded-2xl shadow-lg text-white">
        <p className="text-lg font-semibold mb-2">
          “Your body keeps the score — listen to it daily.”
        </p>
        <p className="text-green-50 text-sm">
          Monitoring your vitals regularly helps you catch early signs of
          imbalance and maintain a healthy, active life. Aaj se apni sehat ka
          dhyaan rakhein! 🌿
        </p>
      </div>

      {/* Footer */}
      <div className="text-center mt-10 text-gray-500 text-sm">
        <p>
          © {new Date().getFullYear()} healthlens — Healthy habits start here.
        </p>
      </div>
    </div>
  );
};

export default HealthTips;
