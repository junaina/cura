const express = require("express");
const router = express.Router();
const Patient = require("../models/Patient");
const MedicalRecord = require("../models/MedicalRecord");
const Prescription = require("../models/Prescription");

// 1. Get Patient Profile
router.get("/patient-profile/:patientId", async (req, res) => {
  const { patientId } = req.params;
  // Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(patientId)) {
    return res.status(400).json({ message: "Invalid patient ID" });
  }
  try {
    const patient = await Patient.findById(req.params.patientId);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    res.status(200).json(patient);
  } catch (err) {
    console.error("Error fetching patient profile:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// 2. Get Patient Medical History
router.get("/patient-history/:patientId", async (req, res) => {
  try {
    const medicalRecords = await MedicalRecord.find({
      patient_id: req.params.patientId,
    }).populate("doctor_id", "name specialization");
    const prescriptions = await Prescription.find({
      patient_id: req.params.patientId,
    }).populate("doctor_id", "name specialization");
    res.status(200).json({ medicalRecords, prescriptions });
  } catch (err) {
    console.error("Error fetching patient history:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// 3. Add or Update Medical Record
router.post("/medical-record", async (req, res) => {
  const { patient_id, doctor_id, diagnosis, prescriptions, test_results } =
    req.body;
  try {
    const newRecord = new MedicalRecord({
      patient_id,
      doctor_id,
      diagnosis,
      prescriptions,
      test_results,
    });
    await newRecord.save();
    res
      .status(201)
      .json({ message: "Medical record added successfully", newRecord });
  } catch (err) {
    console.error("Error adding medical record:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/medical-record/:recordId", async (req, res) => {
  const { diagnosis, prescriptions, test_results } = req.body;
  try {
    const updatedRecord = await MedicalRecord.findByIdAndUpdate(
      req.params.recordId,
      { diagnosis, prescriptions, test_results, updated_at: Date.now() },
      { new: true }
    );
    res
      .status(200)
      .json({ message: "Medical record updated successfully", updatedRecord });
  } catch (err) {
    console.error("Error updating medical record:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// 4. Add Prescription
router.post("/prescription", async (req, res) => {
  const { patient_id, doctor_id, medications, notes } = req.body;
  try {
    const newPrescription = new Prescription({
      patient_id,
      doctor_id,
      medications,
      notes,
    });
    await newPrescription.save();
    res
      .status(201)
      .json({ message: "Prescription added successfully", newPrescription });
  } catch (err) {
    console.error("Error adding prescription:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// 5. Update Prescription
router.put("/prescription/:prescriptionId", async (req, res) => {
  const { medications, notes } = req.body;
  try {
    const updatedPrescription = await Prescription.findByIdAndUpdate(
      req.params.prescriptionId,
      { medications, notes, updated_at: Date.now() },
      { new: true }
    );
    res.status(200).json({
      message: "Prescription updated successfully",
      updatedPrescription,
    });
  } catch (err) {
    console.error("Error updating prescription:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
