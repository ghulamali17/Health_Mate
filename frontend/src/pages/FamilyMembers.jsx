import React, { useState, useEffect } from 'react';
import { 
  Users, 
  User, 
  Plus, 
  Heart, 
  Edit2, 
  Trash2, 
  Phone, 
  Mail, 
  Calendar,
  X,
  Droplet,
  Weight,
  Thermometer,
  Activity,
  Clock,
  Save,
  RotateCcw,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../config/api';
import { toast } from 'react-toastify';

const FamilyMembers = () => {
  const [familyMembers, setFamilyMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showVitalsModal, setShowVitalsModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [editingMember, setEditingMember] = useState(null);
  
  const [memberFormData, setMemberFormData] = useState({
    name: '',
    relationship: 'Mother',
    phone: '',
    email: '',
    dateOfBirth: '',
    gender: 'Female',
    bloodGroup: '',
    allergies: '',
    medicalConditions: ''
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
    notes: ""
  });

  const navigate = useNavigate();

  // Fetch family members on component mount
  useEffect(() => {
    fetchFamilyMembers();
  }, []);

  const fetchFamilyMembers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/family-members');
      if (response.data.success) {
        setFamilyMembers(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching family members:', error);
      toast.error('Failed to load family members');
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
      email: member.email || '',
      dateOfBirth: member.dateOfBirth ? new Date(member.dateOfBirth).toISOString().split('T')[0] : '',
      gender: member.gender,
      bloodGroup: member.bloodGroup || '',
      allergies: member.allergies || '',
      medicalConditions: member.medicalConditions || ''
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
        : '/api/family-members';
      
      const method = editingMember ? 'put' : 'post';

      const response = await api[method](url, memberFormData);

      if (response.data.success) {
        toast.success(editingMember ? 'Family member updated successfully' : 'Family member added successfully');
        setShowAddModal(false);
        setEditingMember(null);
        resetMemberForm();
        fetchFamilyMembers();
      }
    } catch (error) {
      console.error('Error saving family member:', error);
      toast.error('Failed to save family member');
    }
  };

  const handleDeleteMember = async (memberId) => {
    if (window.confirm('Are you sure you want to delete this family member?')) {
      try {
        await api.delete(`/api/family-members/${memberId}`);
        toast.success('Family member deleted successfully');
        fetchFamilyMembers();
      } catch (error) {
        console.error('Error deleting family member:', error);
        toast.error('Failed to delete family member');
      }
    }
  };

  const handleVitalsSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMember) return;

    try {
      const measuredAt = new Date(`${vitalsFormData.date}T${vitalsFormData.time}`);
      
      const payload = {
        measuredAt,
        bloodPressure: {
          systolic: Number(vitalsFormData.bloodPressureSystolic) || undefined,
          diastolic: Number(vitalsFormData.bloodPressureDiastolic) || undefined
        },
        bloodSugar: vitalsFormData.bloodSugar ? Number(vitalsFormData.bloodSugar) : undefined,
        weight: vitalsFormData.weight ? Number(vitalsFormData.weight) : undefined,
        temperature: vitalsFormData.temperature ? Number(vitalsFormData.temperature) : undefined,
        heartRate: vitalsFormData.heartRate ? Number(vitalsFormData.heartRate) : undefined,
        additionalNotes: vitalsFormData.notes,
        forFamilyMember: true,
        familyMemberId: selectedMember._id,
        familyMemberName: selectedMember.name
      };

      const response = await api.post('/api/vitals/createitem', payload);
      
      if (response.data) {
        toast.success(`Vitals recorded for ${selectedMember.name}`);
        setShowVitalsModal(false);
        resetVitalsForm();
      }
    } catch (error) {
      console.error('Error saving vitals:', error);
      toast.error('Failed to save vitals');
    }
  };

  const resetMemberForm = () => {
    setMemberFormData({
      name: '',
      relationship: 'Mother',
      phone: '',
      email: '',
      dateOfBirth: '',
      gender: 'Female',
      bloodGroup: '',
      allergies: '',
      medicalConditions: ''
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
      notes: ""
    });
  };

  const openAddModal = () => {
    setEditingMember(null);
    resetMemberForm();
    setShowAddModal(true);
  };

  const closeAddModal = () => {
    setShowAddModal(false);
    setEditingMember(null);
    resetMemberForm();
  };

  const closeVitalsModal = () => {
    setShowVitalsModal(false);
    setSelectedMember(null);
    resetVitalsForm();
  };

  const getRelationshipColor = (relationship) => {
    const colors = {
      'Mother': 'from-pink-500 to-rose-600',
      'Father': 'from-blue-500 to-cyan-600',
      'Sister': 'from-purple-500 to-pink-600',
      'Brother': 'from-green-500 to-emerald-600',
      'Wife': 'from-red-500 to-pink-600',
      'Husband': 'from-indigo-500 to-purple-600',
      'Daughter': 'from-yellow-500 to-amber-600',
      'Son': 'from-teal-500 to-cyan-600',
      'Grandmother': 'from-gray-500 to-slate-600',
      'Grandfather': 'from-orange-500 to-amber-600'
    };
    return colors[relationship] || 'from-gray-500 to-slate-600';
  };

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return null;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Family Members</h1>
                <p className="text-sm text-gray-500">Manage your family's health together</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              <button
                onClick={openAddModal}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all"
              >
                <Plus className="w-5 h-5" />
                Add Member
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg mb-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-2">Family Health Management</h2>
              <p className="text-purple-100 mb-4">
                Track health vitals for your entire family in one place. Keep everyone's health records organized and easily accessible.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={openAddModal}
                  className="px-4 py-2 bg-white text-purple-600 rounded-xl font-medium hover:bg-purple-50 transition-colors"
                >
                  Add Family Member
                </button>
                <button 
                  onClick={() => toast.info('Feature coming soon!')}
                  className="px-4 py-2 bg-white/20 text-white rounded-xl font-medium hover:bg-white/30 transition-colors"
                >
                  View Family Health Report
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Family Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {familyMembers.map((member) => (
            <div
              key={member._id}
              className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 p-6 shadow-lg hover:shadow-xl transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 bg-gradient-to-br ${getRelationshipColor(member.relationship)} rounded-xl flex items-center justify-center`}>
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{member.name}</h3>
                    <span className="px-2 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 text-xs rounded-full font-medium">
                      {member.relationship}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleEditMember(member)}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors hover:bg-blue-50 rounded-lg"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteMember(member._id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Member Details */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700">{member.phone}</span>
                </div>
                {member.email && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">{member.email}</span>
                  </div>
                )}
                {member.dateOfBirth && (
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">
                      {new Date(member.dateOfBirth).toLocaleDateString()}
                      {` (${calculateAge(member.dateOfBirth)} years)`}
                    </span>
                  </div>
                )}
              </div>

              {/* Medical Info */}
              <div className="bg-gradient-to-r from-gray-50 to-blue-50/50 rounded-xl p-3 border border-gray-100 mb-4">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {member.bloodGroup && (
                    <div>
                      <span className="font-semibold text-gray-600">Blood Group:</span>
                      <span className="ml-1 text-gray-900">{member.bloodGroup}</span>
                    </div>
                  )}
                  {member.gender && (
                    <div>
                      <span className="font-semibold text-gray-600">Gender:</span>
                      <span className="ml-1 text-gray-900">{member.gender}</span>
                    </div>
                  )}
                  {member.allergies && (
                    <div className="col-span-2">
                      <span className="font-semibold text-gray-600">Allergies:</span>
                      <span className="ml-1 text-gray-900">{member.allergies}</span>
                    </div>
                  )}
                  {member.medicalConditions && (
                    <div className="col-span-2">
                      <span className="font-semibold text-gray-600">Conditions:</span>
                      <span className="ml-1 text-gray-900">{member.medicalConditions}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleAddVitals(member)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg hover:shadow-lg transition-all text-sm font-semibold"
                >
                  <Heart className="w-4 h-4" />
                  Add Vitals
                </button>
              </div>
            </div>
          ))}

          {/* Add New Member Card */}
          {familyMembers.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl flex items-center justify-center mb-4">
                <Users className="w-10 h-10 text-purple-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Family Members Added</h3>
              <p className="text-gray-600 mb-6 max-w-md">
                Start by adding your first family member to track their health records and vitals.
              </p>
              <button
                onClick={openAddModal}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold"
              >
                <Plus className="w-5 h-5" />
                Add Your First Family Member
              </button>
            </div>
          ) : (
            <div
              onClick={openAddModal}
              className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border-2 border-dashed border-purple-200 p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer group flex flex-col items-center justify-center min-h-[200px]"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform mb-3">
                <Plus className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-1">Add Family Member</h3>
              <p className="text-gray-600 text-sm text-center">Click to add a new family member to track their health</p>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Family Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">
                {editingMember ? 'Edit Family Member' : 'Add Family Member'}
              </h2>
              <button
                onClick={closeAddModal}
                className="p-2 text-white hover:bg-white/20 rounded-xl transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <form onSubmit={handleMemberSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={memberFormData.name}
                    onChange={(e) => setMemberFormData({ ...memberFormData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Enter full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Relationship *
                  </label>
                  <select
                    value={memberFormData.relationship}
                    onChange={(e) => setMemberFormData({ ...memberFormData, relationship: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="Mother">Mother</option>
                    <option value="Father">Father</option>
                    <option value="Sister">Sister</option>
                    <option value="Brother">Brother</option>
                    <option value="Wife">Wife</option>
                    <option value="Husband">Husband</option>
                    <option value="Daughter">Daughter</option>
                    <option value="Son">Son</option>
                    <option value="Grandmother">Grandmother</option>
                    <option value="Grandfather">Grandfather</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={memberFormData.phone}
                    onChange={(e) => setMemberFormData({ ...memberFormData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="+92 300 1234567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={memberFormData.email}
                    onChange={(e) => setMemberFormData({ ...memberFormData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="email@example.com"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={memberFormData.dateOfBirth}
                      onChange={(e) => setMemberFormData({ ...memberFormData, dateOfBirth: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Gender
                    </label>
                    <select
                      value={memberFormData.gender}
                      onChange={(e) => setMemberFormData({ ...memberFormData, gender: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Blood Group
                  </label>
                  <select
                    value={memberFormData.bloodGroup}
                    onChange={(e) => setMemberFormData({ ...memberFormData, bloodGroup: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="">Select Blood Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Allergies
                  </label>
                  <input
                    type="text"
                    value={memberFormData.allergies}
                    onChange={(e) => setMemberFormData({ ...memberFormData, allergies: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="e.g., Penicillin, Dust, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Medical Conditions
                  </label>
                  <textarea
                    value={memberFormData.medicalConditions}
                    onChange={(e) => setMemberFormData({ ...memberFormData, medicalConditions: e.target.value })}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="e.g., Diabetes, Hypertension, Asthma, etc."
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all font-semibold"
                  >
                    {editingMember ? 'Update Member' : 'Add Member'}
                  </button>
                  <button
                    type="button"
                    onClick={closeAddModal}
                    className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Add Vitals Modal */}
      {showVitalsModal && selectedMember && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">
                  Add Vitals for {selectedMember.name}
                </h2>
                <p className="text-emerald-100 text-sm">
                  {selectedMember.relationship} • Record health measurements
                </p>
              </div>
              <button
                onClick={closeVitalsModal}
                className="p-2 text-white hover:bg-white/20 rounded-xl transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <form onSubmit={handleVitalsSubmit} className="space-y-6">
                {/* Date and Time */}
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-5 border border-blue-100">
                  <div className="flex items-center gap-3 mb-4">
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
                        name="date"
                        value={vitalsFormData.date}
                        onChange={(e) => setVitalsFormData({ ...vitalsFormData, date: e.target.value })}
                        className="w-full px-4 py-3 text-sm border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-2">
                        Time
                      </label>
                      <input
                        type="time"
                        name="time"
                        value={vitalsFormData.time}
                        onChange={(e) => setVitalsFormData({ ...vitalsFormData, time: e.target.value })}
                        className="w-full px-4 py-3 text-sm border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Vital Signs */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Activity className="w-5 h-5 text-emerald-500" />
                    <h3 className="font-bold text-gray-900">Vital Signs</h3>
                    <span className="text-xs text-gray-500">(Enter any measurement)</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Blood Pressure */}
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
                            value={vitalsFormData.bloodPressureSystolic}
                            onChange={(e) => setVitalsFormData({ ...vitalsFormData, bloodPressureSystolic: e.target.value })}
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
                            value={vitalsFormData.bloodPressureDiastolic}
                            onChange={(e) => setVitalsFormData({ ...vitalsFormData, bloodPressureDiastolic: e.target.value })}
                            placeholder="80"
                            className="w-full px-4 py-3 text-sm border-2 border-red-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent bg-white"
                          />
                          <p className="text-xs text-gray-500 mt-1">Diastolic</p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 mt-2">
                        <span className="font-semibold">Unit:</span> mmHg
                      </p>
                    </div>

                    {/* Blood Sugar */}
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
                        value={vitalsFormData.bloodSugar}
                        onChange={(e) => setVitalsFormData({ ...vitalsFormData, bloodSugar: e.target.value })}
                        placeholder="95"
                        className="w-full px-4 py-3 text-sm border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white"
                      />
                      <p className="text-xs text-gray-600 mt-2">
                        <span className="font-semibold">Unit:</span> mg/dL
                      </p>
                    </div>

                    {/* Weight */}
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
                        value={vitalsFormData.weight}
                        onChange={(e) => setVitalsFormData({ ...vitalsFormData, weight: e.target.value })}
                        placeholder="70"
                        className="w-full px-4 py-3 text-sm border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent bg-white"
                      />
                      <p className="text-xs text-gray-600 mt-2">
                        <span className="font-semibold">Unit:</span> kg
                      </p>
                    </div>

                    {/* Temperature */}
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
                        value={vitalsFormData.temperature}
                        onChange={(e) => setVitalsFormData({ ...vitalsFormData, temperature: e.target.value })}
                        placeholder="98.6"
                        className="w-full px-4 py-3 text-sm border-2 border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-white"
                      />
                      <p className="text-xs text-gray-600 mt-2">
                        <span className="font-semibold">Unit:</span> °F
                      </p>
                    </div>

                    {/* Heart Rate */}
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
                        value={vitalsFormData.heartRate}
                        onChange={(e) => setVitalsFormData({ ...vitalsFormData, heartRate: e.target.value })}
                        placeholder="72"
                        className="w-full px-4 py-3 text-sm border-2 border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent bg-white"
                      />
                      <p className="text-xs text-gray-600 mt-2">
                        <span className="font-semibold">Unit:</span> BPM (beats per minute)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl p-5 border-2 border-gray-200">
                  <label className="block text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-gray-600 to-slate-700 rounded-lg flex items-center justify-center">
                      <Activity className="w-4 h-4 text-white" />
                    </div>
                    Additional Notes
                  </label>
                  <textarea
                    name="notes"
                    value={vitalsFormData.notes}
                    onChange={(e) => setVitalsFormData({ ...vitalsFormData, notes: e.target.value })}
                    rows="3"
                    placeholder="Any additional information about this measurement..."
                    className="w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent resize-none bg-white"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold flex items-center justify-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    Save Vitals for {selectedMember.name}
                  </button>
                  <button
                    type="button"
                    onClick={resetVitalsForm}
                    className="px-4 py-3 bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 rounded-xl hover:shadow-md transition-all font-semibold flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reset
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

export default FamilyMembers;