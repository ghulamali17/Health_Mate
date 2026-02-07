import {
  X,
  Activity,
  Droplet,
  Weight,
  Thermometer,
  Shield,
} from "lucide-react";

const VitalModal = ({
  showVitalsModal,
  selectedMember,
  handleVitalsSubmit,
  setVitalsFormData,
  vitalsFormData,
}) => {
  return (
    <div>
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

export default VitalModal;
