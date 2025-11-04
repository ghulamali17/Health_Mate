import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import {
  Heart,
  Droplet,
  Weight,
  Thermometer,
  Activity,
  Calendar,
  FileText,
  ArrowLeft,
  Save,
  Users,
  User,
  Loader
} from "lucide-react";
import { useAuth } from "../context/authContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AddVitals = () => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      time: new Date().toTimeString().slice(0, 5),
      bloodPressureSystolic: "",
      bloodPressureDiastolic: "",
      bloodSugar: "",
      weight: "",
      temperature: "",
      heartRate: "",
      notes: "",
      forFamilyMember: "self", // Default to self
    }
  });

  const { user } = useAuth();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
  
  // State for family members
  const [familyMembers, setFamilyMembers] = useState([]);
  const [loadingFamilyMembers, setLoadingFamilyMembers] = useState(false);

  // Watch the forFamilyMember field to conditionally show family member name
  const selectedPersonId = watch("forFamilyMember");
  const isForFamilyMember = selectedPersonId !== "self";

  // Fetch family members on component mount
  useEffect(() => {
    fetchFamilyMembers();
  }, []);

  const fetchFamilyMembers = async () => {
    try {
      setLoadingFamilyMembers(true);
      const token = localStorage.getItem("pos-token");
      if (!token) {
        toast.error("❌ Authentication token missing");
        return;
      }

      const response = await axios.get(`${API_URL}/api/family-members`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setFamilyMembers(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching family members:", error);
      toast.error("Failed to load family members");
    } finally {
      setLoadingFamilyMembers(false);
    }
  };

  // Get the selected person's details
  const getSelectedPerson = () => {
    if (selectedPersonId === "self") {
      return { name: "Myself", relationship: "Self" };
    }
    return familyMembers.find(member => member._id === selectedPersonId);
  };

  const onSubmit = async (data) => {
    const hasAnyVital =
      data.bloodPressureSystolic ||
      data.bloodPressureDiastolic ||
      data.bloodSugar ||
      data.weight ||
      data.temperature ||
      data.heartRate;

    if (!hasAnyVital) {
      toast.error("⚠️ Please enter at least one vital measurement");
      return;
    }

    if (
      (data.bloodPressureSystolic && !data.bloodPressureDiastolic) ||
      (!data.bloodPressureSystolic && data.bloodPressureDiastolic)
    ) {
      toast.error("⚠️ Please enter both systolic and diastolic values");
      return;
    }

    // Combine date + time into a single timestamp
    const measuredAt = new Date(`${data.date}T${data.time}`);

    // Get the selected person
    const selectedPerson = getSelectedPerson();

    // Prepare payload for backend
    const payload = {
      measuredAt,
      bloodPressure: {
        systolic: Number(data.bloodPressureSystolic) || undefined,
        diastolic: Number(data.bloodPressureDiastolic) || undefined
      },
      bloodSugar: data.bloodSugar ? Number(data.bloodSugar) : undefined,
      weight: data.weight ? Number(data.weight) : undefined,
      temperature: data.temperature ? Number(data.temperature) : undefined,
      heartRate: data.heartRate ? Number(data.heartRate) : undefined,
      additionalNotes: data.notes,
      // Add family member information
      forFamilyMember: data.forFamilyMember !== "self",
      familyMemberId: data.forFamilyMember !== "self" ? data.forFamilyMember : undefined,
      familyMemberName: selectedPerson ? `${selectedPerson.name} (${selectedPerson.relationship})` : undefined
    };

    const token = localStorage.getItem("pos-token");
    if (!token) {
      toast.error("❌ Authentication token missing");
      return;
    }

    try {
      const res = await axios.post(
        `${API_URL}/api/vitals/createitem`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.status === 201) {
        const memberName = selectedPerson ? selectedPerson.name : "your";
        toast.success(`✅ Vitals saved successfully for ${memberName}!`);
        reset();
      }
    } catch (err) {
      console.error("Error saving vitals:", err.response?.data || err.message);
      toast.error("❌ Failed to save vitals. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button 
            onClick={() => navigate("/dashboard")} 
            className="flex cursor-pointer items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back to Dashboard</span>
          </button>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Add Vitals</h1>
              <p className="text-sm text-gray-500">
                Track health measurements for yourself or family members
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6"
        >
          {/* Person Selection */}
          <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-bold text-gray-900">Who are these vitals for?</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Person
                </label>
                {loadingFamilyMembers ? (
                  <div className="flex items-center gap-2 text-gray-500">
                    <Loader className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Loading family members...</span>
                  </div>
                ) : (
                  <select
                    {...register("forFamilyMember")}
                    className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white"
                  >
                    {/* Always include "Myself" option */}
                    <option value="self">
                      👤 Myself (Self)
                    </option>
                    
                    {/* Family members from API */}
                    {familyMembers.map((member) => (
                      <option key={member._id} value={member._id}>
                        {member.relationship === 'Mother' && '👩‍👧‍👦 '}
                        {member.relationship === 'Father' && '👨‍👧‍👦 '}
                        {member.relationship === 'Sister' && '👧 '}
                        {member.relationship === 'Brother' && '👦 '}
                        {member.relationship === 'Wife' && '👩‍❤️‍👨 '}
                        {member.relationship === 'Husband' && '👨‍❤️‍👨 '}
                        {member.relationship === 'Daughter' && '👧 '}
                        {member.relationship === 'Son' && '👦 '}
                        {member.relationship === 'Grandmother' && '👵 '}
                        {member.relationship === 'Grandfather' && '👴 '}
                        {member.name} ({member.relationship})
                      </option>
                    ))}
                  </select>
                )}
              </div>
              
              {/* Selected Person Info */}
              <div className="flex items-end">
                <div className={`w-full p-3 rounded-lg border ${
                  isForFamilyMember 
                    ? "bg-purple-50 border-purple-200 text-purple-800" 
                    : "bg-blue-50 border-blue-200 text-blue-800"
                }`}>
                  <div className="flex items-center gap-2 mb-1">
                    {isForFamilyMember ? (
                      <Users className="w-4 h-4" />
                    ) : (
                      <User className="w-4 h-4" />
                    )}
                    <span className="text-sm font-semibold">
                      {isForFamilyMember ? "Family Member" : "Yourself"}
                    </span>
                  </div>
                  <p className="text-xs">
                    {getSelectedPerson()?.name} • {getSelectedPerson()?.relationship}
                  </p>
                  {isForFamilyMember && (
                    <p className="text-xs mt-1">
                      💡 Make sure you have their consent to record vitals.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Refresh Button */}
            <div className="mt-3 flex justify-end">
              <button
                type="button"
                onClick={fetchFamilyMembers}
                disabled={loadingFamilyMembers}
                className="flex items-center gap-2 px-3 py-1.5 text-xs bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <Loader className={`w-3 h-3 ${loadingFamilyMembers ? 'animate-spin' : ''}`} />
                Refresh Family Members
              </button>
            </div>
          </div>

          {/* Date & Time */}
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                <Calendar className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-bold text-gray-900">Measurement Time</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  {...register("date", { required: true })}
                  className="w-full px-3 py-2.5 text-sm border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white"
                />
                {errors.date && (
                  <p className="text-red-500 text-xs mt-1">Date is required</p>
                )}
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Time
                </label>
                <input
                  type="time"
                  {...register("time", { required: true })}
                  className="w-full px-3 py-2.5 text-sm border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white"
                />
                {errors.time && (
                  <p className="text-red-500 text-xs mt-1">Time is required</p>
                )}
              </div>
            </div>
          </div>

          {/* Rest of the form remains the same */}
          {/* Vitals Grid */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <Activity className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-bold text-gray-900">Vital Signs</h3>
              <span className="text-xs text-gray-500">(Enter any measurement)</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Blood Pressure */}
              <div className="p-4 bg-gradient-to-br from-red-50 to-pink-50 rounded-xl border-2 border-red-100">
                <label className="block text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg flex items-center justify-center">
                    <Activity className="w-4 h-4 text-white" />
                  </div>
                  Blood Pressure
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <input
                      type="number"
                      {...register("bloodPressureSystolic")}
                      placeholder="120"
                      className="w-full px-3 py-2.5 text-sm border-2 border-red-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent bg-white"
                    />
                    <p className="text-xs text-gray-500 mt-1 text-center">Systolic</p>
                  </div>
                  <span className="text-2xl font-bold text-gray-300">/</span>
                  <div className="flex-1">
                    <input
                      type="number"
                      {...register("bloodPressureDiastolic")}
                      placeholder="80"
                      className="w-full px-3 py-2.5 text-sm border-2 border-red-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent bg-white"
                    />
                    <p className="text-xs text-gray-500 mt-1 text-center">Diastolic</p>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  <span className="font-semibold">Unit:</span> mmHg
                </p>
              </div>

              {/* Blood Sugar */}
              <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-100">
                <label className="block text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                    <Droplet className="w-4 h-4 text-white" />
                  </div>
                  Blood Sugar
                </label>
                <input
                  type="number"
                  {...register("bloodSugar")}
                  placeholder="95"
                  className="w-full px-3 py-2.5 text-sm border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white"
                />
                <p className="text-xs text-gray-600 mt-2">
                  <span className="font-semibold">Unit:</span> mg/dL
                </p>
              </div>

              {/* Weight */}
              <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border-2 border-purple-100">
                <label className="block text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                    <Weight className="w-4 h-4 text-white" />
                  </div>
                  Weight
                </label>
                <input
                  type="number"
                  step="0.1"
                  {...register("weight")}
                  placeholder="70"
                  className="w-full px-3 py-2.5 text-sm border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent bg-white"
                />
                <p className="text-xs text-gray-600 mt-2">
                  <span className="font-semibold">Unit:</span> kg
                </p>
              </div>

              {/* Temperature */}
              <div className="p-4 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl border-2 border-orange-100">
                <label className="block text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-yellow-600 rounded-lg flex items-center justify-center">
                    <Thermometer className="w-4 h-4 text-white" />
                  </div>
                  Temperature
                </label>
                <input
                  type="number"
                  step="0.1"
                  {...register("temperature")}
                  placeholder="98.6"
                  className="w-full px-3 py-2.5 text-sm border-2 border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-white"
                />
                <p className="text-xs text-gray-600 mt-2">
                  <span className="font-semibold">Unit:</span> °F
                </p>
              </div>

              {/* Heart Rate */}
              <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-100 md:col-span-2">
                <label className="block text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                    <Heart className="w-4 h-4 text-white" />
                  </div>
                  Heart Rate (Pulse)
                </label>
                <input
                  type="number"
                  {...register("heartRate")}
                  placeholder="72"
                  className="w-full px-3 py-2.5 text-sm border-2 border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent bg-white"
                />
                <p className="text-xs text-gray-600 mt-2">
                  <span className="font-semibold">Unit:</span> BPM (beats per minute)
                </p>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="mb-6 p-4 bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl border-2 border-gray-200">
            <label className="block text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-gray-600 to-slate-700 rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 text-white" />
              </div>
              Additional Notes
            </label>
            <textarea
              {...register("notes")}
              rows="3"
              placeholder="Any additional information about this measurement? e.g., 'Before breakfast', 'After exercise', 'Feeling dizzy', etc."
              className="w-full px-3 py-2.5 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent resize-none bg-white"
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-4 rounded-xl text-sm font-semibold hover:shadow-lg transition-all shadow hover:shadow-xl flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              Save Vitals for {getSelectedPerson()?.name}
            </button>
            <button
              type="button"
              onClick={() => reset({
                date: new Date().toISOString().split("T")[0],
                time: new Date().toTimeString().slice(0, 5),
                bloodPressureSystolic: "",
                bloodPressureDiastolic: "",
                bloodSugar: "",
                weight: "",
                temperature: "",
                heartRate: "",
                notes: "",
                forFamilyMember: "self"
              })}
              className="w-32 bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 py-3 px-4 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-all shadow hover:shadow-md"
            >
              Clear
            </button>
          </div>
        </form>

        {/* Tips */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl p-5 text-white shadow-lg">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">💡 Tracking Tip</h3>
                <p className="text-blue-50 text-sm">
                  Regular monitoring helps track health trends. Record vitals at the same time each day for consistency.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-5 text-white shadow-lg">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">👨‍👩‍👧‍👦 Family Health</h3>
                <p className="text-purple-50 text-sm">
                  Track health for your entire family. Keep everyone's records organized in one place.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddVitals;