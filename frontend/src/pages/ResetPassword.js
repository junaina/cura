import React, { useState } from "react";
import axios from "axios";
import "../styles/ResetPassword.css"; // Using a separate ResetPassword-specific stylesheet
import { useParams } from "react-router-dom";

const ResetPassword = () => {
  const { token } = useParams(); // Extract the token from the URL

  console.log("Reset Token:", token); // Debug the token
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // Clear error message on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("API Call Token:", token); // Debug the token before the API call

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:5000/api/user/reset-password/${token}`,
        { newPassword: formData.newPassword },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setMessage("Password reset successful!");
      setError("");
      setTimeout(() => {
        window.location.href = "/login";
      }, 3000);
    } catch (error) {
      setError(error.response?.data?.message || "Password reset failed.");
    }
  };

  return (
    <div className="reset-password-container">
      <div className="reset-password-left">
        <h1 className="reset-password-header">Reset Password</h1>
        <p className="reset-password-subheader">
          Please enter your new password below.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            name="newPassword"
            placeholder="New Password"
            value={formData.newPassword}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          <button type="submit" className="reset-password-button">
            Reset Password
          </button>
          {message && <p className="reset-password-success">{message}</p>}
          {error && <p className="reset-password-error">{error}</p>}
        </form>
      </div>
      <div className="reset-password-right">
        <div className="logo-wrapper">
          <hr className="logo-line" />
          <h1 className="reset-password-logo">cura</h1>
          <p className="reset-password-tagline">
            healthcare<br></br> on the go!
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
