const express = require("express");
const router = express.Router();
const Patient = require("../models/Patient"); // Adjust path if needed
const User = require("../models/User"); // Adjust path if needed
const Appointment = require("../models/Appointment");
const Prescription = require("../models/Prescription");
const MedicalRecord = require("../models/MedicalRecord");
const Notification = require("../models/Notification");

// Add a new patient
router.post("/add", async (req, res) => {
  try {
    const { _id, name, email, contact_number, gender, date_of_birth, address } =
      req.body;

    // Ensure the User exists
    const user = await User.findById(_id);
    if (!user || user.role !== "patient") {
      return res
        .status(404)
        .json({ message: "User not found or invalid role" });
    }

    const newPatient = new Patient({
      _id,
      name,
      email,
      contact_number,
      gender,
      date_of_birth,
      address,
    });

    await newPatient.save();
    res
      .status(201)
      .json({ message: "Patient added successfully", patient: newPatient });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error adding patient", error: error.message });
  }
});
// Get all patients
router.get("/", async (req, res) => {
  try {
    const patients = await Patient.find();
    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch patients" });
  }
});
// Get a patient's details
router.get("/view/:id", async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    res.status(200).json(patient);
  } catch (error) {
    res.status(400).json({
      message: "Error fetching patient details",
      error: error.message,
    });
  }
});

// Update patient details
router.put("/update/:id", async (req, res) => {
  try {
    const updatedPatient = await Patient.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedPatient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    res.status(200).json({
      message: "Patient updated successfully",
      patient: updatedPatient,
    });
  } catch (error) {
    res.status(400).json({
      message: "Error updating patient details",
      error: error.message,
    });
  }
});

// Delete a patient
// router.delete("/delete/:id", async (req, res) => {
//   try {
//     const deletedPatient = await Patient.findByIdAndDelete(req.params.id);
//     if (!deletedPatient) {
//       return res.status(404).json({ message: "Patient not found" });
//     }
//     res.status(200).json({ message: "Patient deleted successfully" });
//   } catch (error) {
//     res
//       .status(400)
//       .json({ message: "Error deleting patient", error: error.message });
//   }
// });
router.delete("/delete/:id", async (req, res) => {
  const patientId = req.params.id;

  console.log(patientId); // Debugging log to verify the id
  try {
    // Step 1: Find the patient
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Step 2: Delete the associated user (if the patient is related to a user)
    const userId = patient._id; // Assuming _id in Patient refers to User ID
    await User.findByIdAndDelete(userId);

    // Step 3: Check and delete related references in other collections

    // Check and delete appointments if the patient exists in appointments
    const appointments = await Appointment.find({ patient: patientId });
    if (appointments.length > 0) {
      await Appointment.deleteMany({ patient: patientId });
    }

    // Check and delete prescriptions if the patient exists in prescriptions
    const prescriptions = await Prescription.find({ patient: patientId });
    if (prescriptions.length > 0) {
      await Prescription.deleteMany({ patient: patientId });
    }

    // Check and delete medical records if the patient exists in medical records
    const medicalRecords = await MedicalRecord.find({ patient: patientId });
    if (medicalRecords.length > 0) {
      await MedicalRecord.deleteMany({ patient: patientId });
    }

    // Check and delete notifications if the patient exists in notifications
    const notifications = await Notification.find({ patient: patientId });
    if (notifications.length > 0) {
      await Notification.deleteMany({ patient: patientId });
    }

    // Step 4: Finally, delete the patient document itself
    await Patient.findByIdAndDelete(patientId);

    res
      .status(200)
      .json({ message: "Patient and related data deleted successfully" });
  } catch (error) {
    console.error("Error deleting patient and related data:", error);
    res.status(400).json({
      message: "Error deleting patient and related data",
      error: error.message,
    });
  }
});

module.exports = router;
