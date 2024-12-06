const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Doctor = require("../models/Doctor");
const Availability = require("../models/Availability");

const router = express.Router();

router.post("/signup", async (req, res) => {
  console.log("Incoming request body:", req.body);
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
    const errors = {};

    // First Name: Must be at least 2 characters
    if (!firstName || firstName.trim().length < 2) {
      errors.firstName = "First name must be at least 2 characters long.";
    }

    // Last Name: Must be at least 2 characters
    if (!lastName || lastName.trim().length < 2) {
      errors.lastName = "Last name must be at least 2 characters long.";
    }

    // Email: Valid email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      errors.email = "Invalid email address.";
    }

    // Password: At least 6 characters with at least one number and one special character
    const passwordRegex =
      /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,}$/;
    if (!password || !passwordRegex.test(password)) {
      errors.password =
        "Password must be at least 6 characters long and include at least one number and one special character.";
    }

    // Specialization: Must not be empty
    if (!specialization || specialization.trim().length === 0) {
      errors.specialization = "Specialization is required.";
    }

    // Experience: Must be a positive integer
    if (
      !experience ||
      !Number.isInteger(Number(experience)) ||
      Number(experience) < 0
    ) {
      errors.experience = "Experience must be a valid positive number.";
    }

    // Contact Number: Valid phone number (10-15 digits)
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!contactNumber || !phoneRegex.test(contactNumber)) {
      errors.contactNumber = "Contact number must be 10-15 digits long.";
    }

    // Medical License Number: Must not be empty
    if (!medicalLicenseNumber || medicalLicenseNumber.trim().length === 0) {
      errors.medicalLicenseNumber = "Medical license number is required.";
    }

    // City: Must not be empty
    if (!city || city.trim().length === 0) {
      errors.city = "City is required.";
    }

    // Gender: Must be one of the predefined options
    const allowedGenders = ["male", "female", "other"];
    if (!gender || !allowedGenders.includes(gender.toLowerCase())) {
      errors.gender = "Gender must be male, female, or other.";
    }

    // DOB: Must be a valid date in the past
    const today = new Date();
    const dobDate = new Date(dob);
    if (!dob || isNaN(dobDate.getTime()) || dobDate >= today) {
      errors.dob = "Date of birth must be a valid date in the past.";
    }

    // About: Optional but limited to 500 characters
    if (about && about.length > 500) {
      errors.about = "About section must be 500 characters or fewer.";
    }

    // Slots: Must include at least one selected slot
    if (!slots || slots.length === 0) {
      errors.slots = "At least one availability slot must be selected.";
    }

    // Check if there are validation errors
    if (Object.keys(errors).length > 0) {
      console.error("Validation errors:", errors);
      return res.status(400).json({ message: "Validation errors", errors });
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
    if (slots && slots.length > 0) {
      console.log("Processing availability slots:", slots);

      const availabilityEntries = slots
        .map((slot) => {
          const { day, time } = slot;

          if (!day || !time) return null; // Skip invalid entries

          return {
            doctor_id: newDoctor._id,
            day,
            start_time: time,
            end_time: time, // Adjust if needed
          };
        })
        .filter(Boolean); // Remove null values

      console.log("Transformed availability entries:", availabilityEntries);

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
