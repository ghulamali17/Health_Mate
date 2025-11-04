const mongoose = require('mongoose');

const vitalSchema = new mongoose.Schema({
  measuredAt: {
    type: Date,
    required: true,
  },
  bloodPressure: {
    systolic: { type: Number },
    diastolic: { type: Number },
  },
  bloodSugar: Number,
  weight: Number,
  temperature: Number,
  heartRate: Number,
  additionalNotes: { type: String, default: "" },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  forFamilyMember: {
    type: Boolean,
    default: false
  },
  familyMemberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FamilyMember",
    default: null
  },
  familyMemberName: {
    type: String,
    default: null
  }
}, { timestamps: true });

// Index for better performance
vitalSchema.index({ user: 1, measuredAt: -1 });
vitalSchema.index({ familyMemberId: 1, measuredAt: -1 });

module.exports = mongoose.model("Vital", vitalSchema);