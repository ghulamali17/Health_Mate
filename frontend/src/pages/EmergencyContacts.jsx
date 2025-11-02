import React, { useState, useEffect } from 'react';
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
  AlertTriangle,
  MessageSquare,
  X,
  Users
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../config/api';
import { toast } from 'react-toastify';

const EmergencyContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    relationship: 'Spouse',
    email: '',
    address: '',
    notes: '',
    priority: 2,
    isPrimary: false
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/emergency-contacts');
      if (response.data) {
        setContacts(response.data);
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
      toast.error('Failed to load emergency contacts');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingContact 
        ? `/api/emergency-contacts/${editingContact._id}`
        : '/api/emergency-contacts';
      
      const method = editingContact ? 'PUT' : 'POST';

      const response = await api[method.toLowerCase()](url, formData);

      if (response.data) {
        toast.success(editingContact ? 'Contact updated successfully' : 'Contact added successfully');
        setShowAddModal(false);
        setEditingContact(null);
        resetForm();
        fetchContacts();
      }
    } catch (error) {
      console.error('Error saving contact:', error);
      const errorMessage = error.response?.data?.message || 'Failed to save contact';
      toast.error(errorMessage);
    }
  };

  const handleDelete = async (contactId) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      try {
        await api.delete(`/api/emergency-contacts/${contactId}`);
        toast.success('Contact deleted successfully');
        fetchContacts();
      } catch (error) {
        console.error('Error deleting contact:', error);
        toast.error('Failed to delete contact');
      }
    }
  };

  const handleSetPrimary = async (contactId) => {
    try {
      const response = await api.patch(`/api/emergency-contacts/${contactId}/primary`);
      if (response.data) {
        toast.success('Primary contact updated');
        fetchContacts();
      }
    } catch (error) {
      console.error('Error setting primary contact:', error);
      toast.error('Failed to set primary contact');
    }
  };

  const handleEdit = (contact) => {
    setEditingContact(contact);
    setFormData({
      name: contact.name,
      phone: contact.phone,
      relationship: contact.relationship,
      email: contact.email || '',
      address: contact.address || '',
      notes: contact.notes || '',
      priority: contact.priority,
      isPrimary: contact.isPrimary
    });
    setShowAddModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      relationship: 'Spouse',
      email: '',
      address: '',
      notes: '',
      priority: 2,
      isPrimary: false
    });
  };

  const handleCall = (phoneNumber) => {
    window.open(`tel:${phoneNumber}`, '_self');
  };

  const handleSMS = (phoneNumber) => {
    window.open(`sms:${phoneNumber}`, '_self');
  };

  const openAddModal = () => {
    setEditingContact(null);
    resetForm();
    setShowAddModal(true);
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
              <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-red-600 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Emergency Contacts</h1>
                <p className="text-sm text-gray-500">Quick access to help when you need it</p>
              </div>
            </div>
            <button
              onClick={openAddModal}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-500 to-red-600 text-white rounded-xl hover:shadow-lg transition-all"
            >
              <Plus className="w-5 h-5" />
              Add Contact
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Emergency Alert Banner */}
        <div className="bg-gradient-to-r from-rose-500 to-red-600 rounded-2xl p-6 text-white shadow-lg mb-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-2">Emergency Quick Access</h2>
              <p className="text-rose-100 mb-4">
                In case of emergency, your primary contact will be notified automatically. 
                Keep your contacts updated for faster assistance.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => window.open('tel:112', '_self')}
                  className="px-4 py-2 bg-white text-rose-600 rounded-xl font-medium hover:bg-rose-50 transition-colors"
                >
                  Emergency: Call 112
                </button>
                <button 
                  onClick={() => window.open('tel:102', '_self')}
                  className="px-4 py-2 bg-white/20 text-white rounded-xl font-medium hover:bg-white/30 transition-colors"
                >
                  Ambulance: 102
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contacts List */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 p-6 shadow-lg">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-rose-500" />
                Your Emergency Contacts
              </h2>
              
              {contacts.length === 0 ? (
                <div className="text-center py-12">
                  <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-2">No emergency contacts added yet</p>
                  <p className="text-gray-400 text-sm">Add your first contact to get started</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {contacts.map((contact) => (
                    <div
                      key={contact._id}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        contact.isPrimary
                          ? 'border-rose-200 bg-gradient-to-r from-rose-50 to-pink-50'
                          : 'border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50/50 hover:bg-gradient-to-r hover:from-gray-100 hover:to-blue-100/50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            contact.isPrimary 
                              ? 'bg-gradient-to-br from-rose-500 to-red-600' 
                              : 'bg-gradient-to-br from-blue-500 to-cyan-600'
                          }`}>
                            <User className="w-6 h-6 text-white" />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-gray-900">{contact.name}</h3>
                              {contact.isPrimary && (
                                <span className="px-2 py-1 bg-rose-100 text-rose-800 text-xs rounded-full flex items-center gap-1">
                                  <Star className="w-3 h-3 fill-rose-500 text-rose-500" />
                                  Primary
                                </span>
                              )}
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                contact.priority === 1 
                                  ? 'bg-red-100 text-red-800'
                                  : contact.priority === 2
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}>
                                Priority {contact.priority}
                              </span>
                            </div>
                            
                            <p className="text-sm text-gray-600 mb-2 capitalize">{contact.relationship}</p>
                            
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-900 font-medium">
                                  {contact.phone}
                                </span>
                              </div>
                              
                              {contact.email && (
                                <div className="flex items-center gap-2">
                                  <Mail className="w-4 h-4 text-gray-400" />
                                  <span className="text-gray-900">
                                    {contact.email}
                                  </span>
                                </div>
                              )}
                              
                              {contact.address && (
                                <div className="flex items-center gap-2">
                                  <MapPin className="w-4 h-4 text-gray-400" />
                                  <span className="text-gray-600 text-sm">{contact.address}</span>
                                </div>
                              )}
                            </div>
                            
                            {contact.notes && (
                              <p className="text-sm text-gray-500 mt-2 bg-white/50 p-2 rounded-lg">{contact.notes}</p>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 ml-4">
                          {!contact.isPrimary && (
                            <button
                              onClick={() => handleSetPrimary(contact._id)}
                              className="p-2 text-gray-400 hover:text-amber-500 transition-colors hover:bg-amber-50 rounded-lg"
                              title="Set as primary"
                            >
                              <Star className="w-4 h-4" />
                            </button>
                          )}
                          
                          <button
                            onClick={() => handleEdit(contact)}
                            className="p-2 text-gray-400 hover:text-blue-600 transition-colors hover:bg-blue-50 rounded-lg"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={() => handleDelete(contact._id)}
                            className="p-2 text-gray-400 hover:text-red-600 transition-colors hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
                        <button
                          onClick={() => handleCall(contact.phone)}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
                        >
                          <Phone className="w-4 h-4" />
                          Call
                        </button>
                        <button
                          onClick={() => handleSMS(contact.phone)}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                        >
                          <MessageSquare className="w-4 h-4" />
                          Message
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions & Info */}
          <div className="space-y-6">
            {/* Emergency Tips */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 p-6 shadow-lg">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                Emergency Preparedness
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
                  <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">1</span>
                  </div>
                  <p className="text-sm text-gray-700">
                    Keep at least one primary contact updated with your current location and medical information
                  </p>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-100">
                  <div className="w-6 h-6 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">2</span>
                  </div>
                  <p className="text-sm text-gray-700">
                    Set high-priority contacts for critical emergencies and medium for general assistance
                  </p>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
                  <div className="w-6 h-6 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">3</span>
                  </div>
                  <p className="text-sm text-gray-700">
                    Regularly update contact information and test communication channels
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Emergency Numbers */}
            <div className="bg-gradient-to-r from-rose-500 to-red-600 rounded-2xl p-6 text-white shadow-lg">
              <h3 className="font-semibold text-lg mb-4">Quick Emergency Numbers</h3>
              
              <div className="space-y-3">
                <button 
                  onClick={() => window.open('tel:112', '_self')}
                  className="w-full flex items-center justify-between p-3 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                >
                  <span>Emergency Helpline</span>
                  <span className="font-mono font-bold">112</span>
                </button>
                
                <button 
                  onClick={() => window.open('tel:15', '_self')}
                  className="w-full flex items-center justify-between p-3 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                >
                  <span>Police</span>
                  <span className="font-mono font-bold">15</span>
                </button>
                
                <button 
                  onClick={() => window.open('tel:16', '_self')}
                  className="w-full flex items-center justify-between p-3 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                >
                  <span>Fire Brigade</span>
                  <span className="font-mono font-bold">16</span>
                </button>
                
                <button 
                  onClick={() => window.open('tel:102', '_self')}
                  className="w-full flex items-center justify-between p-3 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                >
                  <span>Ambulance</span>
                  <span className="font-mono font-bold">102</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Contact Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">
                {editingContact ? 'Edit Contact' : 'Add Emergency Contact'}
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 text-white hover:bg-white/20 rounded-xl transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Enter full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="+92 300 1234567"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Relationship
                  </label>
                  <select
                    value={formData.relationship}
                    onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="Spouse">Spouse</option>
                    <option value="Parent">Parent</option>
                    <option value="Child">Child</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Friend">Friend</option>
                    <option value="Doctor">Doctor</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="email@example.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Full address"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority Level
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="1">High (1)</option>
                    <option value="2">Medium (2)</option>
                    <option value="3">Low (3)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Additional information..."
                  />
                </div>
                
                <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <input
                    type="checkbox"
                    id="isPrimary"
                    checked={formData.isPrimary}
                    onChange={(e) => setFormData({ ...formData, isPrimary: e.target.checked })}
                    className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500"
                  />
                  <label htmlFor="isPrimary" className="text-sm text-amber-800 font-medium">
                    Set as primary emergency contact
                  </label>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg hover:shadow-lg transition-all font-semibold"
                  >
                    {editingContact ? 'Update Contact' : 'Add Contact'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
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
    </div>
  );
};

export default EmergencyContacts;