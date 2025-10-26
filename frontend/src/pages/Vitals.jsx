import React from "react";
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
  Save
} from "lucide-react";
import { useAuth } from "../context/authContext";
import { toast } from "react-toastify";
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
      notes: ""
    }
  });
  const { user } = useAuth();

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
      user: user.id
    };
   const token = localStorage.getItem("pos-token");
if (!token) return;

try {
  const res = await axios.post(
    "https://health-mate-3x6x.vercel.app/api/vitals/createitem",
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (res.status === 201) {
    toast.success("✅ Vitals saved successfully!");
    reset();
  }
} catch (err) {
  console.error("Error saving vitals:", err.response?.data || err.message);
  toast.error("❌ Failed to save vitals. Please try again.");
}

  }
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-4">
          <button className="flex items-center text-gray-600 hover:text-gray-900 mb-3 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">Back to Dashboard</span>
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center shadow">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Add Vitals</h1>
              <p className="text-sm text-gray-500">
                Apni sehat ka record rakhein
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-5"
        >
          {/* Date & Time */}
          <div className="mb-5 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-4">
              <Calendar className="w-4 h-4 text-green-500 flex-shrink-0" />
              <div className="flex flex-1 gap-3">
                <input
                  type="date"
                  {...register("date", { required: true })}
                  className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <input
                  type="time"
                  {...register("time", { required: true })}
                  className="w-32 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
            {errors.date && (
              <p className="text-red-500 text-xs mt-1">Date is required</p>
            )}
            {errors.time && (
              <p className="text-red-500 text-xs mt-1">Time is required</p>
            )}
          </div>

          {/* Vitals */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Blood Pressure */}
            <div className="p-3 bg-gradient-to-r from-red-50 to-pink-50 rounded-lg">
              <label className="block text-xs font-medium text-gray-700 mb-2 flex items-center gap-1">
                <Activity className="w-3 h-3 text-red-500" />
                Blood Pressure
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  {...register("bloodPressureSystolic")}
                  placeholder="120"
                  className="w-20 px-2 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-red-400"
                />
                <span className="text-gray-400">/</span>
                <input
                  type="number"
                  {...register("bloodPressureDiastolic")}
                  placeholder="80"
                  className="w-20 px-2 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-red-400"
                />
                <span className="text-xs text-gray-600">mmHg</span>
              </div>
            </div>

            {/* Blood Sugar */}
            <div className="p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
              <label className="block text-xs font-medium text-gray-700 mb-2 flex items-center gap-1">
                <Droplet className="w-3 h-3 text-blue-500" />
                Blood Sugar
              </label>
              <input
                type="number"
                {...register("bloodSugar")}
                placeholder="95"
                className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400"
              />
            </div>

            {/* Weight */}
            <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
              <label className="block text-xs font-medium text-gray-700 mb-2 flex items-center gap-1">
                <Weight className="w-3 h-3 text-purple-500" />
                Weight
              </label>
              <input
                type="number"
                step="0.1"
                {...register("weight")}
                placeholder="70"
                className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-400"
              />
            </div>

            {/* Temperature */}
            <div className="p-3 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg">
              <label className="block text-xs font-medium text-gray-700 mb-2 flex items-center gap-1">
                <Thermometer className="w-3 h-3 text-orange-500" />
                Temperature
              </label>
              <input
                type="number"
                step="0.1"
                {...register("temperature")}
                placeholder="98.6"
                className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-400"
              />
            </div>

            {/* Heart Rate */}
            <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg md:col-span-2">
              <label className="block text-xs font-medium text-gray-700 mb-2 flex items-center gap-1">
                <Heart className="w-3 h-3 text-green-500" />
                Heart Rate (Pulse)
              </label>
              <input
                type="number"
                {...register("heartRate")}
                placeholder="72"
                className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-green-400"
              />
            </div>
          </div>

          {/* Notes */}
          <div className="mt-4">
            <label className="block text-xs font-medium text-gray-700 mb-2 flex items-center gap-1">
              <FileText className="w-3 h-3 text-gray-500" />
              Additional Notes
            </label>
            <textarea
              {...register("notes")}
              rows="2"
              placeholder="Koi additional information? Jaise: 'Subah khali pet' etc."
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-2 mt-5">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-2.5 px-4 rounded-lg text-sm font-semibold hover:from-green-600 hover:to-emerald-600 transition-all shadow hover:shadow-md flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Vitals
            </button>
            <button
              type="button"
              onClick={() => reset()}
              className="w-24 bg-gray-100 text-gray-700 py-2.5 px-4 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-all"
            >
              Clear
            </button>
          </div>
        </form>
         <div className="mt-4 p-2.5 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-800">
              💡 <strong>Tip:</strong> Regular monitoring helps track your health. Roz ke vitals record karna zaroori hai!
            </p>
          </div>
      </div>
      
    </div>
  );
};

export default AddVitals;