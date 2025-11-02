import React from "react";
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
  Clock,
  Sparkles,
  Info,
  CheckCircle2,
  RotateCcw
} from "lucide-react";

const AddVitals = () => {
  const [formData, setFormData] = React.useState({
    date: new Date().toISOString().split("T")[0],
    time: new Date().toTimeString().slice(0, 5),
    bloodPressureSystolic: "",
    bloodPressureDiastolic: "",
    bloodSugar: "",
    weight: "",
    temperature: "",
    heartRate: "",
    notes: ""
  });

  const [errors, setErrors] = React.useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleReset = () => {
    setFormData({
      date: new Date().toISOString().split("T")[0],
      time: new Date().toTimeString().slice(0, 5),
      bloodPressureSystolic: "",
      bloodPressureDiastolic: "",
      bloodSugar: "",
      weight: "",
      temperature: "",
      heartRate: "",
      notes: ""
    });
    setErrors({});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = {};
    if (!formData.date) newErrors.date = "Date is required";
    if (!formData.time) newErrors.time = "Time is required";

    const hasAnyVital =
      formData.bloodPressureSystolic ||
      formData.bloodPressureDiastolic ||
      formData.bloodSugar ||
      formData.weight ||
      formData.temperature ||
      formData.heartRate;

    if (!hasAnyVital) {
      alert("⚠️ Please enter at least one vital measurement");
      return;
    }

    if (
      (formData.bloodPressureSystolic && !formData.bloodPressureDiastolic) ||
      (!formData.bloodPressureSystolic && formData.bloodPressureDiastolic)
    ) {
      alert("⚠️ Please enter both systolic and diastolic values");
      return;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const measuredAt = new Date(`${formData.date}T${formData.time}`);

    const payload = {
      measuredAt,
      bloodPressure: {
        systolic: Number(formData.bloodPressureSystolic) || undefined,
        diastolic: Number(formData.bloodPressureDiastolic) || undefined
      },
      bloodSugar: formData.bloodSugar ? Number(formData.bloodSugar) : undefined,
      weight: formData.weight ? Number(formData.weight) : undefined,
      temperature: formData.temperature ? Number(formData.temperature) : undefined,
      heartRate: formData.heartRate ? Number(formData.heartRate) : undefined,
      additionalNotes: formData.notes
    };

    console.log("Submitting vitals:", payload);
    alert("✅ Vitals saved successfully!");
    handleReset();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 shadow-lg">
        <div className="max-w-5xl mx-auto px-6 py-5">
          <button 
            onClick={() => console.log("Navigate back")}
            className="flex items-center gap-2 text-emerald-100 hover:text-white mb-3 transition-colors group"
          >
            <div className="w-8 h-8 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center group-hover:bg-white/20 transition-all">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span className="text-sm font-semibold">Back to Dashboard</span>
          </button>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                <Activity className="w-8 h-8 text-white" strokeWidth={2.5} />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-white flex items-center justify-center">
                <Heart className="w-3 h-3 text-white animate-pulse" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                Add Vitals
                <Sparkles className="w-5 h-5 text-yellow-300" />
              </h1>
              <p className="text-emerald-100 text-sm font-medium">
                Apni sehat ka record rakhein
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-6">
        <div className="mb-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl p-5 text-white shadow-lg">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1">Quick Tip</h3>
              <p className="text-blue-50 text-sm leading-relaxed">
                Record your vitals at the same time each day for accurate tracking. 
                Morning readings are usually most consistent. Subah ka time sabse behtar hai!
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Health Measurements</h2>
                <p className="text-xs text-gray-600">Fill in the vitals you want to track</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="mb-6 p-5 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-bold text-gray-900">When did you measure?</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-purple-500" />
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full px-4 py-3 text-sm border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                  />
                  {errors.date && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <span>⚠️</span> {errors.date}
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-purple-500" />
                    Time
                  </label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className="w-full px-4 py-3 text-sm border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                  />
                  {errors.time && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <span>⚠️</span> {errors.time}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-5 h-5 text-emerald-500" />
                <h3 className="font-bold text-gray-900">Vital Signs</h3>
                <span className="text-xs text-gray-500">(Enter any measurement)</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="group bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-5 border-2 border-red-100 hover:border-red-300 transition-all">
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
                        name="bloodPressureSystolic"
                        value={formData.bloodPressureSystolic}
                        onChange={handleChange}
                        placeholder="120"
                        className="w-full px-4 py-3 text-sm border-2 border-red-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent bg-white"
                      />
                      <p className="text-xs text-gray-500 mt-1">Systolic</p>
                    </div>
                    <span className="text-2xl font-bold text-gray-300">/</span>
                    <div className="flex-1">
                      <input
                        type="number"
                        name="bloodPressureDiastolic"
                        value={formData.bloodPressureDiastolic}
                        onChange={handleChange}
                        placeholder="80"
                        className="w-full px-4 py-3 text-sm border-2 border-red-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent bg-white"
                      />
                      <p className="text-xs text-gray-500 mt-1">Diastolic</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mt-2 flex items-center gap-1">
                    <span className="font-semibold">Unit:</span> mmHg
                  </p>
                </div>

                <div className="group bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-5 border-2 border-blue-100 hover:border-blue-300 transition-all">
                  <label className="block text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                      <Droplet className="w-4 h-4 text-white" />
                    </div>
                    Blood Sugar
                  </label>
                  <input
                    type="number"
                    name="bloodSugar"
                    value={formData.bloodSugar}
                    onChange={handleChange}
                    placeholder="95"
                    className="w-full px-4 py-3 text-sm border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white"
                  />
                  <p className="text-xs text-gray-600 mt-2 flex items-center gap-1">
                    <span className="font-semibold">Unit:</span> mg/dL
                  </p>
                </div>

                <div className="group bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-5 border-2 border-purple-100 hover:border-purple-300 transition-all">
                  <label className="block text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                      <Weight className="w-4 h-4 text-white" />
                    </div>
                    Weight
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    placeholder="70"
                    className="w-full px-4 py-3 text-sm border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent bg-white"
                  />
                  <p className="text-xs text-gray-600 mt-2 flex items-center gap-1">
                    <span className="font-semibold">Unit:</span> kg
                  </p>
                </div>

                <div className="group bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl p-5 border-2 border-orange-100 hover:border-orange-300 transition-all">
                  <label className="block text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-yellow-600 rounded-lg flex items-center justify-center">
                      <Thermometer className="w-4 h-4 text-white" />
                    </div>
                    Temperature
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    name="temperature"
                    value={formData.temperature}
                    onChange={handleChange}
                    placeholder="98.6"
                    className="w-full px-4 py-3 text-sm border-2 border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-white"
                  />
                  <p className="text-xs text-gray-600 mt-2 flex items-center gap-1">
                    <span className="font-semibold">Unit:</span> °F
                  </p>
                </div>

                <div className="group bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-5 border-2 border-green-100 hover:border-green-300 transition-all md:col-span-2">
                  <label className="block text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                      <Heart className="w-4 h-4 text-white" />
                    </div>
                    Heart Rate (Pulse)
                  </label>
                  <input
                    type="number"
                    name="heartRate"
                    value={formData.heartRate}
                    onChange={handleChange}
                    placeholder="72"
                    className="w-full px-4 py-3 text-sm border-2 border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent bg-white"
                  />
                  <p className="text-xs text-gray-600 mt-2 flex items-center gap-1">
                    <span className="font-semibold">Unit:</span> BPM (beats per minute)
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-6 p-5 bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl border-2 border-gray-200">
              <label className="block text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-gray-600 to-slate-700 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-white" />
                </div>
                Additional Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="3"
                placeholder="Koi additional information? Jaise: 'Subah khali pet', 'Exercise ke baad', etc."
                className="w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent resize-none bg-white"
              />
              <p className="text-xs text-gray-500 mt-2">
                Optional: Add any context about your measurements
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleSubmit}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-4 px-6 rounded-xl text-sm font-bold hover:from-emerald-600 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                Save Vitals
                <CheckCircle2 className="w-4 h-4" />
              </button>
              <button
                onClick={handleReset}
                className="sm:w-40 bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 py-4 px-6 rounded-xl text-sm font-bold hover:from-gray-200 hover:to-slate-200 transition-all shadow hover:shadow-md flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Clear Form
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-5 text-white shadow-lg">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold mb-1">💡 Daily Tracking</h3>
                <p className="text-emerald-50 text-sm">
                  Regular monitoring helps track your health. Roz ke vitals record karna zaroori hai!
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-5 text-white shadow-lg">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold mb-1">📊 Track Progress</h3>
                <p className="text-blue-50 text-sm">
                  View trends over time to understand your health better. Apni progress dekhein!
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