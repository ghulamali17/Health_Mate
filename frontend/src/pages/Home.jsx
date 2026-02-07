import { useState, useRef, useEffect } from "react";
import {
  Heart,
  Activity,
  Users,
  Shield,
  Star,
  ArrowRight,
  Check,
  FileText,
  Droplet,
  Weight,
  Thermometer,
  Sparkles,
  MessageSquare,
  Upload,
  Brain,
  Zap,
  LogOut,
  ChevronRight,
  LayoutDashboard,
  User,
  Globe,
  Database,
  Search,
  Home,
} from "lucide-react";
import useClickOutside from "../hooks/useClickOutside";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { toast } from "react-toastify";

const HealthLensLanding = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { user, logout } = useAuth();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useClickOutside(dropdownRef, () => {
    setIsDropdownOpen(false);
  });

  const handleLogout = () => {
    logout();
    localStorage.removeItem("pos-token");
    setIsDropdownOpen(false);
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsDropdownOpen(false);
  };

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
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 selection:bg-primary/10 selection:text-primary">
      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white border-b border-slate-100 py-4 shadow-sm"
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => navigate("/")}
          >
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">
              HealthLens
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-sm font-bold text-slate-400 hover:text-primary transition-all"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-sm font-bold text-slate-400 hover:text-primary transition-all"
            >
              How it Works
            </a>
            <a
              href="#testimonials"
              className="text-sm font-bold text-slate-400 hover:text-primary transition-all"
            >
              Reviews
            </a>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <div ref={dropdownRef} className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-1.5 sm:gap-3 pl-1.5 pr-1.5 sm:pr-4 py-1.5 bg-white border border-slate-200/60 rounded-2xl hover:border-primary/40 hover:shadow-lg hover:shadow-slate-200/20 transition-all duration-300 group min-w-0 sm:min-w-[125px]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-900 rounded-[12px] flex items-center justify-center font-bold text-white text-[11px] shadow-sm ring-4 ring-transparent group-hover:ring-primary/5 transition-all duration-500 flex-shrink-0">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden sm:block text-[13px] font-bold text-slate-800 tracking-tight group-hover:text-primary transition-colors truncate max-w-[80px]">
                      {user?.name?.split(" ")[0]}
                    </span>
                  </div>
                  <div className="hidden sm:flex flex-1 justify-end ml-1">
                    <ChevronRight
                      className={`w-3.5 h-3.5 text-slate-300 group-hover:text-primary transition-all duration-300 ${isDropdownOpen ? "rotate-90" : ""}`}
                    />
                  </div>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-4 w-60 bg-white rounded-[2rem] shadow-2xl shadow-slate-200/50 border border-slate-100 p-2.5 z-50 animate-fadeIn origin-top-right">
                    <div className="px-5 py-4 mb-2 bg-slate-50/50 rounded-[1.5rem] border border-slate-50">
                      <p className="text-[13px] font-bold text-slate-900 truncate">
                        {user?.name}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <div className="w-1 h-1 bg-primary rounded-full animate-pulse"></div>
                        <p className="text-[9px] font-bold text-primary uppercase tracking-widest">
                          Premium Access
                        </p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <button
                        onClick={() => handleNavigation("/")}
                        className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-slate-500 hover:bg-white hover:text-primary hover:shadow-sm rounded-xl transition-all border border-transparent hover:border-slate-100"
                      >
                        <Home className="w-4 h-4 opacity-50" /> Home
                      </button>
                      <button
                        onClick={() => handleNavigation("/dashboard")}
                        className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-slate-500 hover:bg-white hover:text-primary hover:shadow-sm rounded-xl transition-all border border-transparent hover:border-slate-100"
                      >
                        <LayoutDashboard className="w-4 h-4 opacity-50" />{" "}
                        Dashboard
                      </button>
                      <button
                        onClick={() => handleNavigation("/profile")}
                        className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-slate-500 hover:bg-white hover:text-primary hover:shadow-sm rounded-xl transition-all border border-transparent hover:border-slate-100"
                      >
                        <User className="w-4 h-4 opacity-50" /> My Profile
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-rose-500 hover:bg-rose-50 rounded-xl transition-all mt-1"
                      >
                        <LogOut className="w-4 h-4 opacity-70" /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate("/login")}
                  className="text-sm font-bold text-slate-400 hover:text-primary transition-all"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate("/signup")}
                  className="bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95"
                >
                  Start for Free
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-40 pb-24 overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] -mr-64 -mt-64"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-slate-100 rounded-full shadow-sm">
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Simple Health Management
                </span>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold text-slate-900 tracking-tight leading-[1.1]">
                Your Health, <span className="text-primary">Simplified.</span>
              </h1>

              <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-lg">
                HealthLens helps you track your vitals, understand medical
                reports, and manage family health in one secure app.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate("/signup")}
                  className="px-10 py-4 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-2 group"
                >
                  Get Started{" "}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <Link
                  to="/about"
                  className="px-10 py-4 bg-white border border-slate-100 text-slate-900 rounded-2xl font-bold hover:bg-slate-50 transition-all flex items-center justify-center shadow-sm"
                >
                  Learn More
                </Link>
              </div>

              <div className="flex gap-8 pt-6">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-slate-300" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Secure Storage
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-primary" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    AI Powered
                  </span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-10 bg-primary/10 rounded-full blur-3xl opacity-30"></div>
              <div className="relative bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-xl">
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-50">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white">
                      <Heart className="w-6 h-6" />
                    </div>
                    <span className="font-bold text-slate-900">
                      Health Overview
                    </span>
                  </div>
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-bold uppercase tracking-widest">
                    Stable
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {[
                    {
                      label: "Blood Pressure",
                      value: "120/80",
                      color: "text-rose-500",
                      icon: Activity,
                    },
                    {
                      label: "Blood Sugar",
                      value: "95",
                      color: "text-primary",
                      icon: Droplet,
                    },
                    {
                      label: "Weight",
                      value: "72 kg",
                      color: "text-violet-500",
                      icon: Weight,
                    },
                    {
                      label: "Heart Rate",
                      value: "72 bpm",
                      color: "text-orange-500",
                      icon: Zap,
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="bg-slate-50 p-6 rounded-2xl border border-slate-50 hover:border-primary/10 transition-all"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <item.icon className={`w-4 h-4 ${item.color}`} />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          {item.label}
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-slate-900">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 p-4 bg-slate-900 rounded-2xl flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                    <Brain className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-xs text-slate-300 font-medium">
                    All vitals are within normal range. Good job!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 border-y border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Patients", value: "15k+" },
              { label: "Countries", value: "20+" },
              { label: "Reports Analyzed", value: "50k+" },
              { label: "Success Rate", value: "99%" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl font-bold text-slate-900 mb-1">
                  {stat.value}
                </p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features List */}
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

      {/* How it works banner */}
      <section
        id="how-it-works"
        className="py-24 bg-slate-900 overflow-hidden relative"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -mr-48 -mt-48"></div>
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center space-y-12">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold text-white">
              Understand your reports
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl">
              Our AI engine explains complex medical reports in simple language.
            </p>
          </div>
          <button
            onClick={() => navigate("/summarize")}
            className="px-10 py-4 bg-white text-slate-900 rounded-xl font-bold hover:bg-slate-50 transition-all"
          >
            Try it Now
          </button>

          <div className="w-full max-w-3xl bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
            <div className="space-y-6 text-left">
              {[
                {
                  title: "Summary",
                  content:
                    "Your blood work looks great. All indicators are stable.",
                  color: "border-primary",
                },
                {
                  title: "Tip",
                  content:
                    "Consider drinking more water and stay active daily.",
                  color: "border-emerald-500",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className={`p-6 bg-white/5 border-l-4 ${item.color} rounded-xl`}
                >
                  <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-2">
                    {item.title}
                  </p>
                  <p className="text-sm text-slate-300 font-medium">
                    {item.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
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

      {/* Footer */}
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
            © 2025 HealthLens. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                System Online
              </span>
            </div>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
              Secure AES-256
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HealthLensLanding;
