import Hero from "../components/landing/Hero";
import Stats from "../components/landing/Stats";
import Features from "../components/landing/Features";
import Navbar from "../components/ui/Navbar";
import Footer from "../components/landing/Footer";
import Reviews from "../components/landing/Reviews";
import HowItWorks from "../components/landing/HowItWorks";

const HealthLensLanding = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] font-body text-slate-900 selection:bg-primary/10 selection:text-primary relative">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-0"></div>
      <div className="relative z-10">
        {/* Navbar */}
        <Navbar />

        {/* Hero */}
        <Hero />

        {/* Stats */}
        <Stats />

        {/* Features List */}
        <Features />

        {/* How it works banner */}
        <HowItWorks />

        {/* Reviews */}
        <Reviews />

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default HealthLensLanding;
