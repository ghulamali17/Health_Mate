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
      className={`sticky top-0 z-[100] transition-all duration-300 ${
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
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 bg-white border border-slate-100 rounded-xl hover:border-primary/20 transition-all shadow-sm group"
                >
                  <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center font-bold text-white text-xs">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 text-slate-300 transition-transform ${isDropdownOpen ? "rotate-90" : ""}`}
                  />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 animate-fadeIn">
                    <div className="px-4 py-3 mb-1 border-b border-slate-50">
                      <p className="text-sm font-bold text-slate-900 truncate">
                        {user?.name}
                      </p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                        Premium Account
                      </p>
                    </div>
                    <button
                      onClick={() => handleNavigation("/profile")}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-500 hover:bg-slate-50 hover:text-primary rounded-lg transition-all"
                    >
                      <User className="w-4 h-4" /> Profile
                    </button>
                    <button
                      onClick={() => handleNavigation("/dashboard")}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-500 hover:bg-slate-50 hover:text-primary rounded-lg transition-all"
                    >
                      <LayoutDashboard className="w-4 h-4" /> Dashboard
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-rose-500 hover:bg-rose-50 rounded-lg transition-all border-t border-slate-50 mt-1"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
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
