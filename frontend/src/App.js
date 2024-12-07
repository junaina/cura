import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Signup from "./pages/Signup";
import DoctorSignup from "./pages/DoctorSignup";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AdminDashboard from "./pages/AdminDashboard"; // Import AdminDashboard
import DoctorDashboard from "./pages/DoctorDashboard"; // Import DoctorDashboard
import PatientDashboard from "./pages/PatientDashboard"; // Import PatientDashboard
import "./styles/App.css";

const App = () => {
  // Function to get the current user's role from localStorage
  const getRole = () => {
    return localStorage.getItem("role");
  };

  return (
    <Router>
      <div>
        <Routes>
          {/* Public Routes */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/doctorSignup" element={<DoctorSignup />} />

          {/* Role-Based Routes */}
          <Route
            path="/admin-dashboard"
            element={
              getRole() === "admin" ? (
                <AdminDashboard />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/doctor-dashboard"
            element={
              getRole() === "doctor" ? (
                <DoctorDashboard />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/patient-dashboard"
            element={
              getRole() === "patient" ? (
                <PatientDashboard />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* Default Route */}
          <Route path="*" element={<Navigate to="/signup" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
