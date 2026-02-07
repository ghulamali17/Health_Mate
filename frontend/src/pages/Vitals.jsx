import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import api from "../config/api";
import {
  Heart,
  Droplet,
  Weight,
  Thermometer,
  Activity,
  Calendar,
  ArrowLeft,
  Save,
  User,
  Shield,
  Clock,
} from "lucide-react";
import { useAuth } from "../context/authContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/ui/Navbar";

const AddVitals = () => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
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
      forFamilyMember: "self",
    },
  });

  const { user } = useAuth();
  const navigate = useNavigate();

  const [familyMembers, setFamilyMembers] = useState([]);
  const [loadingFamilyMembers, setLoadingFamilyMembers] = useState(false);

  const selectedPersonId = watch("forFamilyMember");

  useEffect(() => {
    fetchFamilyMembers();
  }, []);

  const fetchFamilyMembers = async () => {
    try {
      setLoadingFamilyMembers(true);
      const response = await api.get("/api/family-members");

      if (response.data.success) {
        setFamilyMembers(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching family members:", error);
    } finally {
      setLoadingFamilyMembers(false);
    }
  };

  const getSelectedPerson = () => {
    if (selectedPersonId === "self") {
      return { name: "Myself", relationship: "Self" };
    }
    return familyMembers.find((member) => member._id === selectedPersonId);
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
      toast.error("Please enter at least one vital measurement");
      return;
    }

    if (
      (data.bloodPressureSystolic && !data.bloodPressureDiastolic) ||
      (!data.bloodPressureSystolic && data.bloodPressureDiastolic)
    ) {
      toast.error("Please enter both Systolic and Diastolic blood pressure");
      return;
    }

    const measuredAt = new Date(`${data.date}T${data.time}`);
    const selectedPerson = getSelectedPerson();

    const payload = {
      measuredAt,
      bloodPressure: {
        systolic: Number(data.bloodPressureSystolic) || undefined,
        diastolic: Number(data.bloodPressureDiastolic) || undefined,
      },
      bloodSugar: data.bloodSugar ? Number(data.bloodSugar) : undefined,
      weight: data.weight ? Number(data.weight) : undefined,
      temperature: data.temperature ? Number(data.temperature) : undefined,
      heartRate: data.heartRate ? Number(data.heartRate) : undefined,
      additionalNotes: data.notes,
      forFamilyMember: data.forFamilyMember !== "self",
      familyMemberId:
        data.forFamilyMember !== "self" ? data.forFamilyMember : undefined,
      familyMemberName: selectedPerson
        ? `${selectedPerson.name} (${selectedPerson.relationship})`
        : undefined,
    };

    try {
      const res = await api.post("/api/vitals/createitem", payload);

      if (res.status === 201) {
        toast.success("Vitals saved successfully");
        reset();
        navigate("/dashboard");
      }
    } catch (err) {
      toast.error("Failed to save vitals. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900">
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 py-12 mt-12">
        {/* Header Section */}
        <div className="flex items-center gap-4 mb-12">
          <button
            onClick={() => navigate("/dashboard")}
            className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all text-slate-400"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Add New Record
            </h1>
            <p className="text-sm text-slate-500 font-medium">
              Log your vitals for health tracking.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Top Grid: Context */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary/5 rounded-lg text-primary">
                  <User className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">
                  Target Person
                </h3>
              </div>
              <select
                {...register("forFamilyMember")}
                className="w-full bg-slate-50 border border-slate-100 text-slate-900 rounded-xl px-4 py-3 focus:outline-none focus:border-primary/40 transition-all font-bold appearance-none cursor-pointer"
              >
                <option value="self">Myself</option>
                {familyMembers.map((member) => (
                  <option key={member._id} value={member._id}>
                    {member.name} ({member.relationship})
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
                  <Calendar className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">
                  Date & Time
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="date"
                  {...register("date", { required: true })}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 focus:outline-none focus:border-primary/40 text-sm font-bold"
                />
                <input
                  type="time"
                  {...register("time", { required: true })}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 focus:outline-none focus:border-primary/40 text-sm font-bold"
                />
              </div>
            </div>
          </div>

          {/* Vitals Grid */}
          <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-primary text-white rounded-lg">
                <Heart className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold">Vital Measurements</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* BP */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">
                  Blood Pressure
                </label>
                <div className="flex items-center gap-2 bg-slate-50 rounded-2xl p-4 border border-slate-50">
                  <input
                    type="number"
                    {...register("bloodPressureSystolic")}
                    placeholder="120"
                    className="w-full bg-transparent text-xl font-bold focus:outline-none"
                  />
                  <span className="text-slate-300">/</span>
                  <input
                    type="number"
                    {...register("bloodPressureDiastolic")}
                    placeholder="80"
                    className="w-full bg-transparent text-xl font-bold focus:outline-none text-right"
                  />
                </div>
              </div>

              {/* Sugar */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">
                  Blood Sugar
                </label>
                <div className="flex items-center gap-3 bg-slate-50 rounded-2xl p-4 border border-slate-50">
                  <input
                    type="number"
                    {...register("bloodSugar")}
                    placeholder="95"
                    className="w-full bg-transparent text-xl font-bold focus:outline-none"
                  />
                  <Droplet className="w-5 h-5 text-sky-500 opacity-30" />
                </div>
              </div>

              {/* Heart Rate */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">
                  Heart Rate
                </label>
                <div className="flex items-center gap-3 bg-slate-50 rounded-2xl p-4 border border-slate-50">
                  <input
                    type="number"
                    {...register("heartRate")}
                    placeholder="72"
                    className="w-full bg-transparent text-xl font-bold focus:outline-none"
                  />
                  <Activity className="w-5 h-5 text-rose-500 opacity-30" />
                </div>
              </div>

              {/* Weight */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">
                  Weight (kg)
                </label>
                <div className="flex items-center gap-3 bg-slate-50 rounded-2xl p-4 border border-slate-50">
                  <input
                    type="number"
                    step="0.1"
                    {...register("weight")}
                    placeholder="70.5"
                    className="w-full bg-transparent text-xl font-bold focus:outline-none"
                  />
                  <Weight className="w-5 h-5 text-violet-500 opacity-30" />
                </div>
              </div>

              {/* Temp */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">
                  Temperature (°F)
                </label>
                <div className="flex items-center gap-3 bg-slate-50 rounded-2xl p-4 border border-slate-50">
                  <input
                    type="number"
                    step="0.1"
                    {...register("temperature")}
                    placeholder="98.6"
                    className="w-full bg-transparent text-xl font-bold focus:outline-none"
                  />
                  <Thermometer className="w-5 h-5 text-orange-500 opacity-30" />
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2 lg:col-span-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">
                  Notes
                </label>
                <div className="bg-slate-50 rounded-2xl p-3 border border-slate-50 h-[60px]">
                  <textarea
                    {...register("notes")}
                    className="w-full h-full bg-transparent focus:outline-none text-xs font-bold text-slate-600 resize-none"
                    placeholder="Any details..."
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-bold shadow-lg hover:bg-slate-800 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              Store Record
            </button>
            <button
              type="button"
              onClick={() => reset()}
              className="px-10 py-4 bg-white border border-slate-200 text-slate-500 rounded-2xl font-bold hover:bg-slate-50 transition-all"
            >
              Clear All
            </button>
          </div>
        </form>

        <div className="mt-16 flex items-center justify-between border-t border-slate-100 pt-8 opacity-50">
          <div className="flex items-center gap-3">
            <Shield className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">
              End-to-End Encrypted
            </span>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest">
            Synced with Cloud
          </span>
        </div>
      </main>
    </div>
  );
};

export default AddVitals;
