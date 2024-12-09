const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const passport = require("passport");
const User = require("../models/User");
const Doctor = require("../models/Doctor");
const authMiddleware = require("../middlewares/adminauth");
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;
const Patient = require("../models/Patient");
// Admin-specific /me route
router.get("/me", authMiddleware, async (req, res) => {
  try {
    // Since adminauth has already validated the token and role, we can fetch the user details
    const user = await User.findById(req.user.id).select("-password"); // Exclude password
    if (!user) {
      return res.status(404).json({ message: "Admin user not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching admin user info:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// POST /api/user/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("Incoming request to /login:", req.body);

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found for email:", email);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    console.log("User found:", user);

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log("Password valid:", isPasswordValid);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    let doctor_id = null;

    const doctor = await Doctor.findOne({ user_id: user._id });
    if (user.role === "doctor") {
      const doctor = await Doctor.findOne({ user_id: user._id });
      console.log("Doctor found:", doctor);

      if (!doctor) {
        return res.status(404).json({ message: "Doctor profile not found." });
      }
      if (!doctor.status === "approved") {
        return res.status(403).json({ message: "Account pending approval." });
      }
      doctor_id = doctor._id; // Add doctor_id to the response
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({
      message: "Login successful",
      token,
      role: user.role,
      doctor_id: user.role === "doctor" ? doctor._id : undefined,
      patient_id: user.role === "patient" ? user._id : undefined,
    });
  } catch (err) {
    console.error("Error in /login route:", err.message, err.stack);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Email/Password Signup
router.post("/signup", async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create the user
    const newUser = new User({ name, email, password: hashedPassword, role });
    await newUser.save();

    // If the user role is 'patient', also add to the `patients` collection
    if (role === "patient") {
      const newPatient = new Patient({
        _id: newUser._id, // Use the same ID as the user
        name: newUser.name,
        email: newUser.email,
        created_at: new Date(),
      });
      await newPatient.save();
    }

    // Respond with success
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

router.get("/admin-dashboard", authMiddleware, (req, res) => {
  res.json({ message: "Welcome to the Admin Dashboard" });
});
// Google OAuth (Add to passport configuration)
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.redirect(`http://localhost:3000/dashboard?token=${token}`);
  }
);

module.exports = router;
