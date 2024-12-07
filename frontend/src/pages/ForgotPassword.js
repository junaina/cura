import React, { useState } from "react";
import "../styles/ForgotPassword.css";
import axios from "axios";
// Reusing the same styling file for consistency

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send a POST request to the server with the entered email
      const response = await axios.post(
        "http://localhost:5000/api/user/forgot-password",
        {
          email,
        }
      );

      // Success: Display a success message
      setMessage(response.data.message);
      setError("");
    } catch (err) {
      // Error: Display the error message
      setError(err.response?.data?.message || "Something went wrong!");
      setMessage("");
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-left">
        <h1>Forgot Your Password?</h1>
        <p>Enter your email address to receive a password reset link</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-submit">
            Send Reset Link
          </button>
        </form>
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
      </div>
      <div className="forgot-password-right">
        <div className="logo-wrapper">
          <hr className="logo-line" />
          <h1 className="forgot-password-logo">cura</h1>
          <p className="forgot-password-tagline">
            healthcare<br></br> on the go!
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
