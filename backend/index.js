// backend/ index.js 

const express = require("express");
const dotenv = require("dotenv");
const passport = require("passport");
const connectDB = require("./config/db");
const userRoutes = require("./routes/User");
const adminRoutes = require("./routes/adminRoutes"); // Import Admin Routes
const cors = require("cors");



// Load environment variables
dotenv.config();

// Initialize database

connectDB();

// Initialize app
const app = express();
/*
app.use(
  cors({
    origin: "http://localhost:3000", // Allow requests from your frontend
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // Include credentials if necessary
  })
);
*/
// Allow requests from your frontend origin (CORS middleware MUST come before routes)
app.use(
  cors({
      origin: "http://localhost:3000", // Frontend URL
      credentials: true, // Include credentials like cookies if needed
  })
);

// Set headers manually (optional but ensures preflight checks pass)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

// Preflight request handling for all routes
app.options("*", cors());

// Middleware
app.use(express.json());
require("./config/passport")(passport);

// Routes
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes); // Register Admin Routes here

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
