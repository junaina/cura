const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date_of_birth: { type: Date, required: true },
  gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
  contact_number: { type: String, required: true },
  medical_history: [
    {
      condition: { type: String, required: true },
      date_diagnosed: { type: Date },
    },
  ],
  appointments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Appointment" }],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Patient", patientSchema);
