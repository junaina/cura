import React from "react";
import GreetingCard from "../components/GreetingCard";
import Navbar from "../components/Navbar";
import ApproveDoctorApplicationsCard from "../components/ApproveDrApplicationsCard";
import AppointmentTable from "../components/AppointmentTable"; // Import AppointmentTable
import "../styles/AdminDashboard.css";

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <Navbar />
      <div className="dashboard-content">
        <GreetingCard />
        <div className="card-container">
          <ApproveDoctorApplicationsCard />
        </div>
      </div>
      <div className="appointment-table-wrapper">
        <AppointmentTable />
      </div>
    </div>
  );
};

export default AdminDashboard;
