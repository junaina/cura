const express = require("express");
const dotenv = require("dotenv");
const passport = require("passport");
const connectDB = require("./config/db");
const userRoutes = require("./routes/User");
const cors = require("cors");

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

// Routes
app.use("/api/users", userRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
