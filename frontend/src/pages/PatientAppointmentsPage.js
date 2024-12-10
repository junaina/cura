import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/PatientAppointmentsPage.css";
import "../components/patientDashNav";
import PatientDashNav from "../components/patientDashNav";

const PatientAppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // State to track current page
  const [modalData, setModalData] = useState(null); // Data for modal
  const [modalType, setModalType] = useState(""); // Type of modal ("reschedule" or "cancel")
  const appointmentsPerPage = 8; // Limit appointments to 8 per page

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        // Fetch patient ID from localStorage (replace with your auth system if needed)
        const patientId = localStorage.getItem("patient_id");

        if (!patientId) {
          throw new Error("Patient ID not found in localStorage.");
        }

        // Call the API to fetch appointments for the patient
        const response = await axios.get(
          `http://localhost:5000/api/appointments/patient-appointments/${patientId}`
        );

        setAppointments(response.data); // Save appointments in state
        setLoading(false);
      } catch (err) {
        console.error("Error fetching appointments:", err.message);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);
  const openModal = (type, appointment) => {
    setModalType(type);
    setModalData(appointment);
  };

  const closeModal = () => {
    setModalType("");
    setModalData(null);
  };
  const handleReschedule = async (
    appointmentId,
    newDate,
    newStartTime,
    newEndTime
  ) => {
    if (!newDate || !newStartTime || !newEndTime) {
      alert("All fields are required to reschedule.");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/api/appointments/reschedule/${appointmentId}`,
        {
          date: newDate,
          startTime: newStartTime,
          endTime: newEndTime,
        }
      );
      setAppointments((prevAppointments) =>
        prevAppointments.map((appt) =>
          appt._id === appointmentId
            ? {
                ...appt,
                date: newDate,
                time: `${newStartTime} - ${newEndTime}`,
              }
            : appt
        )
      );
      closeModal();
    } catch (err) {
      console.error("Error rescheduling appointment:", err.message);
      alert("Failed to reschedule appointment.");
    }
  };

  const handleCancel = async (appointmentId) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/appointments/cancel/${appointmentId}`
      );
      setAppointments((prevAppointments) =>
        prevAppointments.map((appt) =>
          appt._id === appointmentId ? { ...appt, status: "cancelled" } : appt
        )
      );
      closeModal();
    } catch (err) {
      console.error("Error cancelling appointment:", err.message);
      alert("Failed to cancel appointment.");
    }
  };

  // Calculate the appointments to display on the current page
  const indexOfLastAppointment = currentPage * appointmentsPerPage;
  const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
  const currentAppointments = appointments.slice(
    indexOfFirstAppointment,
    indexOfLastAppointment
  );

  // Function to change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Show a loading message while data is being fetched
  if (loading) return <p>Loading...</p>;

  // Show an error message if something goes wrong
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="patient-appointments-page">
      <PatientDashNav />
      <div className="patient-appointments-container">
        <h1>My Appointments</h1>

        {appointments.length > 0 ? (
          <>
            <table className="patients-appointment-table">
              <thead className="patients-appointment-table-header">
                <tr className="patients-appointment-table-row">
                  <th className="patients-appointment-table-headings">
                    Doctor
                  </th>
                  <th className="patients-appointment-table-headings">
                    {" "}
                    Specialization
                  </th>
                  <th className="patients-appointment-table-headings">Date</th>
                  <th className="patients-appointment-table-headings">Time</th>
                  <th className="patients-appointment-table-headings">
                    Status
                  </th>
                  <th className="patients-appointment-table-headings">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className=" patients-appointment-table-body">
                {currentAppointments.map((appointment) => (
                  <tr key={appointment._id}>
                    <td className="patients-appointment-table-data">
                      {appointment.doctor_id.user_id.name}
                    </td>
                    <td className="patients-appointment-table-data">
                      {appointment.doctor_id.specialization}
                    </td>
                    <td className="patients-appointment-table-data">
                      {appointment.date}
                    </td>
                    <td className="patients-appointment-table-data">
                      {appointment.time}
                    </td>
                    <td className="patients-appointment-table-data">
                      {appointment.status}
                    </td>
                    <td className="patients-appointment-table-data">
                      <button
                        className="reschedule-button"
                        onClick={() => openModal("reschedule", appointment)}
                      >
                        Reschedule
                      </button>
                      <button
                        className="cancel-button"
                        onClick={() => openModal("cancel", appointment)}
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {modalType && modalData && (
              <Modal
                type={modalType}
                data={modalData}
                onClose={closeModal}
                onReschedule={handleReschedule}
                onCancel={handleCancel}
              />
            )}
            <Pagination
              appointmentsPerPage={appointmentsPerPage}
              totalAppointments={appointments.length}
              paginate={paginate}
              currentPage={currentPage}
            />
          </>
        ) : (
          <p>No appointments found.</p>
        )}
      </div>
    </div>
  );
};

const Modal = ({ type, data, onClose, onReschedule, onCancel }) => {
  const [newDate, setNewDate] = useState("");
  // const [startTimeOptions, setStartTimeOptions] = useState([]);
  // const [endTimeOptions, setEndTimeOptions] = useState([]);
  const [newStartTime, setNewStartTime] = useState("");
  const [newEndTime, setNewEndTime] = useState("");
  // Fetch availability when the date changes
  // const fetchAvailability = async (doctorId, selectedDate) => {
  //   try {
  //     const response = await axios.get(
  //       `http://localhost:5000/api/availability?doctorId=${doctorId}&date=${selectedDate}`
  //     );

  //     if (response.data && response.data.length > 0) {
  //       // Transform availability into dropdown options
  //       const timeSlots = response.data.map((slot) => slot.time);
  //       setStartTimeOptions(timeSlots);
  //       setEndTimeOptions(timeSlots);
  //     } else {
  //       setStartTimeOptions([]);
  //       setEndTimeOptions([]);
  //     }
  //   } catch (err) {
  //     console.error("Error fetching availability:", err);
  //   }
  // };

  // useEffect(() => {
  //   if (newDate && type === "reschedule") {
  //     fetchAvailability(data.doctor_id._id, newDate);
  //   }
  // }, [newDate]);
  return (
    <div className="patients-appointments-modal-overlay">
      <div className="patients-appointments-modal-content">
        {type === "reschedule" ? (
          <>
            <h2>Reschedule Appointment</h2>
            <p>Doctor: {data.doctor_id.user_id.name}</p>
            <p>Current Date: {data.date}</p>
            <p>Current Time: {data.time}</p>
            <label>
              New Date:
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
              />
            </label>
            <label>
              New Start Time:
              <input
                type="time"
                value={newStartTime}
                onChange={(e) => setNewStartTime(e.target.value)}
              />
            </label>
            <label>
              New End Time:
              <input
                type="time"
                value={newEndTime}
                onChange={(e) => setNewEndTime(e.target.value)}
              />
            </label>
            <button
              onClick={() =>
                onReschedule(data._id, newDate, newStartTime, newEndTime)
              }
              className="patients-appointments-modal-button"
            >
              Save
            </button>
          </>
        ) : (
          <>
            <h2>Cancel Appointment</h2>
            <p>Doctor: {data.doctor_id.user_id.name}</p>
            <p>Date: {data.date}</p>
            <p>Time: {data.time}</p>
            <button
              onClick={() => onCancel(data._id)}
              className="patients-appointments-modal-button"
            >
              Confirm Cancel
            </button>
          </>
        )}
        <button
          onClick={onClose}
          className="patients-appointments-modal-close-button"
        >
          Close
        </button>
      </div>
    </div>
  );
};

const Pagination = ({
  appointmentsPerPage,
  totalAppointments,
  paginate,
  currentPage,
}) => {
  const pageNumbers = [];

  for (
    let i = 1;
    i <= Math.ceil(totalAppointments / appointmentsPerPage);
    i++
  ) {
    pageNumbers.push(i);
  }

  return (
    <nav className="patient-pagination-nav">
      <ul className="patient-pagination">
        {pageNumbers.map((number) => (
          <li
            key={number}
            className={`patient-pagination-item ${
              currentPage === number ? "active" : ""
            }`}
          >
            <button
              onClick={() => paginate(number)}
              className="patient-pagination-button"
            >
              {number}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};
export default PatientAppointmentsPage;
