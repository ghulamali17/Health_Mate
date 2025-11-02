const mongoose = require('mongoose');

const emergencyContactSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  relationship: {
    type: String,
    required: true,
    enum: ['Spouse', 'Parent', 'Child', 'Sibling', 'Friend', 'Doctor', 'Other']
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  address: {
    type: String,
    trim: true
  },
  isPrimary: {
    type: Boolean,
    default: false
  },
  notes: {
    type: String,
    trim: true
  },
  priority: {
    type: Number,
    default: 1,
    min: 1,
    max: 3
  }
}, {
  timestamps: true
});

// Ensure only one primary contact per user
emergencyContactSchema.index({ userId: 1, isPrimary: 1 }, { unique: true, partialFilterExpression: { isPrimary: true } });

module.exports = mongoose.model('EmergencyContact', emergencyContactSchema);    