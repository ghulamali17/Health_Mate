import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Menu,
  LogOut,
  Activity,
  Sparkles,
  Bell,
  ChevronRight,
  User,
  LayoutDashboard,
  Clock,
  Home,
} from "lucide-react";
import { useAuth } from "../../context/authContext";
import useClickOutside from "../../hooks/useClickOutside";
import { toast } from "react-toastify";

const Header = ({ toggleSidebar }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useClickOutside(dropdownRef, () => setIsDropdownOpen(false));

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

  const pathname = window.location.pathname;

  return (
    <header
      className={`sticky top-0 z-[990] transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-md border-b border-slate-200 py-3 shadow-sm"
          : "bg-white border-b border-slate-100 py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {toggleSidebar && (
              <button
                onClick={toggleSidebar}
                className="lg:hidden p-2 hover:bg-slate-50 rounded-lg transition-all"
              >
                <Menu className="w-5 h-5 text-slate-600" />
              </button>
            )}

            <div
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => navigate("/")}
            >
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-all">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900 tracking-tight">
                HealthLens
              </span>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-8">
            {[
              { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
              { label: "Health AI", path: "/chat", icon: Sparkles },
              { label: "Vitals", path: "/all-vitals", icon: Activity },
              { label: "Reports", path: "/reports", icon: Clock },
            ].map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider transition-all ${
                  pathname === item.path
                    ? "text-primary"
                    : "text-slate-400 hover:text-slate-900"
                }`}
              >
                <item.icon className="w-3.5 h-3.5" />
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-400 hover:text-primary transition-all">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full ring-2 ring-white"></span>
            </button>

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
                        onClick={() => handleNavigation("/profile")}
                        className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-slate-500 hover:bg-white hover:text-primary hover:shadow-sm rounded-xl transition-all border border-transparent hover:border-slate-100"
                      >
                        <User className="w-4 h-4 opacity-50" /> Profile
                      </button>
                      <button
                        onClick={() => handleNavigation("/dashboard")}
                        className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-slate-500 hover:bg-white hover:text-primary hover:shadow-sm rounded-xl transition-all border border-transparent hover:border-slate-100"
                      >
                        <LayoutDashboard className="w-4 h-4 opacity-50" />{" "}
                        Dashboard
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
              <button
                onClick={() => navigate("/login")}
                className="px-6 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-all shadow-md active:scale-95"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
