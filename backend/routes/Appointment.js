const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment");
const adminAuthMiddleware = require("../middlewares/adminauth"); // Ensure correct import
const Patient = require("../models/Patient"); // Add this import
const Doctor = require("../models/Doctor"); // Ensure the Doctor model is imported

// Endpoint to fetch all appointments (Admins only)
router.get("/all", adminAuthMiddleware, async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate({
        path: "doctor_id",
        select: "user_id specialization",
        populate: { path: "user_id", select: "name" },
      })
      .populate({ path: "patient_id", select: "name" })
      .sort({ date: 1, time: 1 }); // Sort by date and time

    res.json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
router.get("/doctor/:id", async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id); // Find doctor by ID
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    res.json(doctor);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
// Route for creating an appointment
router.post("/", async (req, res) => {
  const { doctor_id, patient_id, date, time } = req.body;

  if (!doctor_id || !patient_id || !date || !time) {
    return res.status(400).json({ msg: "Missing required fields" });
  }

  try {
    const newAppointment = new Appointment({
      doctor_id,
      patient_id,
      date,
      time,
      status: "pending",
    });

    const savedAppointment = await newAppointment.save();
    res.status(201).json(savedAppointment);
  } catch (err) {
    console.error("Error creating appointment:", err);
    res.status(500).json({ msg: "Error creating appointment" });
  }
});
// GET appointments by doctor ID
router.get("/doctor/:doctorId", async (req, res) => {
  const doctorId = req.params.doctorId; // Get doctor ID from the URL

  try {
    // Find all appointments for the specified doctor
    const appointments = await Appointment.find({ doctor_id: doctorId })
      .populate("patient_id", "name email") // Populate patient details (name and email)
      .exec();

    if (!appointments.length) {
      return res
        .status(404)
        .json({ msg: "No appointments found for this doctor." });
    }

    res.json(appointments); // Return the list of appointments
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res
      .status(500)
      .json({ msg: "Server error, unable to fetch appointments." });
  }
});
module.exports = router;
