import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { useAuth } from "../context/authContext";
import Logo from "../assets/logo2.png";

function NotFound() {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(false);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        setLoadingUser(true);
        const token = localStorage.getItem("pos-token");
        if (!token) return;

        const response = await axios.get("http://localhost:3001/api/users/current", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (err) {
        console.error("Failed to fetch user:", err.response?.data || err.message);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchCurrentUser();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col font-sans">
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={Logo} alt="HealthMate Logo" className="w-10 h-10 object-contain rounded-xl shadow-md" />
            <div>
              <h1 className="text-lg font-semibold text-gray-900">HealthMate Assistant</h1>
              <p className="text-xs text-gray-500">Powered by Google AI</p>
            </div>
          </div>
          {loadingUser ? (
            <div className="flex items-center gap-3">
              <Loader2 className="w-10 h-10 text-green-600 spin" />
            </div>
          ) : user ? (
            <div className="flex items-center gap-3">
              <img
                src={user.profileImage}
                alt={`${user.name}'s Profile`}
                className="w-10 h-10 object-cover rounded-xl shadow-md"
              />
            </div>
          ) : null}
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">404 - Page Not Found</h1>
          <p className="text-gray-600 mb-6 max-w-md">Sorry, the page you are looking for does not exist.</p>
          <Link
            to="/"
            className="text-green-500 font-semibold hover:underline text-lg"
          >
            Go back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;