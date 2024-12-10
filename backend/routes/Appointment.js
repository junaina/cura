const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment");
const adminAuthMiddleware = require("../middlewares/adminauth"); // Ensure correct import
const Patient = require("../models/Patient"); // Add this import
const Doctor = require("../models/Doctor"); // Ensure the Doctor model is imported
const Availability = require("../models/Availability");

// Endpoint to fetch all appointments (Admins only)
router.get("/all", adminAuthMiddleware, async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate({
        path: "doctor_id",
        select: "user_id specialization",
        populate: { path: "user_id", select: "name" },
      })
      .populate({ path: "patient_id", select: "name" })
      .sort({ date: 1, time: 1 }); // Sort by date and time

    res.json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
// router.get("/doctor/:id", async (req, res) => {
//   try {
//     const doctor = await Doctor.findById(req.params.id); // Find doctor by ID
//     if (!doctor) {
//       return res.status(404).json({ message: "Doctor not found" });
//     }
//     res.json(doctor);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// });
// Route for creating an appointment
router.post("/", async (req, res) => {
  const { doctor_id, patient_id, date, time } = req.body;

  if (!doctor_id || !patient_id || !date || !time) {
    return res.status(400).json({ msg: "Missing required fields" });
  }

  try {
    const newAppointment = new Appointment({
      doctor_id,
      patient_id,
      date,
      time,
      status: "pending",
    });

    const savedAppointment = await newAppointment.save();
    // Update the doctor's appointments array
    await Doctor.findByIdAndUpdate(
      doctor_id,
      { $push: { appointments: savedAppointment._id } }, // Push the new appointment ID
      { new: true, useFindAndModify: false } // Return updated document, disable deprecation warnings
    );

    res.status(201).json(savedAppointment);
  } catch (err) {
    console.error("Error creating appointment:", err);
    res.status(500).json({ msg: "Error creating appointment" });
  }
});
router.get("/doctor/:id", async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
      .populate({
        path: "appointments", // Populate the appointments field
        populate: {
          path: "patient_id", // Populate patient details inside each appointment
          select: "name email", // Specify the fields you want from the patient
        },
      })
      .populate("availability");

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.json(doctor);
  } catch (err) {
    console.error("Error fetching doctor details:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/doctor-appointments", async (req, res) => {
  console.log("Appointments API hit with doctorId:", req.query.doctorId);

  const doctorId = req.query.doctorId; // Fetch doctor ID from query params

  if (!doctorId) {
    return res.status(400).json({ msg: "Doctor ID is required" });
  }

  try {
    const appointments = await Appointment.find({ doctor_id: doctorId })
      .populate({
        path: "patient_id", // Populate patient details from Patient schema
        populate: {
          path: "_id", // Populate user details from User schema
          model: "User", // Specify the model name
          select: "name email", // Fetch name and email from User schema
        },
      })
      .sort({ date: 1, time: 1 }); // Sort appointments by date and time
    if (!appointments.length) {
      return res.status(200).json([]); // Return empty array with 200 OK
    }
    console.log("Fetched Appointments:", appointments);

    // Transform data to include patient name directly in the response
    const formattedAppointments = appointments.map((appointment) => ({
      ...appointment.toObject(),
      patient_name: appointment.patient_id._id.name, // Access patient's user name
      patient_email: appointment.patient_id._id.email, // Access patient's user email
    }));
    console.log("Formatted Appointments:", formattedAppointments);
    if (!appointments.length) {
      console.log("No appointments found for this doctor.");
      return res
        .status(404)
        .json({ msg: "No appointments found for this doctor." });
    }
    res.status(200).json(formattedAppointments);
  } catch (err) {
    console.error("Error fetching appointments:", err);
    res
      .status(500)
      .json({ msg: "Server error. Unable to fetch appointments." });
  }
});
//for patients panel
router.get("/patient-appointments/:patientId", async (req, res) => {
  const patientId = req.params.patientId;

  if (!patientId) {
    return res.status(400).json({ message: "Patient ID is required." });
  }

  try {
    const appointments = await Appointment.find({ patient_id: patientId })
      .populate({
        path: "doctor_id",
        select: "user_id specialization",
        populate: { path: "user_id", select: "name email" },
      }) // Populate doctor and user details
      .sort({ date: 1, time: 1 }); // Sort by date and time

    if (!appointments.length) {
      return res.status(200).json([]); // Return an empty array if no appointments
    }

    res.status(200).json(appointments);
  } catch (error) {
    console.error("Error fetching patient appointments:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

router.put("/reschedule/:id", async (req, res) => {
  const { id } = req.params; // Appointment ID
  const { date, startTime, endTime } = req.body; // New date and times

  if (!date || !startTime || !endTime) {
    return res
      .status(400)
      .json({ message: "Date, start time, and end time are required." });
  }

  try {
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    appointment.date = date;
    appointment.time = `${startTime} - ${endTime}`;
    await appointment.save();

    res
      .status(200)
      .json({ message: "Appointment rescheduled successfully.", appointment });
  } catch (err) {
    console.error("Error rescheduling appointment:", err);
    res.status(500).json({ message: "Server error." });
  }
});

router.put("/cancel/:id", async (req, res) => {
  const { id } = req.params; // Appointment ID

  try {
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    appointment.status = "cancelled";
    await appointment.save();

    res
      .status(200)
      .json({ message: "Appointment cancelled successfully.", appointment });
  } catch (err) {
    console.error("Error cancelling appointment:", err);
    res.status(500).json({ message: "Server error." });
  }
});

// Update appointment status
router.put("/update-status/:id", async (req, res) => {
  const { id } = req.params; // Appointment ID
  const { status } = req.body; // New status

  if (!status) {
    return res.status(400).json({ message: "Status is required" });
  }

  try {
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    appointment.status = status;
    await appointment.save();

    res
      .status(200)
      .json({ message: `Appointment ${status} successfully`, appointment });
  } catch (err) {
    console.error("Error updating appointment status:", err);
    res.status(500).json({ message: "Server error" });
  }
});
module.exports = router;
