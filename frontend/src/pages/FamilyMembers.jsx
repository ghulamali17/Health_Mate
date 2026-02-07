import React, { useState, useEffect } from "react";
import {
  User,
  Plus,
  Edit2,
  Trash2,
  Phone,
  Mail,
  Calendar,
  ChevronRight,
  X,
  Activity,
  Save,
  Sparkles,
  ArrowLeft,
  Loader2,
  Shield,
  Droplet,
  Weight,
  Thermometer,
  Heater,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../config/api";
import { toast } from "react-toastify";
import Navbar from "../components/ui/Navbar";

const FamilyMembers = () => {
  const [familyMembers, setFamilyMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showVitalsModal, setShowVitalsModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [editingMember, setEditingMember] = useState(null);

  const [memberFormData, setMemberFormData] = useState({
    name: "",
    relationship: "Mother",
    phone: "",
    email: "",
    dateOfBirth: "",
    gender: "Female",
    bloodGroup: "",
    allergies: "",
    medicalConditions: "",
  });

  const [vitalsFormData, setVitalsFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    time: new Date().toTimeString().slice(0, 5),
    bloodPressureSystolic: "",
    bloodPressureDiastolic: "",
    bloodSugar: "",
    weight: "",
    temperature: "",
    heartRate: "",
    notes: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchFamilyMembers();
  }, []);

  const fetchFamilyMembers = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/family-members");
      if (response.data.success) {
        setFamilyMembers(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching family members:", error);
      toast.error("Failed to load family members");
    } finally {
      setLoading(false);
    }
  };

  const handleEditMember = (member) => {
    setEditingMember(member);
    setMemberFormData({
      name: member.name,
      relationship: member.relationship,
      phone: member.phone,
      email: member.email || "",
      dateOfBirth: member.dateOfBirth
        ? new Date(member.dateOfBirth).toISOString().split("T")[0]
        : "",
      gender: member.gender,
      bloodGroup: member.bloodGroup || "",
      allergies: member.allergies || "",
      medicalConditions: member.medicalConditions || "",
    });
    setShowAddModal(true);
  };

  const handleAddVitals = (member) => {
    setSelectedMember(member);
    setShowVitalsModal(true);
  };

  const handleMemberSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingMember
        ? `/api/family-members/${editingMember._id}`
        : "/api/family-members";
      const method = editingMember ? "put" : "post";
      const response = await api[method](url, memberFormData);
      if (response.data.success) {
        toast.success(
          editingMember ? "Updated successfully" : "Added successfully",
        );
        setShowAddModal(false);
        setEditingMember(null);
        resetMemberForm();
        fetchFamilyMembers();
      }
    } catch (error) {
      toast.error("Failed to save member");
    }
  };

  const handleDeleteMember = async (memberId) => {
    if (window.confirm("Delete this family member?")) {
      try {
        await api.delete(`/api/family-members/${memberId}`);
        toast.success("Member removed");
        fetchFamilyMembers();
      } catch (error) {
        toast.error("Delete failed");
      }
    }
  };

  const handleVitalsSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMember) return;
    try {
      const payload = {
        measuredAt: new Date(`${vitalsFormData.date}T${vitalsFormData.time}`),
        bloodPressure: {
          systolic: Number(vitalsFormData.bloodPressureSystolic) || undefined,
          diastolic: Number(vitalsFormData.bloodPressureDiastolic) || undefined,
        },
        bloodSugar: vitalsFormData.bloodSugar
          ? Number(vitalsFormData.bloodSugar)
          : undefined,
        weight: vitalsFormData.weight
          ? Number(vitalsFormData.weight)
          : undefined,
        temperature: vitalsFormData.temperature
          ? Number(vitalsFormData.temperature)
          : undefined,
        heartRate: vitalsFormData.heartRate
          ? Number(vitalsFormData.heartRate)
          : undefined,
        additionalNotes: vitalsFormData.notes,
        forFamilyMember: true,
        familyMemberId: selectedMember._id,
        familyMemberName: selectedMember.name,
      };
      await api.post("/api/vitals/createitem", payload);
      toast.success(`Recorded for ${selectedMember.name}`);
      setShowVitalsModal(false);
      resetVitalsForm();
    } catch (error) {
      toast.error("Save failed");
    }
  };

  const resetMemberForm = () => {
    setMemberFormData({
      name: "",
      relationship: "Mother",
      phone: "",
      email: "",
      dateOfBirth: "",
      gender: "Female",
      bloodGroup: "",
      allergies: "",
      medicalConditions: "",
    });
  };

  const resetVitalsForm = () => {
    setVitalsFormData({
      date: new Date().toISOString().split("T")[0],
      time: new Date().toTimeString().slice(0, 5),
      bloodPressureSystolic: "",
      bloodPressureDiastolic: "",
      bloodSugar: "",
      weight: "",
      temperature: "",
      heartRate: "",
      notes: "",
    });
  };

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return null;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    )
      age--;
    return age;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Syncing Circle...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-12 mt-12">
        {/* Title & Action */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              Family Circle
            </h1>
            <p className="text-slate-500 font-medium">
              Manage health records for your loved ones.
            </p>
          </div>
          <button
            onClick={() => {
              setEditingMember(null);
              resetMemberForm();
              setShowAddModal(true);
            }}
            className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold shadow-lg hover:bg-slate-800 transition-all active:scale-95"
          >
            <Plus className="w-5 h-5 text-primary" />
            Add Member
          </button>
        </div>

        {/* Member Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {familyMembers.map((member) => (
            <div
              key={member._id}
              className="group bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md hover:border-primary/10 transition-all"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-sm">
                    {member.name?.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 leading-tight">
                      {member.name}
                    </h3>
                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest">
                      {member.relationship}
                    </span>
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                  <button
                    onClick={() => handleEditMember(member)}
                    className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-lg"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteMember(member._id)}
                    className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-50">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
                    Age
                  </p>
                  <p className="text-sm font-bold text-slate-700">
                    {calculateAge(member.dateOfBirth) || "--"} Years
                  </p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-50">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
                    Blood
                  </p>
                  <p className="text-sm font-bold text-slate-700">
                    {member.bloodGroup || "O+"}
                  </p>
                </div>
              </div>

              <div className="space-y-2 mb-8">
                <div className="flex items-center gap-3 text-slate-500 bg-white border border-slate-50 p-3 rounded-xl">
                  <Phone className="w-3.5 h-3.5 opacity-40" />
                  <span className="text-xs font-bold">{member.phone}</span>
                </div>
                {member.email && (
                  <div className="flex items-center gap-3 text-slate-500 bg-white border border-slate-50 p-3 rounded-xl">
                    <Mail className="w-3.5 h-3.5 opacity-40" />
                    <span className="text-xs font-bold truncate">
                      {member.email}
                    </span>
                  </div>
                )}
              </div>

              <button
                onClick={() => handleAddVitals(member)}
                className="w-full py-3.5 bg-primary/10 text-primary rounded-xl font-bold hover:bg-primary/20 transition-all flex items-center justify-center gap-2"
              >
                <Activity className="w-4 h-4" />
                Add Vital Record
              </button>
            </div>
          ))}

          {/* Add Tile */}
          <button
            onClick={() => {
              setEditingMember(null);
              resetMemberForm();
              setShowAddModal(true);
            }}
            className="group border-2 border-dashed border-slate-200 rounded-3xl p-8 flex flex-col items-center justify-center gap-4 hover:bg-white hover:border-primary/40 transition-all cursor-pointer"
          >
            <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all text-slate-400">
              <Plus className="w-6 h-6" />
            </div>
            <span className="text-sm font-bold text-slate-400 group-hover:text-slate-900 transition-colors">
              Add New Member
            </span>
          </button>
        </div>
      </main>

      {/* Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-[1000] animate-fadeIn">
          <div className="bg-white rounded-[1.5rem] sm:rounded-[2rem] max-w-lg w-full shadow-2xl overflow-hidden border border-slate-200">
            <div className="p-5 sm:p-8 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                {editingMember ? "Update Member" : "New Family Member"}
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 text-slate-400 hover:text-slate-900 transition-colors"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
            <div className="p-5 sm:p-8 space-y-6 max-h-[calc(95vh-100px)] overflow-y-auto custom-scrollbar">
              <form onSubmit={handleMemberSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={memberFormData.name}
                    onChange={(e) =>
                      setMemberFormData({
                        ...memberFormData,
                        name: e.target.value,
                      })
                    }
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 font-bold focus:border-primary outline-none"
                    placeholder="e.g. Sarah Jenkins"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                      Relationship
                    </label>
                    <select
                      value={memberFormData.relationship}
                      onChange={(e) =>
                        setMemberFormData({
                          ...memberFormData,
                          relationship: e.target.value,
                        })
                      }
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 font-bold focus:border-primary outline-none text-sm"
                    >
                      {[
                        "Mother",
                        "Father",
                        "Sister",
                        "Brother",
                        "Wife",
                        "Husband",
                        "Daughter",
                        "Son",
                        "Other",
                      ].map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                      Gender
                    </label>
                    <select
                      value={memberFormData.gender}
                      onChange={(e) =>
                        setMemberFormData({
                          ...memberFormData,
                          gender: e.target.value,
                        })
                      }
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 font-bold focus:border-primary outline-none text-sm"
                    >
                      {["Female", "Male", "Other"].map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={memberFormData.phone}
                    onChange={(e) =>
                      setMemberFormData({
                        ...memberFormData,
                        phone: e.target.value,
                      })
                    }
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 font-bold focus:border-primary outline-none"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                      Birth Date (For Age)
                    </label>
                    <input
                      type="date"
                      value={memberFormData.dateOfBirth}
                      onChange={(e) =>
                        setMemberFormData({
                          ...memberFormData,
                          dateOfBirth: e.target.value,
                        })
                      }
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 font-bold outline-none text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                      Blood Group
                    </label>
                    <select
                      value={memberFormData.bloodGroup}
                      onChange={(e) =>
                        setMemberFormData({
                          ...memberFormData,
                          bloodGroup: e.target.value,
                        })
                      }
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 font-bold outline-none text-sm"
                    >
                      <option value="">Select Group</option>
                      {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map(
                        (b) => (
                          <option key={b} value={b}>
                            {b}
                          </option>
                        ),
                      )}
                    </select>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-95"
                >
                  {editingMember ? "Save Changes" : "Create Member"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Vitals Modal */}
      {showVitalsModal && selectedMember && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-[1000] animate-fadeIn">
          <div className="bg-white rounded-[1.5rem] sm:rounded-[2.5rem] max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 sm:p-8 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center flex-shrink-0">
                  <Activity className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 truncate">
                    Add Vitals
                  </h2>
                  <span className="text-[9px] sm:text-[10px] font-bold text-primary uppercase tracking-widest truncate block">
                    Recording for {selectedMember.name}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowVitalsModal(false)}
                className="p-2 text-slate-400 hover:text-slate-900 transition-colors"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
            <div className="p-5 sm:p-8 max-h-[calc(95vh-100px)] overflow-y-auto custom-scrollbar">
              <form onSubmit={handleVitalsSubmit} className="space-y-8">
                {/* Core Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                      Blood Pressure (mmHg)
                    </label>
                    <div className="flex items-center gap-2 bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <input
                        type="number"
                        placeholder="Sys"
                        value={vitalsFormData.bloodPressureSystolic}
                        onChange={(e) =>
                          setVitalsFormData({
                            ...vitalsFormData,
                            bloodPressureSystolic: e.target.value,
                          })
                        }
                        className="w-full bg-transparent font-bold outline-none placeholder:text-slate-300"
                      />
                      <span className="text-slate-300 opacity-50">/</span>
                      <input
                        type="number"
                        placeholder="Dia"
                        value={vitalsFormData.bloodPressureDiastolic}
                        onChange={(e) =>
                          setVitalsFormData({
                            ...vitalsFormData,
                            bloodPressureDiastolic: e.target.value,
                          })
                        }
                        className="w-full bg-transparent font-bold outline-none text-right placeholder:text-slate-300"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                      Blood Sugar (mg/dL)
                    </label>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center gap-2">
                      <input
                        type="number"
                        placeholder="e.g. 95"
                        value={vitalsFormData.bloodSugar}
                        onChange={(e) =>
                          setVitalsFormData({
                            ...vitalsFormData,
                            bloodSugar: e.target.value,
                          })
                        }
                        className="w-full bg-transparent font-bold outline-none placeholder:text-slate-300"
                      />
                      <Droplet className="w-4 h-4 text-sky-500 opacity-20" />
                    </div>
                  </div>
                </div>

                {/* Additional Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                      Weight (kg)
                    </label>
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 flex items-center gap-2">
                      <input
                        type="number"
                        placeholder="70"
                        value={vitalsFormData.weight}
                        onChange={(e) =>
                          setVitalsFormData({
                            ...vitalsFormData,
                            weight: e.target.value,
                          })
                        }
                        className="w-full bg-transparent font-bold outline-none text-sm placeholder:text-slate-300"
                      />
                      <Weight className="w-3.5 h-3.5 opacity-20" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                      Temp (°C)
                    </label>
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 flex items-center gap-2">
                      <input
                        type="number"
                        step="0.1"
                        placeholder="36.6"
                        value={vitalsFormData.temperature}
                        onChange={(e) =>
                          setVitalsFormData({
                            ...vitalsFormData,
                            temperature: e.target.value,
                          })
                        }
                        className="w-full bg-transparent font-bold outline-none text-sm placeholder:text-slate-300"
                      />
                      <Thermometer className="w-3.5 h-3.5 opacity-20" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                      Heart (BPM)
                    </label>
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 flex items-center gap-2">
                      <input
                        type="number"
                        placeholder="72"
                        value={vitalsFormData.heartRate}
                        onChange={(e) =>
                          setVitalsFormData({
                            ...vitalsFormData,
                            heartRate: e.target.value,
                          })
                        }
                        className="w-full bg-transparent font-bold outline-none text-sm placeholder:text-slate-300"
                      />
                      <Activity className="w-3.5 h-3.5 opacity-20" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 py-4 bg-slate-50 p-4 rounded-xl border border-slate-50">
                  <Shield className="w-4 h-4 text-emerald-500" />
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                    End-to-End Secure Recording
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-95"
                >
                  Securely Store Record
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FamilyMembers;
