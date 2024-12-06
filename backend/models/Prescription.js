// models / Prescription.js

const mongoose = require("mongoose");

const prescriptionSchema = new mongoose.Schema({
  patient_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  doctor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
  },
  medications: [
    {
      medicine: { type: String, required: true },
      dosage: { type: String, required: true },
      duration: { type: String, required: true },
    },
  ],
  notes: { type: String },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Prescription", prescriptionSchema);
