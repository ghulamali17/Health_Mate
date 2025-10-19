import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Menu, LogOut } from "lucide-react";
import { useAuth } from "../../context/authContext";
import Logo from "../../assets/logo2.png";

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
    <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-4xl mx-auto p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {toggleSidebar && (
            <button
              onClick={toggleSidebar}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors md:hidden"
              title="Toggle Sidebar"
              aria-label="Toggle chat history sidebar"
            >
              <Menu className="w-6 h-6 text-gray-600" />
            </button>
          )}
          <img src={Logo} alt="HealthMate Logo" className="w-10 h-10 object-contain rounded-xl shadow-md" />
          <div>
            <h1 className="md:text-lg text-sm font-semibold text-gray-900">HealthMate</h1>
            <p className="text-xs text-gray-500">Sehat ka Smart Dost 💚</p>
          </div>
        </div>
        <div className="flex items-center gap-3 relative">
          {loadingUser ? (
            <Loader2 className="w-10 h-10 text-green-600 spin" />
          ) : user ? (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="focus:outline-none focus:ring-2 focus:ring-green-500 rounded-xl"
                aria-label="User profile menu"
                aria-expanded={isDropdownOpen}
              >
                <img
                  src={user.profileImage}
                  alt={`${user.name}'s Profile`}
                  className="w-10 h-10 object-cover rounded-xl shadow-md"
                />
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-900 hover:bg-green-50 transition-colors"
                    aria-label="Log out"
                  >
                    <LogOut className="w-4 h-4 text-gray-600" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Header;