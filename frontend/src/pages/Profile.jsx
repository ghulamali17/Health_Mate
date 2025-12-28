import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../config/api";
import { useAuth } from "../context/authContext";
import Header from "../components/ui/Header";
import { Loader2, User, Mail, Calendar } from "lucide-react";
import "./Profile.css";

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user: authUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("pos-token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await api.get("/api/users/current");
        setUser(response.data);
      } catch (err) {
        console.error(
          "Failed to fetch user profile:",
          err.response?.data || err.message
        );
        if (err.response?.status === 401) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white font-sans">
        <Header user={user} loadingUser={loading} />
        <div className="flex justify-center items-center py-20">
          <div className="flex items-center gap-3 text-green-600">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Loading profile...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white font-sans">
      <Header user={user} loadingUser={loading} />

      <div className="flex justify-center items-start py-8 px-4">
        <div className="w-full max-w-2xl">
          <div className="bg-white rounded-3xl shadow-lg border border-green-100 p-8 space-y-6">
            {/* Header Section */}
            <div className="text-center space-y-2">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-lg">
                {user?.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt={user.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="w-10 h-10 text-green-600" />
                )}
              </div>
              <h2 className="text-3xl font-bold text-gray-900">My Profile</h2>
              <p className="text-gray-600">
                Welcome to your healthlens profile
              </p>
            </div>

            {/* Profile Information */}
            <div className="space-y-6">
              {/* Name and Email in one row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name Field */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Full Name
                  </label>
                  <div className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-700">
                    {user?.name || "Not provided"}
                  </div>
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email Address
                  </label>
                  <div className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-700">
                    {user?.email || "Not provided"}
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Member Since */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Member Since
                  </label>
                  <div className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-700">
                    {user?.createdAt
                      ? formatDate(user.createdAt)
                      : "Not available"}
                  </div>
                </div>

                {/* User ID */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    User ID
                  </label>
                  <div className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-700 font-mono text-sm">
                    {user?._id ? user._id.slice(-8) : "Not available"}
                  </div>
                </div>
              </div>

              {/* Profile Image Info */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Profile Image Status
                </label>
                <div className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50">
                  {user?.profileImage ? (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-green-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <span className="text-green-700 font-medium">
                        Profile image uploaded
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-yellow-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                          />
                        </svg>
                      </div>
                      <span className="text-yellow-700">
                        No profile image uploaded
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons - Placeholder for future functionality */}
            <div className="pt-6 border-t border-gray-100">
              <div className="text-center">
                <p className="text-gray-600 text-sm">
                  Profile editing functionality coming soon
                </p>
              </div>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-gray-100">
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <div className="text-2xl font-bold text-green-600">0</div>
                <div className="text-sm text-gray-600">Appointments</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <div className="text-2xl font-bold text-blue-600">0</div>
                <div className="text-sm text-gray-600">Records</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-xl">
                <div className="text-2xl font-bold text-purple-600">0</div>
                <div className="text-sm text-gray-600">Prescriptions</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-xl">
                <div className="text-2xl font-bold text-orange-600">0</div>
                <div className="text-sm text-gray-600">Reminders</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
