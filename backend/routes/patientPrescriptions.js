const express = require("express");
const router = express.Router();
const Prescription = require("../models/Prescription");
const Patient = require("../models/Patient");

// Endpoint to fetch prescriptions for a patient
router.get("/:patientId", async (req, res) => {
  const patientId = req.params.patientId;

  try {
    const prescriptions = await Prescription.find({ patient_id: patientId })
      .populate("doctor_id", "name specialization") // Populate doctor details
      .select("-__v"); // Exclude unnecessary fields

    if (!prescriptions.length) {
      return res.status(404).json({ message: "No prescriptions found." });
    }

    res.status(200).json(prescriptions);
  } catch (error) {
    console.error("Error fetching prescriptions:", error);
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;
