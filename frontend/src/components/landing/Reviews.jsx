import React from "react";
import { Star } from "lucide-react";

const Reviews = () => {
  const testimonials = [
    {
      name: "Ahmed Khan",
      role: "User",
      content:
        "HealthLens has made it so easy to keep track of my parents' health. The reports summary is a lifesaver.",
      avatar: "AK",
      rating: 5,
    },
    {
      name: "Dr. Fatima Noor",
      role: "Health Consultant",
      content:
        "A great tool for patients to understand their own medical data. The AI does a fantastic job of simplifying reports.",
      avatar: "FN",
      rating: 5,
    },
    {
      name: "Zainab Ali",
      role: "Premium Member",
      content:
        "I love having one dashboard for my whole family. It's secure, fast, and very easy to use.",
      avatar: "ZA",
      rating: 5,
    },
  ];
  return (
    <section id="testimonials" className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 text-center mb-16">
          Trusted by families
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-white p-10 border border-slate-100 rounded-[2rem] shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-white font-bold">
                  {t.avatar}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{t.name}</h4>
                  <p className="text-[10px] font-bold text-primary uppercase tracking-widest">
                    {t.role}
                  </p>
                </div>
              </div>
              <p className="text-slate-500 font-medium italic mb-6">
                "{t.content}"
              </p>
              <div className="flex gap-1">
                {[...Array(t.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;
