const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  contact_number: { type: String, default: "" }, // Make optional or add a default value
  gender: { type: String, enum: ["male", "female", "other"], default: "other" }, // Default value
  date_of_birth: { type: Date, default: null }, // Default value
  address: { type: String, default: "" },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Patient", patientSchema);
//to-do: add more fields to the patient schema
