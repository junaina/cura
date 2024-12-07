import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import DoctorSignup from "./pages/DoctorSignup";
import Login from "./pages/Login";
import "./styles/App.css";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword"; // Import ResetPassword component

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          {/* Signup page */}
          <Route path="/signup" element={<Signup />} />

          {/* Dashboard (post-login redirection) */}

          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/doctorSignup" element={<DoctorSignup />} />
          <Route path="/login" element={<Login />} />
          {/* Default route */}
          <Route path="*" element={<Signup />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
