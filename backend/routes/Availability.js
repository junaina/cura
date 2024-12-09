const express = require("express");
const router = express.Router();
const Availability = require("../models/Availability");
const Doctor = require("../models/Doctor");
router.get("/:doctorId", async (req, res) => {
  try {
    const availability = await Availability.find({
      doctor_id: req.params.doctorId,
    });
    res.status(200).json(availability);
  } catch (err) {
    console.error("Error fetching availability:", err);
    res.status(500).json({ message: "Server error" });
  }
});
router.post("/", async (req, res) => {
  const { doctor_id, day, start_time, end_time } = req.body;
  // Check if the doctor exists
  const doctor = await Doctor.findById(doctor_id);
  if (!doctor) {
    return res.status(404).json({ message: "Doctor not found." });
  }
  try {
    const newAvailability = new Availability({
      doctor_id,
      day,
      start_time,
      end_time,
    });
    const savedAvailability = await newAvailability.save();
    // Update the doctor document to include this availability
    doctor.availability.push(savedAvailability._id);
    await doctor.save();
    res
      .status(201)
      .json({ message: "Availability added successfully", newAvailability });
  } catch (err) {
    console.error("Error adding availability:", err);
    res.status(500).json({ message: "Server error" });
  }
});
router.put("/:id", async (req, res) => {
  const { start_time, end_time } = req.body;
  try {
    const updatedAvailability = await Availability.findByIdAndUpdate(
      req.params.id,
      { start_time, end_time, updated_at: Date.now() },
      { new: true }
    );
    res.status(200).json({
      message: "Availability updated successfully",
      updatedAvailability,
    });
  } catch (err) {
    console.error("Error updating availability:", err);
    res.status(500).json({ message: "Server error" });
  }
});
router.delete("/:id", async (req, res) => {
  try {
    await Availability.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Availability deleted successfully" });
  } catch (err) {
    console.error("Error deleting availability:", err);
    res.status(500).json({ message: "Server error" });
  }
});
module.exports = router;
