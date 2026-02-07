import Hero from "../components/landing/Hero";
import Stats from "../components/landing/Stats";
import Features from "../components/landing/Features";
import Navbar from "../components/ui/Navbar";
import Footer from "../components/landing/Footer";
import Reviews from "../components/landing/Reviews";
import HowItWorks from "../components/landing/HowItWorks";

const HealthLensLanding = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] font-body text-slate-900 selection:bg-primary/10 selection:text-primary">
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
  );
};

export default HealthLensLanding;
