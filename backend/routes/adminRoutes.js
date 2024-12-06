const express = require('express');
const { 
  getDashboardOverview, 
  addDoctor, 
  addUser, 
  addPatient,
  addAppointment
} = require('../controllers/adminController');
const router = express.Router();

// Admin Dashboard Route
router.get('/dashboard', getDashboardOverview);

// POST Route to Add a New User
router.post('/addUser', addUser);

// POST Route to Add a New Doctor
router.post('/addDoctor', addDoctor);

// POST Route to Add a New Patient
router.post('/addPatient', addPatient);

// POST Route to Add a New Appointment
router.post('/addAppointment', addAppointment);

module.exports = router;