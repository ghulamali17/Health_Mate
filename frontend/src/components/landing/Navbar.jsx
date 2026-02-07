import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import { toast } from "react-toastify";
import useClickOutside from "../../hooks/useClickOutside";
import {
  Activity,
  Shield,
  Star,
  Heart,
  ArrowRight,
  LayoutDashboard,
  User,
  LogOut,
  Home,
  ChevronRight,
} from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
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
  return (
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
  );
};

export default Navbar;
