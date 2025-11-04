import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Menu,
  LogOut,
  Activity,
  Sparkles,
  Bell,
  ChevronRight,
  User,
  LayoutDashboard,
  HomeIcon
} from "lucide-react";
import { useAuth } from "../../context/authContext";
import useClickOutside from "../../hooks/useClickOutside";
import api from "../../config/api"; 
import { toast } from "react-toastify"; 

const Header = ({ toggleSidebar }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loadingUser, setLoadingUser] = useState(false);
  const navigate = useNavigate();
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

  return (
    <header className="sticky top-0 z-20 bg-white/70 backdrop-blur-md border-b border-green-100 shadow-sm">
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {toggleSidebar && (
                <button
                  onClick={toggleSidebar}
                  className="md:hidden p-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl transition-all"
                >
                  <Menu className="w-5 h-5 text-white" />
                </button>
              )}
              
              <div className="relative">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform">
                  <Activity className="w-8 h-8 text-white" strokeWidth={2.5} />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                  HealthMate
                  <Sparkles className="w-5 h-5 text-yellow-300" />
                </h1>
                <p className="text-emerald-100 text-sm font-medium">
                  Apki sehat ka digital companion
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="relative p-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl transition-all">
                <Bell className="w-5 h-5 text-white" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  3
                </span>
              </button>

              {user ? (
                <div ref={dropdownRef} className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-3 px-4 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl transition-all"
                  >
                    {loadingUser ? (
                      <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    ) : (
                      <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center font-bold text-white text-sm">
                        {user?.name?.charAt(0).toUpperCase() || "U"}
                      </div>
                    )}
                    <span className="text-sm font-semibold text-white hidden md:block">
                      {loadingUser ? "Loading..." : user?.name || "Guest"}
                    </span>
                    <ChevronRight
                      className={`w-4 h-4 text-white transition-transform ${
                        isDropdownOpen ? "rotate-90" : ""
                      }`}
                    />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 top-14 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-fadeIn">
                      <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900">
                          {user?.name || "Guest User"}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {user?.email || "Premium Member"}
                        </p>
                      </div>
                        <button
                        onClick={() => handleNavigation("/")}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-emerald-50 transition-colors"
                      >
                        <HomeIcon className="w-4 h-4 text-emerald-600" />
                        Home
                      </button>
                      <button
                        onClick={() => handleNavigation("/dashboard")}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-emerald-50 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-emerald-600" />
                        Dashboard
                      </button>
                      <button
                        onClick={() => handleNavigation("/profile")}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-emerald-50 transition-colors"
                      >
                        <User className="w-4 h-4 text-emerald-600" />
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
                <div>
                  <button
                    onClick={() => navigate("/login")}
                    className="px-4 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl text-sm font-semibold text-white transition-all" 
                  >
                    Login
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;