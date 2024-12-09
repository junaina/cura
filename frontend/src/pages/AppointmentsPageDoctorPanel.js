import React, { useState, useEffect } from "react";
import axios from "axios";
import NavbarForDoctor from "../components/NavbarForDoctor"; // Import the NavbarForDoctor component
import "../styles/AppointmentsPage.css"; // Your CSS for styling the layout

const AppointmentsPageDoctorPanel = () => {
  const [appointments, setAppointments] = useState([]); // State to store appointments
  const [currentPage, setCurrentPage] = useState(1); // Current page state
  const [appointmentsPerPage] = useState(4); // Number of appointments per page
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state for any API calls

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const doctorId = localStorage.getItem("doctor_id"); // Get doctor ID from localStorage
        if (!doctorId) {
          setError("Doctor ID is missing in localStorage.");
          return;
        }

        // Fetch appointments for the doctor
        const appointmentsResponse = await axios.get(
          `http://localhost:5000/api/appointments/doctor-appointments?doctorId=${doctorId}`
        );
        // Filter out completed or cancelled appointments
        const activeAppointments = appointmentsResponse.data.filter(
          (appointment) =>
            appointment.status !== "completed" &&
            appointment.status !== "cancelled"
        );
        setAppointments(activeAppointments);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching appointments:", err);
        setError("Error fetching appointments.");
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  // Pagination logic
  const indexOfLastAppointment = currentPage * appointmentsPerPage;
  const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
  const currentAppointments = appointments.slice(
    indexOfFirstAppointment,
    indexOfLastAppointment
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle appointment actions
  const handleAction = async (appointment, actionType) => {
    console.log(`Action: ${actionType}, Appointment:`, appointment);
    let newStatus;
    switch (actionType) {
      case "view":
        alert(`
          Appointment Details:
          Patient: ${appointment.patient_name}
          Date: ${appointment.date}
          Time: ${appointment.time}
          Status: ${appointment.status}
        `);
        return;
      case "confirm":
        newStatus = "confirmed";
        break;
      case "cancel":
        newStatus = "cancelled";
        break;
      case "markcompleted":
        newStatus = "completed";
        break;
      default:
        console.error("Invalid action type");
        return;
    }
    try {
      const response = await axios.put(
        `http://localhost:5000/api/appointments/update-status/${appointment._id}`,
        { status: newStatus }
      );
      alert(response.data.message); // Show success message

      if (actionType === "cancel" || actionType === "markcompleted") {
        setAppointments((prevAppointments) =>
          prevAppointments.filter((appt) => appt._id !== appointment._id)
        );
      } else {
        // Update the local state to reflect the status change for other actions
        setAppointments((prevAppointments) =>
          prevAppointments.map((appt) =>
            appt._id === appointment._id ? { ...appt, status: newStatus } : appt
          )
        );
      }
    } catch (err) {
      console.error("Error updating appointment:", err);
      alert("Failed to update appointment. Please try again.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="appointments-page">
      <div className="appointments-page">
        <NavbarForDoctor />
        <div className="appointments-content">
          <h3>Appointments</h3>
          {appointments.length > 0 ? (
            <>
              <table className="appointments-table">
                <thead>
                  <tr>
                    <th>Patient Name</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentAppointments.map((appointment) => (
                    <tr key={appointment._id}>
                      <td>{appointment.patient_name}</td>
                      <td>{appointment.date}</td>
                      <td>{appointment.time}</td>
                      <td>{appointment.status}</td>
                      <td>
                        <button
                          className="btn-action view"
                          onClick={() => handleAction(appointment, "view")}
                        >
                          View
                        </button>
                        <button
                          className="btn-action confirm"
                          onClick={() => handleAction(appointment, "confirm")}
                        >
                          Confirm
                        </button>
                        <button
                          className="btn-action cancel"
                          onClick={() => handleAction(appointment, "cancel")}
                        >
                          Cancel
                        </button>
                        <button
                          className="btn-action markcompleted"
                          onClick={() =>
                            handleAction(appointment, "markcompleted")
                          }
                        >
                          Mark Completed
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Pagination
                appointmentsPerPage={appointmentsPerPage}
                totalAppointments={appointments.length}
                paginate={paginate}
              />
            </>
          ) : (
            <p>No appointments found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

const Pagination = ({ appointmentsPerPage, totalAppointments, paginate }) => {
  const pageNumbers = [];

  for (
    let i = 1;
    i <= Math.ceil(totalAppointments / appointmentsPerPage);
    i++
  ) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul className="pagination">
        {pageNumbers.map((number) => (
          <li key={number} className="page-item">
            <button onClick={() => paginate(number)} className="page-link">
              {number}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default AppointmentsPageDoctorPanel;
