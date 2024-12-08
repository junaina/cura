const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Doctor = require("../models/Doctor");
const Availability = require("../models/Availability");
const adminAuth = require("../middlewares/adminauth");
const Appointment = require("../models/Appointment");
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
      status: "pending", // Default status for new doctor applications
    });
    await newDoctor.save();
    console.log("here");
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
// Route to fetch pending doctor applications
router.get("/pending", adminAuth, async (req, res) => {
  try {
    const pendingDoctors = await Doctor.find({
      status: "pending", // Fetch pending doctors
    })
      .populate("user_id", "name email") // Populate user details
      .lean(); // Converts MongoDB documents to plain JavaScript objects

    // Fetch availability for each doctor
    const doctorIds = pendingDoctors.map((doc) => doc._id);
    const availabilities = await Availability.find({
      doctor_id: { $in: doctorIds },
    }).lean();

    // Merge availability data with doctors
    const doctorsWithAvailability = pendingDoctors.map((doc) => {
      doc.availability = availabilities.filter(
        (avail) => String(avail.doctor_id) === String(doc._id)
      );
      return doc;
    });

    res.json(doctorsWithAvailability);
  } catch (err) {
    console.error("Error fetching pending doctors:", err);
    res.status(500).json({ message: "Failed to fetch doctor applications" });
  }
});

router.put("/:id/status", adminAuth, async (req, res) => {
  const { status } = req.body; // Use 'status' instead of 'isApproved'
  console.log("Incoming status:", status);

  if (!["approved", "rejected"].includes(status)) {
    return res.status(400).json({
      message: "Invalid status value. Must be 'approved' or 'rejected'.",
    });
  }

  try {
    const updatedDoctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      { status }, // Set the new status
      { new: true } // Return the updated document
    );
    console.log("Updated doctor:", updatedDoctor);

    // If doctor not found
    if (!updatedDoctor) {
      return res.status(404).json({ message: "Doctor not found." });
    }

    res.json({
      message: "Doctor status updated successfully",
      updatedDoctor,
    });
  } catch (err) {
    console.error("Error updating doctor status:", err);
    res.status(500).json({ message: "Failed to update doctor status" });
  }
});
// Fetch all approved doctors
// Fetch all approved doctors with name and email
// Fetch all approved doctors with availability and appointments
// Fetch all approved doctors with availability and appointments
router.get("/approved", async (req, res) => {
  try {
    // Fetch approved doctors
    const approvedDoctors = await Doctor.find({ status: "approved" })
      .populate("user_id", "name email")
      .lean();

    // Fetch availability for approved doctors
    const doctorIds = approvedDoctors.map((doc) => doc._id);
    const availabilities = await Availability.find({
      doctor_id: { $in: doctorIds },
    }).lean();

    // Merge availability into doctors
    const doctorsWithAvailability = approvedDoctors.map((doc) => {
      doc.availability = availabilities.filter(
        (avail) => String(avail.doctor_id) === String(doc._id)
      );
      return doc;
    });

    console.log("Doctors with Availability Merged:", doctorsWithAvailability);

    res.status(200).json(doctorsWithAvailability);
  } catch (err) {
    console.error("Error fetching approved doctors:", err);
    res.status(500).json({ message: "Failed to fetch approved doctors" });
  }
});

// Fetch doctors filtered by specialization (with name and email)
// Fetch doctors filtered by specialization (with name and email)
router.get("/", async (req, res) => {
  try {
    const { specialization } = req.query; // Extract specialization filter
    const filter = { status: "approved" }; // Default filter: approved doctors

    if (specialization) {
      filter.specialization = specialization; // Add specialization filter if provided
    }

    // Fetch doctors based on the filter
    const doctors = await Doctor.find(filter)
      .populate("user_id", "name email") // Populate user details (name and email)
      .populate("specialization") // Optionally, populate specialization
      .lean(); // Convert documents to plain JavaScript objects

    console.log("Doctors Fetched:", doctors); // Debug log to check fetched doctors

    // Fetch availability for the filtered doctors
    const doctorIds = doctors.map((doc) => doc._id);
    const availabilities = await Availability.find({
      doctor_id: { $in: doctorIds },
    }).lean();

    console.log("Availabilities Fetched:", availabilities); // Debug log for availability

    // Fetch appointments for the filtered doctors
    const appointments = await Appointment.find({
      doctor_id: { $in: doctorIds },
    }).lean();

    console.log("Appointments Fetched:", appointments); // Debug log for appointments

    // Merge availability and appointments into the doctors data
    const doctorsWithAvailabilityAndAppointments = doctors.map((doc) => {
      doc.availability = availabilities.filter(
        (avail) => String(avail.doctor_id) === String(doc._id)
      );
      doc.appointments = appointments.filter(
        (appoint) => String(appoint.doctor_id) === String(doc._id)
      );
      return doc;
    });

    console.log(
      "Doctors with Merged Availability and Appointments:",
      doctorsWithAvailabilityAndAppointments
    ); // Debug log for merged data

    // Return the merged data
    res.status(200).json(doctorsWithAvailabilityAndAppointments);
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).json({ message: "Error fetching doctors", error });
  }
});

// Fetch doctor details along with name, email, availability, and appointments
router.get("/:id", async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
      .populate("user_id", "name email") // Populate user details (name and email)
      .populate("specialization") // Optionally, populate specialization
      .populate("appointments") // Populate appointments
      .populate("availability"); // Populate availability slots

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.status(200).json(doctor);
  } catch (error) {
    res.status(500).json({ message: "Error fetching doctor details", error });
  }
});

// Update a doctor
router.put("/:id", async (req, res) => {
  try {
    const updatedDoctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedDoctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    res.status(200).json(updatedDoctor);
  } catch (error) {
    res.status(500).json({ message: "Error updating doctor", error });
  }
});

// Delete a doctor
router.delete("/:id", async (req, res) => {
  try {
    const deletedDoctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!deletedDoctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    res.status(200).json({ message: "Doctor deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting doctor", error });
  }
});

module.exports = router;
