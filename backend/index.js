const express = require("express");
const dotenv = require("dotenv");
const passport = require("passport");
const connectDB = require("./config/db");
const userRoutes = require("./routes/User");
const doctorRoutes = require("./routes/Doctor"); // Import Doctor routes
const appointmentRoutes = require("./routes/Appointment"); // Import Appointment routes
const patientRoutes = require("./routes/Patient"); // Adjust path if needed
const cors = require("cors");
const forgotPasswordRoutes = require("./routes/ForgotPassword");
const doctorSearchRoutes = require("./routes/doctorSearch"); // Import the doctor search routes

// Load environment variables
dotenv.config();

// Initialize database
connectDB();

// Initialize app
const app = express();

app.use(
  cors({
    origin: "http://localhost:3000", // Allow requests from your frontend
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // Include credentials if necessary
  })
);

// Middleware
app.use(express.json());
require("./config/passport")(passport);
app.use((req, res, next) => {
  console.log(`Request received: ${req.method} ${req.path}`);
  next();
});

app.use("/api/doctors", doctorRoutes); // Add Doctor routes

// Routes
app.use("/api/users", userRoutes);
app.use("/api/user", userRoutes); // This registers all routes from User.js under /api/user

app.use("/api/user", forgotPasswordRoutes);
app.use("/api/appointments", appointmentRoutes); // Route prefix
app.use("/api/appointments", require("./routes/Appointment"));
app.use("/api/patients", patientRoutes); //this is for patient routes in the admin dashboard, not related to patient dashboard
app.use("/api/patientSearch", require("./routes/doctorSearch"));
app.use("/api/doctor", doctorSearchRoutes); // This should match the `GET /api/doctor/:id` route

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
