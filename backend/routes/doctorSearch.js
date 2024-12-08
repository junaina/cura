const express = require("express");
const router = express.Router();
const Doctor = require("../models/Doctor"); // Import Doctor model

// Search for doctors based on query
router.get("/search", async (req, res) => {
  const query = req.query.query;

  if (!query) {
    return res.status(400).json({ msg: "Search query is required." });
  }

  try {
    // Fetch doctors and populate user details
    const doctors = await Doctor.find({ status: "approved" }) // Only approved doctors
      .populate({
        path: "user_id",
        select: "name email", // Fetch only name and email
      });

    // Filter results by name, specialization, city, or about
    const filteredDoctors = doctors.filter((doctor) => {
      const userName = doctor.user_id?.name || "";
      const specialization = doctor.specialization || "";
      const city = doctor.city || "";
      const about = doctor.about || "";

      return (
        userName.toLowerCase().includes(query.toLowerCase()) ||
        specialization.toLowerCase().includes(query.toLowerCase()) ||
        city.toLowerCase().includes(query.toLowerCase()) ||
        about.toLowerCase().includes(query.toLowerCase())
      );
    });

    if (filteredDoctors.length === 0) {
      return res.status(404).json({ msg: "No doctors found." });
    }

    res.json(filteredDoctors);
  } catch (err) {
    console.error("Error fetching doctors:", err);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
