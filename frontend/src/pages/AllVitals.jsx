import React, { useEffect, useState } from "react";
import api from "../config/api";
import {
  Heart,
  Activity,
  Droplet,
  Weight,
  Thermometer,
  Search,
  Calendar,
  FileText,
  TrendingUp,
  ArrowLeft,
  Trash2,
  AlertCircle,
  User,
  Users,
  Loader2,
  X,
} from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/ui/Navbar";

function AllVitals() {
  const [vitals, setVitals] = useState([]);
  const [filteredVitals, setFilteredVitals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchVitals();
  }, []);

  const fetchVitals = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/vitals/useritems");
      const data = response.data;
      const sorted = data.sort(
        (a, b) => new Date(b.measuredAt) - new Date(a.measuredAt),
      );

      setVitals(sorted);
      setFilteredVitals(sorted);
    } catch (err) {
      console.error("Error fetching vitals:", err);
      toast.error("Failed to load records.");
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
          String(v.temperature).includes(q) ||
          (v.forFamilyMember && v.familyMemberName?.toLowerCase().includes(q)),
      ),
    );
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;

    try {
      await api.delete(`/api/vitals/deleteitem/${id}`);
      setVitals((prev) => prev.filter((v) => v._id !== id));
      setFilteredVitals((prev) => prev.filter((v) => v._id !== id));
      toast.success("Record deleted successfully");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete record");
    }
  };

  const avgBP = React.useMemo(
    () =>
      vitals.length > 0
        ? Math.round(
            vitals.reduce(
              (acc, v) => acc + (v.bloodPressure?.systolic || 0),
              0,
            ) / vitals.length,
          )
        : 0,
    [vitals],
  );

  const avgSugar = React.useMemo(
    () =>
      vitals.length > 0
        ? Math.round(
            vitals.reduce((acc, v) => acc + (v.bloodSugar || 0), 0) /
              vitals.length,
          )
        : 0,
    [vitals],
  );

  const avgWeight = React.useMemo(
    () =>
      vitals.length > 0
        ? (
            vitals.reduce((acc, v) => acc + (v.weight || 0), 0) / vitals.length
          ).toFixed(1)
        : 0,
    [vitals],
  );

  const getPersonIcon = (vital) => {
    if (vital.forFamilyMember) {
      return <Users className="w-4 h-4" />;
    }
    return <User className="w-4 h-4" />;
  };

  const getPersonName = (vital) => {
    if (vital.forFamilyMember) {
      return vital.familyMemberName || "Family Member";
    }
    return "Myself";
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-12 mt-12">
        {/* Title Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              Health Timeline
            </h1>
            <p className="text-slate-500 font-medium">
              View and manage your complete health history.
            </p>
          </div>

          <button
            onClick={fetchVitals}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all shadow-sm"
          >
            <TrendingUp className="w-4 h-4" />
            Refresh Data
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {[
            {
              label: "Total Records",
              value: vitals.length,
              icon: FileText,
              color: "text-slate-500",
              bg: "bg-slate-50",
            },
            {
              label: "Avg Pressure",
              value: `${avgBP} mmHg`,
              icon: Activity,
              color: "text-rose-500",
              bg: "bg-rose-50",
            },
            {
              label: "Avg Sugar",
              value: `${avgSugar} mg/dL`,
              icon: Droplet,
              color: "text-sky-500",
              bg: "bg-sky-50",
            },
            {
              label: "Avg Weight",
              value: `${avgWeight} kg`,
              icon: Weight,
              color: "text-violet-500",
              bg: "bg-violet-50",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 ${stat.bg} rounded-lg ${stat.color}`}>
                  <stat.icon className="w-4 h-4" />
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {stat.label}
                </p>
              </div>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="mb-12 relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search records by name, notes, or values..."
            value={search}
            onChange={handleSearch}
            className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:outline-none focus:border-primary/40 transition-all font-medium text-slate-700 placeholder:text-slate-400"
          />
          {search && (
            <button
              onClick={() => {
                setSearch("");
                setFilteredVitals(vitals);
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-slate-900"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
              Syncing Database...
            </p>
          </div>
        ) : filteredVitals.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-100">
            <div className="w-20 h-20 bg-slate-50 flex items-center justify-center mx-auto mb-6 rounded-2xl">
              <Heart className="w-10 h-10 text-slate-200" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">
              No records found
            </h2>
            <p className="text-slate-500 font-medium">
              Start adding vitals to see them in your timeline.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVitals.map((vital) => (
              <div
                key={vital._id}
                className="group bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md hover:border-primary/10 transition-all relative"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-50 rounded-xl text-primary border border-slate-50">
                      {getPersonIcon(vital)}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 truncate max-w-[120px]">
                        {getPersonName(vital)}
                      </h4>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3 text-slate-300" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase">
                          {new Date(vital.measuredAt).toLocaleDateString(
                            "en-US",
                            { month: "short", day: "numeric", year: "numeric" },
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(vital._id)}
                    className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  {[
                    {
                      label: "Pressure",
                      value: `${vital.bloodPressure?.systolic || "--"}/${vital.bloodPressure?.diastolic || "--"}`,
                      sub: "mmHg",
                    },
                    {
                      label: "Sugar",
                      value: vital.bloodSugar || "--",
                      sub: "mg/dL",
                    },
                    { label: "Weight", value: vital.weight || "--", sub: "kg" },
                    {
                      label: "Temp",
                      value: vital.temperature || "--",
                      sub: "°F",
                    },
                  ].map((field, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-50 p-3 rounded-xl border border-slate-50 text-center"
                    >
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                        {field.label}
                      </p>
                      <p className="text-lg font-bold text-slate-900">
                        {field.value}
                      </p>
                      <p className="text-[8px] font-bold text-slate-400 uppercase">
                        {field.sub}
                      </p>
                    </div>
                  ))}
                </div>

                {vital.additionalNotes && (
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-50">
                    <div className="flex gap-2">
                      <AlertCircle className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
                      <p className="text-xs font-medium text-slate-500 leading-relaxed italic line-clamp-2">
                        {vital.additionalNotes}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default AllVitals;
