import React from "react";
import { X } from "lucide-react";

const MemberModal = ({
  showAddModal,
  setShowAddModal,
  memberFormData,
  setMemberFormData,
  handleMemberSubmit,
  editingMember,
}) => {
  return (
    <div>
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
    </div>
  );
};

export default MemberModal;
