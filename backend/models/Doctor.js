const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  specialization: { type: String, required: true },
  experience: { type: Number, required: true },
  appointments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Appointment" }],
  medicalLicenseNumber: { type: String, required: true },
  contactNumber: { type: String, required: true },
  city: { type: String, required: true },
  gender: { type: String },
  dob: { type: Date, required: true },
  about: { type: String },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"], // Explicit application states
    default: "pending", // New doctors are "pending" by default
  },
  availability: [{ type: mongoose.Schema.Types.ObjectId, ref: "Availability" }], // Add this
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Doctor", doctorSchema);
