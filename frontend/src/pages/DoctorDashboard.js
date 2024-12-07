import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/DoctorDashboard.css";

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const doctorId = "6753020dba72ccdeeaffe75c"; // Replace with logged-in doctor's ID

  // Fetch appointments on component mount
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(`/api/doctor/${doctorId}/appointments`);
        setAppointments(response.data.appointments);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, [doctorId]);

  // Handle updating appointment status
  const handleStatusChange = async (appointmentId, status) => {
    try {
      await axios.patch(`/api/doctor/appointments/${appointmentId}`, { status });
      // Update the local appointments state
      setAppointments((prev) =>
        prev.map((appt) =>
          appt._id === appointmentId ? { ...appt, status } : appt
        )
      );
      setPopupVisible(false);
    } catch (error) {
      console.error("Error updating appointment status:", error);
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h1>Cura</h1>
        <button onClick={() => alert("Manage Appointments clicked")}>
          Manage Appointments
        </button>
        <button onClick={() => alert("Manage Availability clicked")}>
          Manage Availability
        </button>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <h2>Your Appointments</h2>
        <div className="appointments-container">
          {appointments.map((appointment) => (
            <div key={appointment._id} className="appointment-card">
              <div className="appointment-info">
                {/* Patient Name */}
                {appointment.patient?.name && <h3>{appointment.patient.name}</h3>}

                {/* Patient Age */}
                {appointment.patient?.age && <p>Age: {appointment.patient.age}</p>}

                {/* Patient Condition */}
                {appointment.patient?.health_condition && (
                  <p>Condition: {appointment.patient.health_condition}</p>
                )}

                {/* Appointment Date and Time */}
                <p>Date: {new Date(appointment.date).toDateString()}</p>
                <p>Time: {appointment.time}</p>

                {/* Appointment Status */}
                <p>Status: {appointment.status}</p>
              </div>
              <div className="appointment-actions">
                <button
                  onClick={() => {
                    setSelectedAppointment(appointment);
                    setPopupVisible(true);
                  }}
                >
                  Update Status
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Status Update Popup */}
        {popupVisible && selectedAppointment && (
          <div className="popup">
            <h3>Update Appointment Status</h3>
            <button
              onClick={() =>
                handleStatusChange(selectedAppointment._id, "completed")
              }
            >
              Mark as Completed
            </button>
            <button
              onClick={() =>
                handleStatusChange(selectedAppointment._id, "rescheduled")
              }
            >
              Reschedule
            </button>
            <button
              className="close-btn"
              onClick={() => setPopupVisible(false)}
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;
