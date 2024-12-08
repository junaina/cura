import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar"; // Import Navbar
import "../styles/DoctorApplications.css"; // Create this file for specific styles

const DoctorApplications = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalData, setModalData] = useState(null); // For doctor details in modal

  const doctorsPerPage = 5;

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("No token found. Please log in.");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          "http://localhost:5000/api/doctors/pending",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setDoctors(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching doctors:", err);
        setError("Failed to fetch doctor applications");
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const handleApproval = async (id, status) => {
    try {
      const token = localStorage.getItem("token");

      // Make the request to update the status in the backend
      await axios.put(
        `http://localhost:5000/api/doctors/${id}/status`,
        { status }, // "approved" or "rejected"
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Set the updated doctor list in state
      setDoctors((prevDoctors) =>
        prevDoctors.filter((doctor) => doctor._id !== id)
      );
    } catch (err) {
      console.error("Error updating doctor status:", err);
    }
  };

  const handleModalOpen = (doctor) => {
    setModalData(doctor);
  };

  const handleModalClose = () => {
    setModalData(null);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const indexOfLastDoctor = currentPage * doctorsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
  const currentDoctors = doctors.slice(indexOfFirstDoctor, indexOfLastDoctor);

  return (
    <div className="doctor-applications-page">
      <Navbar /> {/* Include Navbar at the top */}
      <div className="doctor-applications-container">
        <h2>Doctor Applications</h2>
        <table className="doctor-applications-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentDoctors.map((doctor) => (
              <tr key={doctor._id}>
                <td>
                  <button
                    onClick={() => handleModalOpen(doctor)}
                    className="name-button"
                  >
                    {doctor.user_id?.name || "N/A"}
                  </button>
                </td>
                <td>{doctor.user_id?.email || "N/A"}</td>
                <td>
                  <button
                    className="approve-btn"
                    onClick={() => handleApproval(doctor._id, "approved")}
                  >
                    Approve
                  </button>
                  <button
                    className="reject-btn"
                    onClick={() => handleApproval(doctor._id, "rejected")}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          <span>Page {currentPage}</span>
          <button
            onClick={() =>
              setCurrentPage((prev) =>
                prev < Math.ceil(doctors.length / doctorsPerPage)
                  ? prev + 1
                  : prev
              )
            }
            disabled={
              currentPage === Math.ceil(doctors.length / doctorsPerPage)
            }
          >
            Next
          </button>
        </div>

        {modalData && (
          <div className="doctor-modal">
            <div className="modal-content">
              <button className="close-modal" onClick={handleModalClose}>
                &times;
              </button>
              <h3>{modalData.user_id?.name || "N/A"}</h3>
              <p>Email: {modalData.user_id?.email || "N/A"}</p>
              <p>Specialization: {modalData.specialization}</p>
              <p>License Number: {modalData.medicalLicenseNumber}</p>
              <p>Experience: {modalData.experience} years</p>
              <p>Gender: {modalData.gender}</p>
              <p>Contact: {modalData.contactNumber}</p>

              {/* Availability Table */}
              {modalData.availability && modalData.availability.length > 0 ? (
                <table className="availability-table">
                  <thead>
                    <tr>
                      <th>Day</th>
                      <th>Start Time</th>
                      <th>End Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {modalData.availability.map((slot, index) => {
                      const startHour24 = parseInt(
                        slot.start_time.split(":")[0]
                      );
                      const startMinutes =
                        parseInt(slot.start_time.split(":")[1]) || 0;

                      // Start Time Conversion to AM/PM
                      const startPeriod = startHour24 >= 12 ? "PM" : "AM";
                      const startHour12 = startHour24 % 12 || 12; // Convert to 12-hour format

                      // Calculate End Time
                      const endHour24 = (startHour24 + 1) % 24; // Add 1 hour
                      const endPeriod = endHour24 >= 12 ? "PM" : "AM";
                      const endHour12 = endHour24 % 12 || 12; // Convert to 12-hour format

                      // Format Times
                      const startTime = `${startHour12}:${startMinutes
                        .toString()
                        .padStart(2, "0")} ${startPeriod}`;
                      const endTime = `${endHour12}:${startMinutes
                        .toString()
                        .padStart(2, "0")} ${endPeriod}`;

                      return (
                        <tr key={index}>
                          <td>{slot.day}</td>
                          <td>{startTime}</td>
                          <td>{endTime}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <p>No availability information provided.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorApplications;
