//ESHA!! this is the admin.js routes file that deals with stuff like pending and approving doctors. related to this is an auth.js file inside the middlewares folder. i had to implenentt some of this as a reference to test whether or not the doctor's get approved well and appear in the dtabase. you can modify and change it as you need.
/////////////////////////////////////////////////////////////////////////////////////////////////////
///LIST OF ALL THE CHANGES I MADE ARE IN 6-12-24modifications.txt file//////////////////////////////////////////////////////////////////

const express = require("express");
const Doctor = require("../models/Doctor");
const { verifyToken, authorizeAdmin } = require("../middlewares/auth");

const router = express.Router();

// Get all pending doctors (Protected: Admin only)
router.get(
  "/pending-doctors",
  verifyToken,
  authorizeAdmin,
  async (req, res) => {
    try {
      const pendingDoctors = await Doctor.find({ isApproved: false }).populate(
        "user_id"
      );
      res.json(pendingDoctors);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to fetch pending doctors." });
    }
  }
);

// Approve a doctor (Protected: Admin only)
router.post(
  "/approve-doctor/:id",
  verifyToken,
  authorizeAdmin,
  async (req, res) => {
    const { id } = req.params;
    try {
      const doctor = await Doctor.findById(id);
      if (!doctor) {
        return res.status(404).json({ message: "Doctor not found." });
      }
      doctor.isApproved = true;
      await doctor.save();
      res.json({ message: "Doctor approved successfully." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to approve doctor." });
    }
  }
);

// Reject a doctor (Protected: Admin only)
router.post(
  "/reject-doctor/:id",
  verifyToken,
  authorizeAdmin,
  async (req, res) => {
    const { id } = req.params;
    try {
      const doctor = await Doctor.findById(id);
      if (!doctor) {
        return res.status(404).json({ message: "Doctor not found." });
      }
      await doctor.remove();
      res.json({ message: "Doctor rejected and removed successfully." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to reject doctor." });
    }
  }
);

module.exports = router;
