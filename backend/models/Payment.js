// models / Payment.js

const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  patient_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  appointment_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Appointment",
    required: true,
  },
  amount: { type: Number, required: true },
  payment_method: {
    type: String,
    enum: ["credit_card", "debit_card", "paypal"],
    required: true,
  },
  status: {
    type: String,
    enum: ["completed", "pending", "failed"],
    required: true,
  },
  transaction_id: { type: String },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Payment", paymentSchema);
