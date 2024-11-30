const mongoose = require("mongoose");

const medicalRecordSchema = new mongoose.Schema({
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
  diagnosis: { type: String, required: true },
  prescriptions: [
    {
      medicine: { type: String, required: true },
      dosage: { type: String, required: true },
      duration: { type: String, required: true },
    },
  ],
  test_results: [
    {
      test_name: { type: String, required: true },
      result: { type: String, required: true },
      date: { type: Date, required: true },
    },
  ],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("MedicalRecord", medicalRecordSchema);
