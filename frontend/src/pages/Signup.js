import React, { useState } from "react";
import image2 from "../assets/register-page/google-logo.png";
import axios from "axios";
import "../styles/Signup.css";
import { doctorSignup } from "../pages/DoctorSignup";

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "patient", // default role
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Combine firstName and lastName into a single name field
    const payload = {
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      email: formData.email,
      password: formData.password,
      role: formData.role, // Include role in the payload
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/signup",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      alert(response.data.message);
    } catch (error) {
      alert(error.response?.data?.message || "Signup failed");
    }
  };

  const handleGoogleSignup = () => {
    window.location.href = "http://localhost:5000/api/users/google";
  };

  return (
    <div className="signup-container">
      <div className="signup-left">
        <a href="doctorSignup" className="doctor-link">
          Sign Up as a Doctor
        </a>
        <h1 className="signup-header">Sign Up</h1>
        <p className="signup-subheader">
          Already a Member?{" "}
          <a href="/login" className="login-link">
            Log In
          </a>
        </p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="lastName"
              className="last-name"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
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
          <button type="submit" className="signup-button">
            Sign Up
          </button>
        </form>
        <div className="divider">
          <hr />
          <span>OR</span>
          <hr />
        </div>
        <button className="google-btn" onClick={handleGoogleSignup}>
          <img src={image2} alt="Google Icon" />
          Continue with Google
        </button>
      </div>
      <div className="signup-right">
        <div className="logo-wrapper">
          <hr className="logo-line" />
          <h1 className="signup-logo">cura</h1>
          <p className="signup-tagline">
            healthcare<br></br> on the go!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
