const express = require("express");
const path = require("path");
const connectDB = require("./config/db"); // Import the database connection function
require("dotenv").config(); // Load environment variables

const app = express();

// Connect to the database
connectDB();

// Middleware
app.use(express.json());

// API Routes (Define these before serving the React app)
app.get("/api/message", (req, res) => {
  res.send("Welcome to the Backend!");
});

// Serve React App (Static Files)
app.use(express.static(path.join(__dirname, "frontend/build")));

// Catch-All Route for React App
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend/build", "index.html"));
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
