import React, { useState, useEffect } from "react";
import {
  Phone,
  User,
  Mail,
  MapPin,
  Plus,
  Edit2,
  Trash2,
  Star,
  Shield,
  ArrowLeft,
  Cross,
  AlertTriangle,
  MessageSquare,
  X,
  Users,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../config/api";
import { toast } from "react-toastify";

const EmergencyContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    relationship: "Spouse",
    email: "",
    address: "",
    notes: "",
    priority: 2,
    isPrimary: false,
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/emergency-contacts");
      if (response.data) {
        setContacts(response.data);
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
      toast.error("Failed to load emergency contacts");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingContact
        ? `/api/emergency-contacts/${editingContact._id}`
        : "/api/emergency-contacts";

      const method = editingContact ? "PUT" : "POST";

      const response = await api[method.toLowerCase()](url, formData);

      if (response.data) {
        toast.success(
          editingContact
            ? "Contact updated successfully"
            : "Contact added successfully",
        );
        setShowAddModal(false);
        setEditingContact(null);
        resetForm();
        fetchContacts();
      }
    } catch (error) {
      console.error("Error saving contact:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to save contact";
      toast.error(errorMessage);
    }
  };

  const handleDelete = async (contactId) => {
    if (window.confirm("Are you sure you want to delete this contact?")) {
      try {
        await api.delete(`/api/emergency-contacts/${contactId}`);
        toast.success("Contact deleted successfully");
        fetchContacts();
      } catch (error) {
        console.error("Error deleting contact:", error);
        toast.error("Failed to delete contact");
      }
    }
  };

  const handleSetPrimary = async (contactId) => {
    try {
      const response = await api.patch(
        `/api/emergency-contacts/${contactId}/primary`,
      );
      if (response.data) {
        toast.success("Primary contact updated");
        fetchContacts();
      }
    } catch (error) {
      console.error("Error setting primary contact:", error);
      toast.error("Failed to set primary contact");
    }
  };

  const handleEdit = (contact) => {
    setEditingContact(contact);
    setFormData({
      name: contact.name,
      phone: contact.phone,
      relationship: contact.relationship,
      email: contact.email || "",
      address: contact.address || "",
      notes: contact.notes || "",
      priority: contact.priority,
      isPrimary: contact.isPrimary,
    });
    setShowAddModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      phone: "",
      relationship: "Spouse",
      email: "",
      address: "",
      notes: "",
      priority: 2,
      isPrimary: false,
    });
  };

  const handleCall = (phoneNumber) => {
    window.open(`tel:${phoneNumber}`, "_self");
  };

  const handleSMS = (phoneNumber) => {
    window.open(`sms:${phoneNumber}`, "_self");
  };

  const openAddModal = () => {
    setEditingContact(null);
    resetForm();
    setShowAddModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-[40] px-6 py-5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <button
                onClick={() => navigate("/dashboard")}
                className="p-3 hover:bg-slate-50 rounded-2xl transition-all text-slate-400 hover:text-primary"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="w-12 h-12 bg-rose-500 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-500/10">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Emergency Contacts
                </h1>
                <p className="text-sm text-slate-500 font-medium">
                  Manage your primary responders and emergency help
                </p>
              </div>
            </div>

            <button
              onClick={openAddModal}
              className="px-8 py-4 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center gap-3 active:scale-[0.98]"
            >
              <Plus className="w-5 h-5" />
              Add Contact
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 md:p-8">
        {/* Help Banner */}
        <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-xl mb-12 relative overflow-hidden">
          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-10">
            <div className="w-20 h-20 bg-rose-500 rounded-3xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-rose-500/20">
              <AlertTriangle className="w-10 h-10 text-white" />
            </div>
            <div className="flex-1 text-center lg:text-left">
              <h2 className="text-3xl font-bold mb-3 tracking-tight">
                Emergency Help
              </h2>
              <p className="text-slate-400 font-medium mb-8 max-w-2xl leading-relaxed">
                In case of a medical emergency, use the quick-dial buttons below
                or contact your primary responder immediately.
              </p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                <button
                  onClick={() => window.open("tel:112", "_self")}
                  className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-bold text-sm hover:bg-slate-100 transition-all flex items-center gap-3"
                >
                  <Phone className="w-4 h-4 text-rose-500" />
                  Emergency: 112
                </button>
                <button
                  onClick={() => window.open("tel:102", "_self")}
                  className="px-8 py-4 bg-white/10 text-white border border-white/10 rounded-2xl font-bold text-sm hover:bg-white/20 transition-all"
                >
                  Ambulance: 102
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Contacts List */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between border-b border-slate-200 pb-5">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-3">
                <Users className="w-4 h-4 text-primary" />
                Your Contacts
              </h2>
              <div className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                {contacts.length}{" "}
                {contacts.length === 1 ? "Contact" : "Contacts"}
              </div>
            </div>

            {contacts.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-[3rem] border border-slate-200 shadow-sm">
                <div className="w-24 h-24 bg-slate-50 flex items-center justify-center mx-auto mb-8 rounded-[2rem]">
                  <Shield className="w-12 h-12 text-slate-200" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  No Contacts
                </h3>
                <p className="text-slate-500 font-medium max-w-xs mx-auto">
                  Your emergency contact list is currently empty.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {contacts.map((contact) => (
                  <div
                    key={contact._id}
                    className={`group relative bg-white rounded-[2.5rem] p-8 border transition-all duration-300 ${
                      contact.isPrimary
                        ? "border-primary shadow-sm"
                        : "border-slate-200 hover:border-primary/30"
                    }`}
                  >
                    <div className="flex flex-col md:flex-row items-start justify-between gap-6">
                      <div className="flex items-start gap-6 flex-1">
                        <div
                          className={`w-16 h-16 rounded-3xl flex items-center justify-center flex-shrink-0 shadow-sm ${
                            contact.isPrimary
                              ? "bg-primary text-white"
                              : "bg-slate-50 text-slate-400"
                          }`}
                        >
                          <User className="w-8 h-8" />
                        </div>

                        <div className="flex-1 w-full">
                          <div className="flex flex-wrap items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                              {contact.name}
                            </h3>
                            {contact.isPrimary && (
                              <span className="px-3 py-1 bg-primary text-white text-[9px] font-bold uppercase tracking-widest rounded-full">
                                Primary
                              </span>
                            )}
                            <span
                              className={`px-3 py-1 text-[9px] font-bold uppercase tracking-widest rounded-full ${
                                contact.priority === 1
                                  ? "bg-rose-50 text-rose-600"
                                  : "bg-slate-50 text-slate-500"
                              }`}
                            >
                              Priority {contact.priority}
                            </span>
                          </div>

                          <p className="text-sm font-bold text-primary mb-6 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                            {contact.relationship}
                          </p>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 mb-8">
                            <div className="flex items-center gap-4">
                              <div className="p-2.5 bg-slate-50 rounded-xl">
                                <Phone className="w-4 h-4 text-slate-400" />
                              </div>
                              <span className="text-slate-900 font-bold text-sm">
                                {contact.phone}
                              </span>
                            </div>

                            {contact.email && (
                              <div className="flex items-center gap-4">
                                <div className="p-2.5 bg-slate-50 rounded-xl">
                                  <Mail className="w-4 h-4 text-slate-400" />
                                </div>
                                <span className="text-slate-600 font-medium text-sm truncate">
                                  {contact.email}
                                </span>
                              </div>
                            )}

                            {contact.address && (
                              <div className="flex items-center gap-4 sm:col-span-2">
                                <div className="p-2.5 bg-slate-50 rounded-xl">
                                  <MapPin className="w-4 h-4 text-slate-400" />
                                </div>
                                <span className="text-slate-500 text-sm font-medium">
                                  {contact.address}
                                </span>
                              </div>
                            )}
                          </div>

                          {contact.notes && (
                            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 text-slate-500 text-sm italic">
                              "{contact.notes}"
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex md:flex-col gap-3 md:pt-2 w-full md:w-auto">
                        {!contact.isPrimary && (
                          <button
                            onClick={() => handleSetPrimary(contact._id)}
                            className="flex-1 md:w-11 md:h-11 flex items-center justify-center bg-white border border-slate-200 text-slate-400 rounded-xl hover:text-primary hover:border-primary transition-all shadow-sm"
                            title="Set as Primary"
                          >
                            <Star className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleEdit(contact)}
                          className="flex-1 md:w-11 md:h-11 flex items-center justify-center bg-white border border-slate-200 text-slate-400 rounded-xl hover:text-blue-500 hover:border-blue-500 transition-all shadow-sm"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(contact._id)}
                          className="flex-1 md:w-11 md:h-11 flex items-center justify-center bg-white border border-slate-200 text-slate-400 rounded-xl hover:text-rose-500 hover:border-rose-500 transition-all shadow-sm"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-8 border-t border-slate-100">
                      <button
                        onClick={() => handleCall(contact.phone)}
                        className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-emerald-500 text-white rounded-2xl hover:bg-emerald-600 transition-all font-bold shadow-md active:scale-[0.98]"
                      >
                        <Phone className="w-4 h-4" />
                        Quick Call
                      </button>
                      <button
                        onClick={() => handleSMS(contact.phone)}
                        className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-sky-500 text-white rounded-2xl hover:bg-sky-600 transition-all font-bold shadow-md active:scale-[0.98]"
                      >
                        <MessageSquare className="w-4 h-4" />
                        Send SMS
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-3">
                <Shield className="w-4 h-4 text-primary" />
                Quick Tips
              </h3>

              <div className="space-y-6">
                {[
                  {
                    id: 1,
                    text: "Inform your primary contact about your medical history and allergies.",
                    color: "bg-primary",
                  },
                  {
                    id: 2,
                    text: "Set priority levels to distinguish between close family and doctors.",
                    color: "bg-sky-500",
                  },
                  {
                    id: 3,
                    text: "Keep your contact info updated to ensure help reaches you quickly.",
                    color: "bg-violet-500",
                  },
                ].map((tip) => (
                  <div key={tip.id} className="flex gap-4">
                    <div
                      className={`w-8 h-8 ${tip.color} rounded-xl flex items-center justify-center flex-shrink-0 text-white font-bold text-xs`}
                    >
                      {tip.id}
                    </div>
                    <p className="text-sm font-medium text-slate-500 leading-relaxed pt-1">
                      {tip.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-8">
                Emergency Numbers
              </h3>

              <div className="space-y-4">
                {[
                  {
                    name: "Emergency Helpline",
                    num: "112",
                    icon: Phone,
                    color: "bg-rose-500",
                  },
                  {
                    name: "Public Safety",
                    num: "15",
                    icon: Shield,
                    color: "bg-slate-800",
                  },
                  {
                    name: "Fire Response",
                    num: "16",
                    icon: AlertTriangle,
                    color: "bg-slate-800",
                  },
                  {
                    name: "Ambulance",
                    num: "102",
                    icon: Cross,
                    color: "bg-emerald-500",
                  },
                ].map((n, i) => (
                  <button
                    key={i}
                    onClick={() => window.open(`tel:${n.num}`, "_self")}
                    className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 ${n.color} rounded-xl flex items-center justify-center`}
                      >
                        <n.icon className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-bold text-sm">{n.name}</span>
                    </div>
                    <span className="font-bold text-primary text-lg">
                      {n.num}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-[1000] animate-fadeIn">
          <div className="bg-white rounded-[2.5rem] max-w-xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-slate-200">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-2xl text-primary font-bold">
                  <User className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                  {editingContact ? "Edit Contact" : "Add Contact"}
                </h2>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-3 text-slate-400 hover:text-primary hover:bg-slate-50 rounded-2xl transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-8 overflow-y-auto max-h-[calc(90vh-120px)] custom-scrollbar">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-widest ml-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-primary focus:bg-white transition-all text-slate-900 font-medium"
                      placeholder="Enter name"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-widest ml-1">
                      Relationship
                    </label>
                    <div className="relative">
                      <select
                        value={formData.relationship}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            relationship: e.target.value,
                          })
                        }
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-primary focus:bg-white transition-all text-slate-900 font-medium appearance-none"
                      >
                        <option value="Spouse">Spouse</option>
                        <option value="Parent">Parent</option>
                        <option value="Child">Child</option>
                        <option value="Sibling">Sibling</option>
                        <option value="Friend">Friend</option>
                        <option value="Doctor">Doctor</option>
                        <option value="Other">Other</option>
                      </select>
                      <ChevronRight className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 rotate-90 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-widest ml-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-primary focus:bg-white transition-all text-slate-900 font-medium"
                    placeholder="Enter phone number"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-widest ml-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-primary focus:bg-white transition-all text-slate-900 font-medium"
                    placeholder="Enter email (optional)"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-widest ml-1">
                    Address
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-primary focus:bg-white transition-all text-slate-900 font-medium"
                    placeholder="Enter address (optional)"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-widest ml-1">
                      Priority Level
                    </label>
                    <div className="relative">
                      <select
                        value={formData.priority}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            priority: parseInt(e.target.value),
                          })
                        }
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-primary focus:bg-white transition-all text-slate-900 font-medium appearance-none"
                      >
                        <option value="1">High Priority (1)</option>
                        <option value="2">Medium Priority (2)</option>
                        <option value="3">Low Priority (3)</option>
                      </select>
                      <ChevronRight className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 rotate-90 pointer-events-none" />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        isPrimary: !formData.isPrimary,
                      })
                    }
                    className={`flex items-center justify-center gap-3 w-full py-4 rounded-2xl font-bold transition-all border ${
                      formData.isPrimary
                        ? "bg-primary border-primary text-white shadow-md shadow-primary/20"
                        : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100"
                    }`}
                  >
                    <Star
                      className={`w-4 h-4 ${formData.isPrimary ? "fill-white" : ""}`}
                    />
                    Primary Responder
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-widest ml-1">
                    Emergency Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    rows="3"
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-primary focus:bg-white transition-all text-slate-900 font-medium resize-none shadow-sm"
                    placeholder="Any special medical instructions..."
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-8 py-4 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-[0.98]"
                  >
                    {editingContact ? "Save Changes" : "Create Contact"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-8 py-4 bg-slate-100 text-slate-500 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmergencyContacts;
