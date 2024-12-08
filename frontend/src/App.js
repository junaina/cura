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
import PatientHome from "./pages/PatientHome"; // Import PatientDashboard
import DoctorApplications from "./pages/DoctorApplications"; // Import DoctorApplications
import ManageDoctors from "./components/ManageDoctors"; // Import ManageDoctors component
import ManagePatients from "./pages/ManagePatients"; // Import ManagePatients component

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
            path="/patient-home"
            element={
              getRole() === "patient" ? (
                <PatientHome />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/manage-doctors"
            element={
              getRole() === "admin" ? (
                <DoctorApplications />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          {/* Route for Manage Doctors */}
          <Route
            path="/doctor-management"
            element={
              getRole() === "admin" ? (
                <ManageDoctors />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* Route for Manage Doctors */}
          <Route
            path="/manage-patient-records"
            element={
              getRole() === "admin" ? (
                <ManagePatients />
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
