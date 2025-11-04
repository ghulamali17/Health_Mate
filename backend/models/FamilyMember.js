const mongoose = require('mongoose');

const familyMemberSchema = new mongoose.Schema({
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
  relationship: {
    type: String,
    required: true,
    enum: [
      'Mother', 'Father', 'Sister', 'Brother', 
      'Wife', 'Husband', 'Daughter', 'Son', 
      'Grandmother', 'Grandfather', 'Other'
    ]
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  dateOfBirth: {
    type: Date
  },
  gender: {
    type: String,
    enum: ['Female', 'Male', 'Other'],
    default: 'Female'
  },
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-', '']
  },
  allergies: {
    type: String,
    trim: true,
    default: ''
  },
  medicalConditions: {
    type: String,
    trim: true,
    default: ''
  }
}, {
  timestamps: true
});

// Index for faster queries
familyMemberSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('FamilyMember', familyMemberSchema);