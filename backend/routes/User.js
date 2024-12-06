const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const passport = require("passport");
const User = require("../models/User");
const Doctor = require("../models/Doctor");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;
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

    if (user.role === "doctor") {
      const doctor = await Doctor.findOne({ user_id: user._id });
      console.log("Doctor found:", doctor);

      if (!doctor) {
        return res.status(404).json({ message: "Doctor profile not found." });
      }
      if (!doctor.isApproved) {
        return res.status(403).json({ message: "Account pending approval." });
      }
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({
      message: "Login successful",
      token,
      role: user.role,
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
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already in use" });

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({ name, email, password: hashedPassword, role });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error. Please try again later." });
  }
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
