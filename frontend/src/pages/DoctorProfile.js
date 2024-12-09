import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // To access the dynamic URL params
import axios from "axios"; // For making API requests
import "../styles/DoctorProfile.css"; // Add your styles here
import PatientDashNav from "../components/patientDashNav";

const DoctorProfile = () => {
  const { id } = useParams(); // Get the doctor ID from the URL
  const [doctor, setDoctor] = useState(null); // State to store doctor details
  const [loading, setLoading] = useState(true); // State to handle loading state
  const [error, setError] = useState(null); // State to handle error state
  const [modalOpen, setModalOpen] = useState(false); // State to handle modal visibility
  const [selectedSlot, setSelectedSlot] = useState(null); // State to store the selected availability slot
  const [appointmentError, setAppointmentError] = useState(null); // Error state for booking

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/doctor/${id}` // Fetch doctor details from backend
        );
        setDoctor(response.data); // Set the doctor details to state
        setLoading(false); // Set loading to false once data is fetched
      } catch (err) {
        setError("Error fetching doctor details");
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [id]); // Fetch new doctor details if the ID changes

  // Handle booking appointment
  const handleBookAppointment = async () => {
    if (!selectedSlot) {
      setAppointmentError("Please select an available slot.");
      return;
    }

    // Fetch patient_id from localStorage
    const patientId = localStorage.getItem("patient_id"); // Make sure this is available

    if (!patientId) {
      setAppointmentError("Patient ID is missing.");
      return;
    }

    try {
      const appointmentData = {
        doctor_id: id, // Doctor's ID (from the URL)
        patient_id: patientId, // Patient's ID (from localStorage)
        date: selectedSlot.day, // Selected day from the slot
        time: `${selectedSlot.start_time} - ${selectedSlot.end_time}`, // Combining start_time and end_time
      };

      console.log("Appointment Data to Send:", appointmentData); // Log data to check if it's correct

      const response = await axios.post(
        "http://localhost:5000/api/appointments", // Backend route for creating an appointment
        appointmentData
      );

      // Handle success
      alert("Appointment booked successfully!");
      setModalOpen(false); // Close the modal
    } catch (err) {
      setAppointmentError("Failed to book appointment. Try again later.");
      console.error("Error booking appointment:", err); // Log the error for debugging
    }
  };

  // If still loading, show loading message
  if (loading) return <p>Loading...</p>;

  // If error occurs, show error message
  if (error) return <p>{error}</p>;

  return (
    <div className="doctor-profile-page">
      <PatientDashNav />
      <div className="doctor-profile">
        {doctor && (
          <>
            <h2>{doctor.user_id.name}</h2>
            <p>
              <strong>Specialization:</strong> {doctor.specialization}
            </p>
            <p>
              <strong>About:</strong> {doctor.about}
            </p>
            <p>
              <strong>City:</strong> {doctor.city}
            </p>
            <p>
              <strong>Email:</strong> {doctor.user_id.email}
            </p>
            <p>
              <strong>Contact Number:</strong> {doctor.contactNumber}
            </p>
            <p>
              <strong>Medical License Number:</strong>{" "}
              {doctor.medicalLicenseNumber}
            </p>
            <p>
              <strong>Experience:</strong> {doctor.experience} years
            </p>

            <h3>Availability</h3>
            <ul>
              {doctor.availability?.length > 0 ? (
                doctor.availability.map((slot, index) => (
                  <li key={index}>
                    {slot.day}: {slot.start_time} - {slot.end_time}
                    <button
                      className="dr-profile-btn"
                      onClick={() => {
                        setSelectedSlot(slot);
                        setModalOpen(true);
                      }}
                    >
                      Book Appointment
                    </button>
                  </li>
                ))
              ) : (
                <p>No availability listed</p>
              )}
            </ul>
          </>
        )}

        {/* Modal for booking appointment */}
        {modalOpen && (
          <div className="appointment-booking-modal">
            <div className="appointment-modal-content">
              <h3>Confirm Appointment</h3>
              <p>
                <strong>Day:</strong> {selectedSlot.day}
              </p>
              <p>
                <strong>Time:</strong> {selectedSlot.start_time} -{" "}
                {selectedSlot.end_time}
              </p>
              <button
                className="dr-profile-btn"
                onClick={handleBookAppointment}
              >
                Confirm
              </button>
              <button
                className="dr-pofile-btn"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </button>
              {appointmentError && <p className="error">{appointmentError}</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorProfile;
