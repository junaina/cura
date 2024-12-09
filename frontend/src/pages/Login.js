import React, { useState } from "react";
import axios from "axios";
import "../styles/Login.css"; // Using Login-specific styles
import googleLogo from "../assets/register-page/google-logo.png"; // Update the path if necessary

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // Clear error message on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/user/login",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      alert("Login successful!");
      console.log("JWT Token:", response.data.token);

      // Store the token and role in local storage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);
      if (response.data.role === "patient") {
        localStorage.setItem("patient_id", response.data.patient_id); // Store the patient_id from the backend
      }
      if (response.data.role === "doctor") {
        localStorage.setItem("doctor_id", response.data.doctor_id); // Store doctor ID
      }
      // Redirect based on role
      if (response.data.role === "admin") {
        window.location.href = "/admin-dashboard";
      } else if (response.data.role === "doctor") {
        window.location.href = "/doctor-dashboard";
      } else {
        window.location.href = "/patient-home";
      }
    } catch (error) {
      setError(error.response?.data?.message || "Login failed");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/api/users/google"; // Replace with your Google OAuth endpoint
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <h1 className="login-header">Log In</h1>
        <p className="login-subheader">
          New User?{" "}
          <a href="/signup" className="signup-link">
            Sign Up
          </a>
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit" className="login-button">
            Log In
          </button>
          {error && <p className="login-error">{error}</p>}
        </form>
        <a href="/forgot-password" className="forgot-password-link">
          Forgot Password?
        </a>
        <div className="login-divider">
          <hr />
          <span>OR</span>
          <hr />
        </div>

        <button className="google-login-btn" onClick={handleGoogleLogin}>
          <img src={googleLogo} alt="Google Icon" />
          Continue with Google
        </button>
      </div>
      <div className="login-right">
        <div className="logo-wrapper">
          <hr className="logo-line" />
          <h1 className="login-logo">cura</h1>
          <p className="login-tagline">
            healthcare<br></br> on the go!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
