// controllers / adminController 

const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const User = require('../models/User');

// Admin Dashboard Overview
exports.getDashboardOverview = async (req, res) => {
  try {
    // Fetch the total number of appointments, doctors, and patients
    const totalAppointments = await Appointment.countDocuments();
    const totalDoctors = await Doctor.countDocuments();
    const totalPatients = await Patient.countDocuments();

    // Fetch recent appointments (you can adjust the limit if needed)
    const appointments = await Appointment.find()
      .populate('doctor', 'name specialization')  // Populate doctor info
      .populate('patient', 'name')  // Populate patient info
      .limit(5)  // Fetch the latest 5 appointments
      .sort({ date: -1 });  // Sort by date in descending order

    // Return the data
    res.status(200).json({
      success: true,
      data: {
        totalAppointments,
        totalDoctors,
        totalPatients,
        appointments,  // Include the fetched appointments
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// POST Route to Add a New User (Doctor)
exports.addUser = async (req, res) => {
  try {
    // Extracting data from request body
    const { name, email, password } = req.body;

    // Create the User document
    const newUser = new User({
      name,
      email,
      password,
      role: 'doctor', // Role is fixed to 'doctor'
    });

    // Save the User and handle errors
    const savedUser = await newUser.save();

    console.log("New User Created: ", savedUser); // Debugging

    // Send the response back
    res.status(201).json({
      success: true,
      message: 'User created successfully!',
      data: savedUser,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};

// POST Route to Add a Doctor (Doctor has to exist already)

// POST Route to Add a Doctor (Doctor has to exist already)
exports.addDoctor = async (req, res) => {
  try {
    // Extracting data from request body
    const { user_id, specialization, experience } = req.body;

    // Check if user exists
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Create the Doctor document
    const newDoctor = new Doctor({
      user_id: user._id, // Link to the existing user
      specialization,
      experience,
      appointments: [], // You can add appointments later
    });

    // Save the Doctor document
    const savedDoctor = await newDoctor.save();

    console.log("New Doctor Created: ", savedDoctor); // Debugging

    // Send the response back
    res.status(201).json({
      success: true,
      message: 'Doctor added successfully!',
      data: savedDoctor,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};
// POST Route to Add a New Patient (Patient has to exist already)


exports.addPatient = async (req, res) => {
  try {
    const { user_id, date_of_birth, gender, contact_number, medical_history } = req.body;

    // Check if user exists
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Create the Patient document
    const newPatient = new Patient({
      user_id: user._id,
      date_of_birth,
      gender,
      contact_number,
      medical_history: Array.isArray(medical_history) ? medical_history : [],
      appointments: []
    });

    // Save the Patient document
    const savedPatient = await newPatient.save();

    console.log("New Patient Created: ", savedPatient); // Debugging

    res.status(201).json({
      success: true,
      message: 'Patient added successfully!',
      data: savedPatient,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};


// POST Route to Add a New Appointment
exports.addAppointment = async (req, res) => {
  try {
    const { doctor_id, patient_id, date, time, status, notes } = req.body;

    // Check if doctor exists
    const doctor = await Doctor.findById(doctor_id);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found',
      });
    }

    // Check if patient exists
    const patient = await Patient.findById(patient_id);
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found',
      });
    }

    // Create the Appointment document
    const newAppointment = new Appointment({
      doctor_id,
      patient_id,
      date,
      time,
      status,
      notes
    });

    // Save the Appointment document
    const savedAppointment = await newAppointment.save();

    // Add appointment to doctor's appointments array
    doctor.appointments.push(savedAppointment._id);
    await doctor.save();

    // Add appointment to patient's appointments array
    patient.appointments.push(savedAppointment._id);
    await patient.save();

    console.log("New Appointment Created: ", savedAppointment); // Debugging

    // Send the response back
    res.status(201).json({
      success: true,
      message: 'Appointment added successfully!',
      data: savedAppointment,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};
