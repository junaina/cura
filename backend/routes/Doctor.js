const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Doctor = require("../models/Doctor");
const Availability = require("../models/Availability");

const router = express.Router();

router.post("/signup", async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    specialization,
    experience,
    contactNumber,
    medicalLicenseNumber,
    city,
    gender,
    dob,
    about,
    slots,
  } = req.body;

  try {
    // Validate required fields
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !specialization ||
      !experience ||
      !contactNumber ||
      !medicalLicenseNumber ||
      !city ||
      !dob
    ) {
      return res
        .status(400)
        .json({ message: "All required fields must be filled." });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const newUser = new User({
      name: `${firstName} ${lastName}`, // Combine first and last name
      email,
      password: hashedPassword,
      role: "doctor",
    });
    await newUser.save();

    // Create doctor profile
    const newDoctor = new Doctor({
      user_id: newUser._id,
      specialization,
      experience,
      contactNumber,
      medicalLicenseNumber,
      city,
      gender,
      dob,
      about,
    });
    await newDoctor.save();

    // Handle availability slots
    if (slots && Object.keys(slots).length > 0) {
      console.log("Processing availability slots:", slots);

      console.log("Slots received from frontend:", slots);
      // Convert slots into an array of valid availability entries
      const availabilityEntries = Object.entries(slots)
        .map(([key, isChecked]) => {
          if (!isChecked) return null; // Skip unchecked slots

          const [day, time] = key.split("-"); // Split "day-time" into day and time
          if (!day || !time) return null; // Skip invalid entries

          return {
            doctor_id: newDoctor._id,
            day,
            start_time: time,
            end_time: time, // Adjust if needed (e.g., for time ranges)
          };
        })
        .filter(Boolean); // Remove null values

      console.log("Transformed availability entries:", availabilityEntries);

      // Insert availability entries into the database
      if (availabilityEntries.length > 0) {
        try {
          await Availability.insertMany(availabilityEntries);
          console.log("Availability entries inserted successfully.");
        } catch (err) {
          console.error("Error inserting availability entries:", err);
          return res
            .status(500)
            .json({ message: "Failed to save availability slots." });
        }
      }
    }

    res.status(201).json({
      message: "Doctor registered successfully",
      doctorId: newDoctor._id,
    });
  } catch (error) {
    console.error("Server error occurred:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

module.exports = router;
