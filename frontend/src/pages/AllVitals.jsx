import React, { useEffect, useState } from "react";
import {
  Heart,
  Activity,
  Droplet,
  Weight,
  Thermometer,
  Search,
  Calendar,
  Clock,
  Filter,
  TrendingUp,
  ArrowLeft,
  Trash2,
  AlertCircle,
  User
} from "lucide-react";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function AllVitals() {
  const [vitals, setVitals] = useState([]);
  const [filteredVitals, setFilteredVitals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchCurrentUser();
    fetchVitals();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem("pos-token");
      if (!token) return;
      
      const response = await fetch(`${API_URL}/api/users/current`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setUser(data);
    } catch (err) {
      console.error("Failed to fetch user:", err);
    }
  };

  const fetchVitals = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("pos-token");
      if (!token) {
        toast.error("⚠️ Please log in again.");
        return;
      }

      const response = await fetch(`${API_URL}/api/vitals/useritems`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Received vitals data:", data); 

      const sorted = data.sort(
        (a, b) => new Date(b.measuredAt) - new Date(a.measuredAt)
      );

      setVitals(sorted);
      setFilteredVitals(sorted);
    } catch (err) {
      console.error("Error fetching vitals:", err);
      toast.error("Failed to fetch vitals. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const q = e.target.value.toLowerCase();
    setSearch(q);
    setFilteredVitals(
      vitals.filter(
        (v) =>
          v.additionalNotes?.toLowerCase().includes(q) ||
          String(v.bloodSugar).includes(q) ||
          String(v.weight).includes(q) ||
          String(v.temperature).includes(q)
      )
    );
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this vital record?")) return;
    
    try {
      const token = localStorage.getItem("pos-token");
      await fetch(`${API_URL}/api/vitals/deleteitem/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setVitals((prev) => prev.filter((v) => v._id !== id));
      setFilteredVitals((prev) => prev.filter((v) => v._id !== id));
      toast.success("Vital record deleted successfully");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete vital record");
    }
  };

  // Calculate statistics
  const avgBP = vitals.length > 0 
    ? Math.round(vitals.reduce((acc, v) => acc + (v.bloodPressure?.systolic || 0), 0) / vitals.length)
    : 0;
  const avgSugar = vitals.length > 0
    ? Math.round(vitals.reduce((acc, v) => acc + (v.bloodSugar || 0), 0) / vitals.length)
    : 0;
  const avgWeight = vitals.length > 0
    ? (vitals.reduce((acc, v) => acc + (v.weight || 0), 0) / vitals.length).toFixed(1)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => window.history.back()}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-pink-500 rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">All Vitals Records</h1>
                <p className="text-sm text-gray-500">Apni puri health history dekhen</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={fetchVitals}
                className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg text-sm font-medium hover:from-red-600 hover:to-pink-600 transition-all shadow-sm"
              >
                Refresh
              </button>
              {user && (
                <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
                  <User className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">{user.name}</span>
                </div>
              )}
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-lg p-4 border border-red-100">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-red-500" />
                <p className="text-xs text-gray-600 font-medium">Total Records</p>
              </div>
              <p className="text-2xl font-bold text-gray-900">{vitals.length}</p>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-lg p-4 border border-red-100">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-red-500" />
                <p className="text-xs text-gray-600 font-medium">Avg BP (Systolic)</p>
              </div>
              <p className="text-2xl font-bold text-gray-900">{avgBP}</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-100">
              <div className="flex items-center gap-2 mb-2">
                <Droplet className="w-4 h-4 text-blue-500" />
                <p className="text-xs text-gray-600 font-medium">Avg Sugar</p>
              </div>
              <p className="text-2xl font-bold text-gray-900">{avgSugar}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-100">
              <div className="flex items-center gap-2 mb-2">
                <Weight className="w-4 h-4 text-purple-500" />
                <p className="text-xs text-gray-600 font-medium">Avg Weight</p>
              </div>
              <p className="text-2xl font-bold text-gray-900">{avgWeight} kg</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        {/* Search Bar */}
        <div className="mb-6 relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-4 top-3.5" />
          <input
            type="text"
            placeholder="Search by notes, sugar level, weight, temperature..."
            value={search}
            onChange={handleSearch}
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all"
          />
          {search && (
            <button
              onClick={() => {
                setSearch("");
                setFilteredVitals(vitals);
              }}
              className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500 text-sm">Loading your vitals...</p>
          </div>
        ) : filteredVitals.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Vitals Found</h3>
            <p className="text-gray-500 text-sm mb-6">
              {search ? "Try a different search term" : "Start tracking your health by adding your first vital record"}
            </p>
            <button onClick={()=>Navigate("/add-vitals")} className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg font-medium hover:from-red-600 hover:to-pink-600 transition-all shadow-md">
              Add First Vital
            </button>
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing <span className="font-semibold text-gray-900">{filteredVitals.length}</span> {filteredVitals.length === 1 ? 'record' : 'records'}
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Filter className="w-4 h-4" />
                Latest First
              </div>
            </div>

            {/* Vitals Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredVitals.map((vital) => (
                <div
                  key={vital._id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-5 border border-gray-100 relative group"
                >
                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(vital._id)}
                    className="absolute top-3 right-3 p-2 bg-red-50 text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  {/* Header: Date + Time */}
                  <div className="mb-4 pb-3 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-semibold text-gray-900">
                          {new Date(vital.measuredAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
                        <Clock className="w-3 h-3" />
                        {new Date(vital.measuredAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Vitals Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {/* Blood Pressure */}
                    <div className="p-3 bg-gradient-to-br from-red-50 to-pink-50 rounded-lg border border-red-100">
                      <div className="flex items-center gap-2 mb-1">
                        <Activity className="w-4 h-4 text-red-500" />
                        <p className="text-xs text-gray-600 font-medium">BP</p>
                      </div>
                      <p className="text-lg font-bold text-gray-900">
                        {vital.bloodPressure?.systolic || '--'}/{vital.bloodPressure?.diastolic || '--'}
                      </p>
                      <p className="text-xs text-gray-500">mmHg</p>
                    </div>

                    {/* Blood Sugar */}
                    <div className="p-3 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border border-blue-100">
                      <div className="flex items-center gap-2 mb-1">
                        <Droplet className="w-4 h-4 text-blue-500" />
                        <p className="text-xs text-gray-600 font-medium">Sugar</p>
                      </div>
                      <p className="text-lg font-bold text-gray-900">
                        {vital.bloodSugar || '--'}
                      </p>
                      <p className="text-xs text-gray-500">mg/dL</p>
                    </div>

                    {/* Weight */}
                    <div className="p-3 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-100">
                      <div className="flex items-center gap-2 mb-1">
                        <Weight className="w-4 h-4 text-purple-500" />
                        <p className="text-xs text-gray-600 font-medium">Weight</p>
                      </div>
                      <p className="text-lg font-bold text-gray-900">
                        {vital.weight || '--'}
                      </p>
                      <p className="text-xs text-gray-500">kg</p>
                    </div>

                    {/* Temperature */}
                    <div className="p-3 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg border border-orange-100">
                      <div className="flex items-center gap-2 mb-1">
                        <Thermometer className="w-4 h-4 text-orange-500" />
                        <p className="text-xs text-gray-600 font-medium">Temp</p>
                      </div>
                      <p className="text-lg font-bold text-gray-900">
                        {vital.temperature || '--'}
                      </p>
                      <p className="text-xs text-gray-500">°F</p>
                    </div>
                  </div>

                  {/* Heart Rate */}
                  <div className="mb-3 p-2 bg-green-50 rounded-lg border border-green-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-green-500" />
                      <span className="text-xs text-gray-600 font-medium">Heart Rate</span>
                    </div>
                    <span className="text-sm font-bold text-gray-900">{vital.heartRate || '--'} bpm</span>
                  </div>

                  {/* Notes */}
                  {vital.additionalNotes && (
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-gray-600 italic line-clamp-2">
                          {vital.additionalNotes}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default AllVitals;