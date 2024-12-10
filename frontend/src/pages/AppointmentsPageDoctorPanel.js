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
  const [selectedAppointment, setSelectedAppointment] = useState(null); // For modal popup

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

  const handleViewAppointment = async (appointment) => {
    console.log(
      "Debug: appointment.patient_id:",
      JSON.stringify(appointment.patient_id, null, 2)
    );

    console.log("Debug: appointment.patient_id:", appointment.patient_id);

    const patientId = appointment.patient_id?._id?._id;
    if (!patientId || typeof patientId !== "string") {
      console.error("Invalid patient ID:", patientId);
      alert("Unable to fetch patient details. Invalid patient ID.");
      return;
    }

    try {
      // Fetch detailed patient history
      console.log("Fetching patient history for Patient ID:", patientId);

      const historyResponse = await axios.get(
        `http://localhost:5000/api/patient-management/patient-history/${patientId}`
      );
      console.log("Patient History Response:", historyResponse.data); // Log the response data

      setSelectedAppointment({ ...appointment, history: historyResponse.data });
    } catch (err) {
      console.error("Error fetching patient history:", err);
      alert("Failed to fetch appointment details.");
    }
  };

  const handleCloseModal = () => {
    setSelectedAppointment(null);
  };
  const handleSaveRecord = async (recordData) => {
    if (!recordData.patient_id || !recordData.doctor_id) {
      alert("Missing patient or doctor information.");
      return;
    }
    if (!recordData.diagnosis) {
      alert("Diagnosis is required.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/patient-management/medical-record",
        recordData
      );
      alert("Medical record saved successfully.");
      console.log("Record saved:", response.data);

      // Optionally update the UI or trigger further actions here

      handleCloseModal(); // Close the modal after saving
    } catch (err) {
      console.error("Error saving medical record:", err);
      alert("Failed to save medical record. Please try again.");
    }
  };

  // Handle appointment actions
  const handleAction = async (appointment, actionType) => {
    console.log(`Action: ${actionType}, Appointment:`, appointment);
    let newStatus;
    switch (actionType) {
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
      <NavbarForDoctor />
      <div className="appointments-page-2">
        <div className="appointments-content">
          <h2>Appointments</h2>
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
                      <td className="actions-doctor-patient-appointments">
                        <button
                          className="btn-action view"
                          onClick={() => handleViewAppointment(appointment)}
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
        {selectedAppointment && (
          <AppointmentModal
            appointment={selectedAppointment}
            onClose={handleCloseModal}
            onSaveRecord={handleSaveRecord}
          />
        )}
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
const AppointmentModal = ({ appointment, onClose, onSaveRecord }) => {
  const [diagnosis, setDiagnosis] = useState("");
  const [prescriptions, setPrescriptions] = useState([]);

  const handleAddPrescription = () => {
    setPrescriptions([
      ...prescriptions,
      { medicine: "", dosage: "", duration: "" },
    ]);
  };

  const handlePrescriptionChange = (index, field, value) => {
    const updatedPrescriptions = [...prescriptions];
    updatedPrescriptions[index][field] = value;
    setPrescriptions(updatedPrescriptions);
  };

  const handleSave = () => {
    const recordData = {
      patient_id: appointment.patient_id,
      doctor_id: localStorage.getItem("doctor_id"),
      diagnosis,
      prescriptions,
    };
    onSaveRecord(recordData);
  };

  return (
    <div className="patientinfo-appointment-modal">
      <div className="patientinfo-appointment-modal-content">
        <button
          className="patientinfo-appointment-modal-close"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <h3>Appointment Details</h3>
        <p>
          <strong>Patient:</strong> {appointment.patient_name}
        </p>
        <p>
          <strong>Date:</strong> {appointment.date}
        </p>
        <p>
          <strong>Time:</strong> {appointment.time}
        </p>
        <p>
          <strong>Status:</strong> {appointment.status}
        </p>
        <h4>Patient History</h4>
        <div className="patient-history-section">
          {appointment.history.medicalRecords &&
          appointment.history.medicalRecords.length > 0 ? (
            <table className="history-table">
              <thead>
                <tr>
                  <th>Diagnosis</th>
                  <th>Prescriptions</th>
                  <th>Test Results</th>
                </tr>
              </thead>
              <tbody>
                {appointment.history.medicalRecords.map((record) => (
                  <tr key={record._id}>
                    <td>{record.diagnosis || "N/A"}</td>
                    <td>
                      {record.prescriptions.length > 0 ? (
                        <ul>
                          {record.prescriptions.map((prescription, index) => (
                            <li key={index}>
                              {prescription.medicine} - {prescription.dosage}{" "}
                              for {prescription.duration}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        "None"
                      )}
                    </td>
                    <td>
                      {record.test_results.length > 0 ? (
                        <ul>
                          {record.test_results.map((test, index) => (
                            <li key={index}>
                              {test.test_name}: {test.result} on{" "}
                              {new Date(test.date).toLocaleDateString()}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        "None"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No medical history available.</p>
          )}
        </div>

        <h4>New Medical Record</h4>
        <textarea
          value={diagnosis}
          onChange={(e) => setDiagnosis(e.target.value)}
          placeholder="Enter diagnosis"
        />
        <h5>Prescriptions</h5>
        {prescriptions.map((prescription, index) => (
          <div
            key={index}
            className="patientinfo-appointment-modal-prescription"
          >
            <input
              type="text"
              placeholder="Medicine"
              value={prescription.medicine}
              onChange={(e) =>
                handlePrescriptionChange(index, "medicine", e.target.value)
              }
            />
            <input
              type="text"
              placeholder="Dosage"
              value={prescription.dosage}
              onChange={(e) =>
                handlePrescriptionChange(index, "dosage", e.target.value)
              }
            />
            <input
              type="text"
              placeholder="Duration"
              value={prescription.duration}
              onChange={(e) =>
                handlePrescriptionChange(index, "duration", e.target.value)
              }
            />
          </div>
        ))}
        <button
          onClick={handleAddPrescription}
          className="patientinfo-appointment-modal-btn add"
        >
          Add Prescription
        </button>
        <button
          onClick={() => {
            const recordData = {
              patient_id: appointment.patient_id._id, // Extract correct patient ID
              doctor_id: localStorage.getItem("doctor_id"),
              diagnosis,
              prescriptions,
            };
            onSaveRecord(recordData); // Pass record data to parent handler
          }}
          className="patientinfo-appointment-modal-btn save"
        >
          Save Record
        </button>

        <button
          onClick={onClose}
          className="patientinfo-appointment-modal-btn close"
        >
          Close
        </button>
      </div>
    </div>
  );
};
export default AppointmentsPageDoctorPanel;
