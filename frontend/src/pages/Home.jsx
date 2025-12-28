import { useState, useRef } from "react";
import {
  Heart,
  Activity,
  Users,
  Shield,
  Star,
  ArrowRight,
  Check,
  Smartphone,
  BarChart3,
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
  Bell,
  ChevronRight,
  LayoutDashboard,
  User,
  TrendingUp,
  HomeIcon,
} from "lucide-react";
import useClickOutside from "../hooks/useClickOutside";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
const healthlensLanding = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loadingUser, setLoadingUser] = useState(false);

  const { user, logout } = useAuth();

  const dropdownRef = useRef(null);

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
      title: "Smart Vitals Tracking",
      description:
        "Monitor BP, sugar, weight, temperature, and heart rate with AI-powered insights and trend analysis.",
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: "AI Report Analysis",
      description:
        "Upload medical reports and get instant AI summaries in English + Roman Urdu with actionable advice.",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Family Health Hub",
      description:
        "Track health records for your entire family - parents, children, and relatives in one place.",
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Health AI Assistant",
      description:
        "Ask health questions anytime and get personalized guidance from our intelligent chatbot.",
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Visual Analytics",
      description:
        "Beautiful charts and graphs show your health trends over time with predictive insights.",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure & Private",
      description:
        "Your health data is encrypted and protected with enterprise-grade security measures.",
    },
  ];

  const quickActions = [
    {
      icon: <Activity className="w-6 h-6" />,
      title: "Add Vitals",
      description: "Quick BP, Sugar check",
      gradient: "from-green-500 to-emerald-600",
      emoji: "💚",
    },
    {
      icon: <Upload className="w-6 h-6" />,
      title: "Upload Report",
      description: "AI will analyze it",
      gradient: "from-green-600 to-teal-600",
      emoji: "📄",
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Ask AI",
      description: "Health ka sawal?",
      gradient: "from-emerald-500 to-green-500",
      emoji: "🤖",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Family",
      description: "Manage family health",
      gradient: "from-teal-500 to-green-600",
      emoji: "👨‍👩‍👧‍👦",
    },
  ];

  const testimonials = [
    {
      name: "Ahmed Khan",
      role: "Managing Father's Diabetes",
      content:
        "healthlens ne meri zindagi asaan kar di! Ab mai apne father ki sugar levels track kar sakta hun aur AI mujhe batata hai ke kya khana chahiye.",
      avatar: "👨‍💼",
      rating: 5,
    },
    {
      name: "Dr. Fatima Noor",
      role: "Family Physician",
      content:
        "I recommend healthlens to all my patients. The AI report summaries help them understand their results before our consultation.",
      avatar: "👩‍⚕️",
      rating: 5,
    },
    {
      name: "Zainab Ali",
      role: "Mother of Three",
      content:
        "Vaccination records, growth tracking, sab kuch ek jagah! Ab mai apne bacchon ki health easily manage kar sakti hun.",
      avatar: "👩‍👧‍👦",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-lg border-b border-green-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                💚 HealthLens
              </span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <a
                href="#features"
                className="text-gray-700 hover:text-green-600 transition-colors font-medium"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-gray-700 hover:text-green-600 transition-colors font-medium"
              >
                How It Works
              </a>
              <a
                href="#testimonials"
                className="text-gray-700 hover:text-green-600 transition-colors font-medium"
              >
                Stories
              </a>
            </div>

            <div className="flex items-center gap-3">
              {user && (
                <button className="relative p-2.5 bg-green-500/10 hover:bg-green-500/20 backdrop-blur-sm rounded-xl transition-all">
                  <Bell className="w-5 h-5 text-green-600" />
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    3
                  </span>
                </button>
              )}

              {user ? (
                <div ref={dropdownRef} className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-3 px-2 md:px-4 py-2.5 bg-green-500/10 hover:bg-green-500/20 backdrop-blur-sm rounded-xl transition-all"
                  >
                    {loadingUser ? (
                      <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    ) : (
                      <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center font-bold text-white text-sm">
                        {user?.name?.charAt(0).toUpperCase() || "U"}
                      </div>
                    )}
                    <span className="text-sm font-semibold text-green-700 hidden md:block">
                      {loadingUser ? "Loading..." : user?.name || "Guest"}
                    </span>
                    <ChevronRight
                      className={`w-4 h-4 text-green-600 transition-transform ${
                        isDropdownOpen ? "rotate-90" : ""
                      }`}
                    />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 top-14 w-56 bg-white rounded-2xl shadow-2xl border border-green-100 overflow-hidden z-50 animate-fadeIn">
                      <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-b border-green-100">
                        <p className="text-sm font-semibold text-gray-900">
                          {user?.name || "Guest User"}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {user?.email || "Premium Member"}
                        </p>
                      </div>
                      <button
                        onClick={() => handleNavigation("/dashboard")}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-green-50 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-green-600" />
                        Dashboard
                      </button>
                      <button
                        onClick={() => handleNavigation("/profile")}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-green-50 transition-colors"
                      >
                        <User className="w-4 h-4 text-green-600" />
                        Profile Settings
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => navigate("/login")}
                    className="px-4 cursor-pointer py-2.5 text-green-700 hover:text-green-800 font-medium transition-colors"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => navigate("/signup")}
                    className="px-6 cursor-pointer py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold"
                  >
                    Get Started
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(34,197,94,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(16,185,129,0.1),transparent_50%)]"></div>

        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold shadow-sm">
                <Sparkles className="w-4 h-4" />
                AI-Powered Health Companion
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Sehat Ka Smart
                <span className="block bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  Dost 💚
                </span>
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed">
                Upload medical reports, track vitals, and get instant AI
                analysis in English + Roman Urdu. Your family's health,
                simplified and secured.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button className="group px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl hover:shadow-2xl hover:scale-105 transition-all font-bold text-lg flex items-center justify-center gap-2">
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="px-8 py-4 bg-white text-gray-700 border-2 border-gray-200 rounded-2xl hover:border-green-500 hover:shadow-lg transition-all font-semibold text-lg flex items-center justify-center gap-2">
                  <Zap className="w-5 h-5 text-green-600" />
                  Watch Demo
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-600" />
                  <span>Free forever plan</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-600" />
                  <span>No credit card</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-600" />
                  <span>2-minute setup</span>
                </div>
              </div>
            </div>

            {/* Hero Dashboard Preview */}
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-3xl blur-2xl opacity-20 animate-pulse"></div>
              <div className="relative bg-white rounded-3xl p-8 shadow-2xl border border-green-100">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">
                      Recent Check-up
                    </h3>
                    <p className="text-sm text-gray-500">
                      Ali Ahmed • Today, 10:30 AM
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-5 border-2 border-green-100 hover:border-green-300 transition-all">
                    <div className="flex items-center gap-2 mb-3">
                      <Activity className="w-5 h-5 text-green-600" />
                      <span className="text-xs md:text-sm font-semibold text-gray-600 uppercase">
                        BP
                      </span>
                    </div>
                    <p className="text-xl md:text-3xl font-bold text-gray-900">
                      120/80
                    </p>
                    <p className="text-xs text-green-600 font-medium mt-1">
                      Normal ✓
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-5 border-2 border-blue-100 hover:border-blue-300 transition-all">
                    <div className="flex items-center gap-2 mb-3">
                      <Droplet className="w-5 h-5 text-blue-600" />
                      <span className="text-xs font-semibold text-gray-600 uppercase">
                        Sugar
                      </span>
                    </div>
                    <p className="text-xl md:text-3xl font-bold text-gray-900">
                      95
                    </p>
                    <p className="text-xs text-blue-600 font-medium mt-1">
                      Perfect ✓
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-5 border-2 border-purple-100 hover:border-purple-300 transition-all">
                    <div className="flex items-center gap-2 mb-3">
                      <Weight className="w-5 h-5 text-purple-600" />
                      <span className="text-xs font-semibold text-gray-600 uppercase">
                        Weight
                      </span>
                    </div>
                    <p className="text-xl md:text-3xl font-bold text-gray-900">
                      72 kg
                    </p>
                    <p className="text-xs text-purple-600 font-medium mt-1">
                      Stable ✓
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-5 border-2 border-red-100 hover:border-red-300 transition-all">
                    <div className="flex items-center gap-2 mb-3">
                      <Heart className="w-5 h-5 text-red-600" />
                      <span className="text-xs font-semibold text-gray-600 uppercase">
                        Heart
                      </span>
                    </div>
                    <p className="text-xl md:text-3xl font-bold text-gray-900">
                      72 bpm
                    </p>
                    <p className="text-xs text-red-600 font-medium mt-1">
                      Healthy ✓
                    </p>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl">
                  <p className="text-white text-sm font-medium flex items-center gap-2">
                    <Brain className="w-4 h-4" />
                    AI Insight: All vitals look great! Keep it up 💪
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-12 bg-white border-y border-green-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                15K+
              </div>
              <p className="text-gray-600 font-medium">Reports Analyzed</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                8K+
              </div>
              <p className="text-gray-600 font-medium">Happy Families</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                50K+
              </div>
              <p className="text-gray-600 font-medium">Vitals Tracked</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                4.9/5
              </div>
              <p className="text-gray-600 font-medium">User Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need in
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                {" "}
                One Place
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed for the Pakistani family
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all border-2 border-green-100 hover:border-green-300 cursor-pointer overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative">
                  <div className="text-4xl mb-4">{action.emoji}</div>
                  <div
                    className={`w-14 h-14 bg-gradient-to-br ${action.gradient} rounded-2xl flex items-center justify-center shadow-md mb-4 group-hover:scale-110 transition-transform`}
                  >
                    {action.icon}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2 text-lg">
                    {action.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{action.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Smart Features for
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                {" "}
                Better Health
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              AI-powered tools that understand your family's health needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-gradient-to-br from-white to-green-50 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all border-2 border-green-100 hover:border-green-300"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center text-white mb-5 group-hover:scale-110 transition-transform shadow-lg">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Feature Highlight */}
      <section className="py-20 bg-gradient-to-br from-green-500 via-emerald-600 to-teal-600">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold mb-6">
                <Brain className="w-4 h-4" />
                Powered by AI
              </div>
              <h2 className="text-4xl font-bold mb-6">
                Upload Report,
                <br />
                Get Instant AI Analysis
              </h2>
              <p className="text-lg text-green-50 mb-8 leading-relaxed">
                Our AI understands medical reports in English and Urdu. Upload
                any lab report, prescription, or X-ray, and get a detailed
                summary with foods to eat/avoid and questions to ask your doctor
                - sab kuch Roman Urdu mein bhi!
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3">
                  <Check className="w-6 h-6 text-green-200 flex-shrink-0" />
                  <span className="text-green-50">
                    Bilingual explanations (English + Roman Urdu)
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-6 h-6 text-green-200 flex-shrink-0" />
                  <span className="text-green-50">
                    Dietary recommendations based on your results
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-6 h-6 text-green-200 flex-shrink-0" />
                  <span className="text-green-50">
                    Questions to ask your doctor for better consultations
                  </span>
                </li>
              </ul>
              <button className="px-8 py-4 bg-white text-green-600 rounded-2xl hover:bg-green-50 transition-all font-bold text-lg shadow-xl hover:shadow-2xl">
                Try AI Analysis Free
              </button>
            </div>

            <div className="relative">
              <div className="bg-white rounded-3xl p-8 shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">AI Analysis</h4>
                    <p className="text-sm text-gray-500">
                      CBC Report • Analyzed in 3s
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-xl border-l-4 border-green-500">
                    <p className="text-sm font-semibold text-gray-900 mb-1">
                      Summary
                    </p>
                    <p className="text-sm text-gray-600">
                      Overall health is good. Hemoglobin slightly low...
                    </p>
                  </div>

                  <div className="p-4 bg-yellow-50 rounded-xl border-l-4 border-yellow-500">
                    <p className="text-sm font-semibold text-gray-900 mb-1">
                      ⚠️ Abnormal Values
                    </p>
                    <p className="text-sm text-gray-600">
                      Hemoglobin: 11.5 g/dL (Normal: 12-16)
                    </p>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-xl border-l-4 border-blue-500">
                    <p className="text-sm font-semibold text-gray-900 mb-1">
                      🥗 Foods to Eat
                    </p>
                    <p className="text-sm text-gray-600">
                      Spinach, dates, red meat, lentils...
                    </p>
                  </div>

                  <div className="p-4 bg-purple-50 rounded-xl border-l-4 border-purple-500">
                    <p className="text-sm font-semibold text-gray-900 mb-1">
                      Roman Urdu
                    </p>
                    <p className="text-sm text-gray-600 italic">
                      Palak aur khajoor khayein...
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Stories from
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                {" "}
                Happy Families
              </span>
            </h2>
            <p className="text-xl text-gray-600">Real people, real results</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg border-2 border-green-100 hover:border-green-300 transition-all"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-green-600 font-medium">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed mb-4 italic">
                  "{testimonial.content}"
                </p>
                <div className="flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
        <div className="max-w-4xl mx-auto text-center px-6 relative">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Family's Health?
          </h2>
          <p className="text-xl text-green-100 mb-10 max-w-2xl mx-auto leading-relaxed">
            Join thousands of families using healthlens to stay healthy,
            organized, and informed. Apni sehat ko behtar banayen - start karein
            aaj hi!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-10 py-5 bg-white text-green-600 rounded-2xl hover:bg-green-50 hover:shadow-2xl transition-all font-bold text-lg flex items-center justify-center gap-2 group">
              Start Free Trial
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-10 py-5 bg-transparent border-2 border-white text-white rounded-2xl hover:bg-white/10 transition-all font-bold text-lg">
              Learn More
            </button>
          </div>

          <p className="text-green-200 text-sm mt-8">
            ✓ Free forever plan • ✓ No credit card required • ✓ Setup in 2
            minutes
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">💚 healthlens</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Your smart health companion for better family wellness. Sehat ka
                smart dost!
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-green-400">Product</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    AI Analysis
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Mobile App
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-green-400">Company</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-green-400">Support</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Security
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © 2025 healthlens. All rights reserved. Made with 💚 in Pakistan.
            </p>
            <div className="flex items-center gap-6">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default healthlensLanding;
