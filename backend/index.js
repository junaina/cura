const express = require("express");
const dotenv = require("dotenv");
const passport = require("passport");
const connectDB = require("./config/db");
const userRoutes = require("./routes/User");
const doctorRoutes = require("./routes/Doctor"); // Import Doctor routes

const cors = require("cors");
const forgotPasswordRoutes = require("./routes/ForgotPassword");

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

app.use("/api/doctor", doctorRoutes); // Add Doctor routes

// Routes
app.use("/api/users", userRoutes);
app.use("/api/user", userRoutes); // This registers all routes from User.js under /api/user

app.use("/api/user", forgotPasswordRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
