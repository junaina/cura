// models / Report.js

const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  generated_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: ["appointment", "revenue", "performance"],
    required: true,
  },
  data: { type: Object, required: true }, // Flexible for storing report content
  generated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Report", reportSchema);
