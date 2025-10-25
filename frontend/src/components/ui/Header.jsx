import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Menu, LogOut, ChevronDown, HeartPulse } from "lucide-react";
import { useAuth } from "../../context/authContext";

const Header = ({ user, loadingUser, toggleSidebar }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-20 bg-white/70 backdrop-blur-md border-b border-green-100 shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3 md:py-4">
        
        {/* Left Section */}
        <div className="flex items-center gap-3">
          {toggleSidebar && (
            <button
              onClick={toggleSidebar}
              className="p-2 hover:bg-green-50 rounded-xl transition-colors md:hidden"
              aria-label="Toggle sidebar"
            >
              <Menu className="w-6 h-6 text-green-600" />
            </button>
          )}
          <div className="flex items-center gap-2">
            <HeartPulse className="w-6 h-6 text-green-600" />
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-green-700 tracking-tight">
                HealthMate
              </h1>
              <p className="text-xs md:text-sm text-gray-500 font-medium">
                Your Smart Health Companion 💚
              </p>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="relative flex items-center gap-3">
          {loadingUser ? (
            <Loader2 className="w-6 h-6 text-green-600 animate-spin" />
          ) : user ? (
            <>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 focus:outline-none hover:bg-green-50 px-3 py-2 rounded-xl transition-all"
                aria-expanded={isDropdownOpen}
              >
                <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-green-400 to-emerald-500 text-white font-semibold rounded-xl">
                  {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-sm font-semibold text-gray-800">
                    {user?.name || "User"}
                  </p>
                  <p className="text-xs text-gray-500">Logged in</p>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown */}
              {isDropdownOpen && (
                <div className="absolute  right-0 top-14 w-48 bg-white border border-gray-100 rounded-xl shadow-lg animate-fadeIn">
                  <button
                    onClick={handleLogout}
                    className="w-full cursor-pointer flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-green-50 rounded-t-xl"
                  >
                    <LogOut className="w-4 h-4 text-gray-600" />
                    Logout
                  </button>
                </div>
              )}
            </>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm rounded-xl font-medium transition-colors"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
