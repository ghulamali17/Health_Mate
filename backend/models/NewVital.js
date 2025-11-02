const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
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
  image: { type: String, default: "" },
  additionalNotes: { type: String, default: "" },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
}, { timestamps: true });

const itemModel = mongoose.model("Item", itemSchema);
module.exports = itemModel;
