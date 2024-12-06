// models/Notification.js

const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  message: { type: String, required: true },
  type: { type: String, enum: ["reminder", "alert"], required: true },
  status: { type: String, enum: ["unread", "read"], default: "unread" },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Notification", notificationSchema);
