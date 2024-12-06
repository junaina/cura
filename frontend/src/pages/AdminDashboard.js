import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import "../styles/AdminDashboard.css";

const AdminDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    // Fetch appointments data
    const fetchAppointments = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/admin/appointments?page=${currentPage}`);
        const data = await response.json();

        if (data.success) {
          setAppointments(data.appointments);
          setTotalPages(data.totalPages);
        }
      } catch (err) {
        console.error("Error fetching appointments", err);
      }
    };

    fetchAppointments();
  }, [currentPage]);

  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="admin-dashboard">
      <Navbar />
      <div className="main-content">
        <div className="welcome-section">
          <div className="profile-section">
            <div className="profile-pic">
              <img src="path/to/admin-profile.jpg" alt="Admin Profile" />
            </div>
            <div className="hello-admin">
              <h2>Good Morning, Admin!</h2>
              <p>Welcome back to your dashboard</p>
              <p className="date">{formattedDate}</p>
            </div>
          </div>
          <div className="appointments">
            <h2>Approve Doctors Application</h2>
            <button>Let's Go</button>
          </div>
        </div>

        {/* Blue container wrapper */}
        <div className="appointments-container">
          {/* White inner container */}
          <div className="appointments-table-section">
            <h2>All Appointments</h2>
            <div className="appointments-table">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Patient</th>
                    <th>Doctor</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((appointment, index) => (
                    <tr key={index}>
                      <td>{new Date(appointment.date).toLocaleDateString()}</td>
                      <td>{appointment.time}</td>
                      <td>{appointment.patient_name}</td>
                      <td>{appointment.doctor_name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="pagination">
              <button 
                onClick={handlePrevPage} 
                disabled={currentPage === 1}
                className="pagination-button"
              >
                ← Prev
              </button>
              <span className="page-info">Page {currentPage}/{totalPages}</span>
              <button 
                onClick={handleNextPage} 
                disabled={currentPage === totalPages}
                className="pagination-button"
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

