import React, { useState, useRef, useEffect } from "react";
import { 
  Activity, FileText, MessageSquare, Plus, TrendingUp, 
  Heart, Calendar, Clock, ArrowRight, Upload, ChevronRight,
  Droplet, Weight, Thermometer, BarChart3, User, Settings, LogOut, LayoutDashboard
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../config/api"; // Import centralized API
import { useAuth } from "../../context/authContext";
import { toast } from "react-toastify";
import useClickOutside from "../../hooks/useClickOutside";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [vitals, setVitals] = useState([]);
  const [loadingVitals, setLoadingVitals] = useState(false);
  const [loadingUser, setLoadingUser] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Stats state with real data
  const [stats, setStats] = useState({
    totalReports: 12,
    totalVitals: 0,
    totalChats: 0, 
    lastVital: {
      bp: "--/--",
      sugar: "--",
      date: "No data"
    }
  });

  // Update stats when vitals change
  useEffect(() => {
    if (vitals.length === 0) return;

    const lastVital = vitals[vitals.length - 1];
    setStats(prev => ({
      ...prev,
      totalVitals: vitals.length,
      lastVital: {
        bp: lastVital.bloodPressure?.systolic && lastVital.bloodPressure?.diastolic
          ? `${lastVital.bloodPressure.systolic}/${lastVital.bloodPressure.diastolic}`
          : "--/--",
        sugar: lastVital.bloodSugar || "--",
        date: lastVital.measuredAt 
          ? new Date(lastVital.measuredAt).toLocaleDateString()
          : "No data"
      }
    }));
  }, [vitals]);

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

  const dropdownRef = useRef(null);

  // Use the click outside hook
  useClickOutside(dropdownRef, () => {
    setIsDropdownOpen(false);
  });

  // Fetch current user
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        setLoadingUser(true);
        const token = localStorage.getItem("pos-token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await api.get("/api/users/current");
        setUser(response.data);
      } catch (err) {
        console.error("Failed to fetch user:", err.response?.data || err.message);
        
        if (err.response?.status === 401) {
          toast.error("Session expired. Please login again.");
          localStorage.removeItem("pos-token");
          navigate("/login");
        }
      } finally {
        setLoadingUser(false);
      }
    };

    fetchCurrentUser();
  }, [navigate]);

  // Fetch all vitals on load
  useEffect(() => {
    fetchVitals();
  }, []);

  // Fetch vitals 
  const fetchVitals = async () => {
    try {
      setLoadingVitals(true);
      const token = localStorage.getItem("pos-token");
      if (!token) {
        navigate("/login");
        return;
      }

      const res = await api.get("/api/vitals/useritems");
      setVitals(res.data);
    } catch (err) {
      console.error("Fetch vitals error:", err.response?.data || err.message);
      
      if (err.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("pos-token");
        navigate("/login");
      } else if (err.code === 'ERR_NETWORK') {
        toast.error("Network error. Please check your connection.");
      } else {
        toast.error("Failed to fetch vitals");
      }
    } finally {
      setLoadingVitals(false);
    }
  };

  // Delete vital
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this vital record?")) {
      return;
    }

    try {
      const token = localStorage.getItem("pos-token");
      if (!token) {
        toast.error("Unauthorized request. Please login again.");
        navigate("/login");
        return;
      }

      await api.delete(`/api/vitals/deleteitem/${id}`);
      
      setVitals((prev) => prev.filter((v) => v._id !== id));
      toast.success("Vital record deleted successfully");
    } catch (error) {
      console.error("Delete error:", error.response?.data || error.message);
      
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("pos-token");
        navigate("/login");
      } else if (error.response?.status === 404) {
        toast.error("Vital record not found");
      } else if (error.code === 'ERR_NETWORK') {
        toast.error("Network error. Please check your connection.");
      } else {
        toast.error(error.response?.data?.error || "Failed to delete vital record");
      }
    }
  };

  // Sample data for reports
  const [recentReports] = useState([
    {
      id: 1,
      name: "Blood Test Report",
      date: "20 Oct 2025",
      type: "Lab Report",
      status: "Reviewed"
    },
    {
      id: 2,
      name: "X-Ray Chest",
      date: "15 Oct 2025",
      type: "Radiology",
      status: "Pending"
    },
    {
      id: 3,
      name: "ECG Report",
      date: "10 Oct 2025",
      type: "Cardiology",
      status: "Reviewed"
    }
  ]);


  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">HealthMate Dashboard</h1>
              <p className="text-sm text-gray-500">Apki sehat, ek nazar mein</p>
            </div>
          </div>
          <div  ref={dropdownRef} className="flex items-center gap-3 relative">
            <div className="relative hidden md:block">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
              
              {isDropdownOpen && (
                <div className="absolute left-0 top-12 mt-1 w-48 bg-white border border-gray-100 rounded-xl shadow-lg animate-fadeIn z-50">
                  <button
                    onClick={() => handleNavigation("/")}
                    className="w-full cursor-pointer flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-green-50 rounded-t-xl transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4 text-gray-600" />
                    Dashboard
                  </button>
                  <button
                    onClick={() => handleNavigation("/profile")}
                    className="w-full cursor-pointer flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-green-50 transition-colors"
                  >
                    <User className="w-4 h-4 text-gray-600" />
                    Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full cursor-pointer flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-b-xl transition-colors"
                  >
                    <LogOut className="w-4 h-4 text-red-600" />
                    Logout
                  </button>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
              <User className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                {loadingUser ? "Loading..." : user?.name || "Guest"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Total Reports */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <TrendingUp className="w-5 h-5 opacity-70" />
            </div>
            <div>
              <p className="text-blue-100 text-sm mb-1">Total Reports</p>
              <p className="text-3xl font-bold">{stats.totalReports}</p>
              <p className="text-xs text-blue-100 mt-2">Reports uploaded kar liye</p>
            </div>
          </div>

          {/* Total Vitals */}
          <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-xl p-5 text-white shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6" />
              </div>
              <Activity className="w-5 h-5 opacity-70" />
            </div>
            <div>
              <p className="text-red-100 text-sm mb-1">Vitals Recorded</p>
              <p className="text-3xl font-bold">{stats.totalVitals}</p>
              {stats.totalVitals > 0 ? (
                <p className="text-xs text-red-100 mt-2">
                  BP: {stats.lastVital.bp} mmHg
                </p>
              ) : (
                <p className="text-xs text-red-100 mt-2">No vitals recorded yet</p>
              )}
            </div>
          </div>

          {/* Total Chats */}
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-5 text-white shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6" />
              </div>
              <BarChart3 className="w-5 h-5 opacity-70" />
            </div>
            <div>
              <p className="text-green-100 text-sm mb-1">AI Conversations</p>
              <p className="text-3xl font-bold">{stats.totalChats}</p>
              <p className="text-xs text-green-100 mt-2">Health queries resolved</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5 text-green-500" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg hover:shadow-md transition-all border border-green-100">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <div className="text-left cursor-pointer" onClick={()=>navigate("/add-vitals")}>
                <p className="font-semibold text-gray-900 text-sm">Add Vitals</p>
                <p className="text-xs text-gray-500">Record BP, Sugar, Weight</p>
              </div>
              <ChevronRight onClick={()=>navigate("/add-vitals")} className="cursor-pointer w-5 h-5 text-gray-400 ml-auto" />
            </button>

            <button className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg hover:shadow-md transition-all border border-blue-100">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <Upload className="w-5 h-5 text-white" />
              </div>
              <div onClick={()=>navigate("/summarize")} className="text-left cursor-pointer">
                <p className="font-semibold text-gray-900 text-sm">Upload Report</p>
                <p className="text-xs text-gray-500">AI will summarize it</p>
              </div>
              <ChevronRight onClick={()=>navigate("/summarize")} className="cursor-pointer w-5 h-5 text-gray-400 ml-auto" />
            </button>

            <button className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg hover:shadow-md transition-all border border-purple-100">
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <div onClick={()=>navigate("/chat")} className="text-left cursor-pointer">
                <p className="font-semibold text-gray-900 text-sm">Ask AI</p>
                <p className="text-xs text-gray-500">Health questions & advice</p>
              </div>
              <ChevronRight onClick={()=>navigate("/chat")} className="w-5 cursor-pointer h-5 text-gray-400 ml-auto" />
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Reports */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-500" />
                Recent Reports
              </h2>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                View All
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              {recentReports.map((report) => (
                <div
                  key={report.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm truncate">{report.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="w-3 h-3 text-gray-400" />
                      <p className="text-xs text-gray-500">{report.date}</p>
                      <span className="text-gray-300">•</span>
                      <p className="text-xs text-gray-500">{report.type}</p>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      report.status === "Reviewed"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {report.status}
                  </span>
                </div>
              ))}
            </div>
            {recentReports.length === 0 && (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No reports uploaded yet</p>
                <p className="text-gray-400 text-xs mt-1">Upload your first medical report</p>
              </div>
            )}
          </div>

          {/* Recent Vitals */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" />
                Recent Vitals
              </h2>
              <button onClick={()=>navigate("/all-vitals")} className="text-sm cursor-pointer text-red-600 hover:text-red-700 font-medium flex items-center gap-1">
                View All
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {loadingVitals ? (
              <div className="flex justify-center items-center py-10">
                <div className="w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="ml-2 text-gray-500 text-sm">Loading vitals...</p>
              </div>
            ) : vitals.length === 0 ? (
              <div className="text-center py-8">
                <Heart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No vitals recorded yet</p>
                <p className="text-gray-400 text-xs mt-1">Start tracking your health today</p>
              </div>
            ) : (
              <div className="space-y-3">
                {vitals
                  .slice(-3)
                  .reverse()
                  .map((vital) => (
                    <div
                      key={vital._id}
                      className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <p className="text-sm font-medium text-gray-900">
                            {new Date(vital.measuredAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          {new Date(vital.measuredAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div className="flex items-center gap-2 p-2 bg-red-50 rounded">
                          <Activity className="w-4 h-4 text-red-500" />
                          <div>
                            <p className="text-xs text-gray-500">BP</p>
                            <p className="text-sm font-semibold text-gray-900">
                              {vital.bloodPressure?.systolic || "--"}/{vital.bloodPressure?.diastolic || "--"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 p-2 bg-blue-50 rounded">
                          <Droplet className="w-4 h-4 text-blue-500" />
                          <div>
                            <p className="text-xs text-gray-500">Sugar</p>
                            <p className="text-sm font-semibold text-gray-900">
                              {vital.bloodSugar || "--"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 p-2 bg-purple-50 rounded">
                          <Weight className="w-4 h-4 text-purple-500" />
                          <div>
                            <p className="text-xs text-gray-500">Weight</p>
                            <p className="text-sm font-semibold text-gray-900">
                              {vital.weight || "--"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* Health Tips Banner */}
        <div className="mt-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-5 text-white shadow-lg">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Activity className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1">💡 Daily Health Tip</h3>
              <p className="text-green-50 text-sm">
                Regular monitoring of vitals helps in early detection of health issues. Roz apne BP aur Sugar check karein!
              </p>
              <button onClick={()=>navigate("/health-tips")} className="mt-3 px-4 py-2 bg-white text-green-600 rounded-lg text-sm font-medium hover:bg-green-50 transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
          <p className="text-sm text-yellow-800">
            ⚠️ <strong>Disclaimer:</strong> HealthMate AI is for understanding your reports only, not for medical advice. 
            Always consult your doctor before making any health decisions. Yeh AI sirf samajhne ke liye hai, ilaaj ke liye nahi.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;