import React, { useState, useEffect } from "react";
import axios from "axios";
import DoctorCard from "./DoctorCard";
import Pagination from "./Pagination";
import Navbar from "./Navbar";
import "../styles/ManageDoctors.css";

const ManageDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [doctorsPerPage, setDoctorsPerPage] = useState(3);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [appointmentError, setAppointmentError] = useState(null);
  const [showDoctorDetails, setShowDoctorDetails] = useState(false);
  const [showUpdateProfile, setShowUpdateProfile] = useState(false);
  const [showAppointmentsModal, setShowAppointmentsModal] = useState(false);
  const [editDoctorData, setEditDoctorData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [doctorToDelete, setDoctorToDelete] = useState(null);

  // Fetch doctors on component mount
  useEffect(() => {
    fetchDoctors(specialization);
  }, [specialization]);

  const fetchDoctors = async (specialization) => {
    axios
      .get(`/api/doctors?specialization=${specialization}`)
      .then((response) => {
        setDoctors(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the doctors!", error);
      });
  };
  // Handle search
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  // View Doctor Details
  const handleViewDetails = async (doctor) => {
    try {
      const response = await axios.get(`/api/doctors/${doctor._id}`);
      console.log("Doctor details:", response.data);
      setSelectedDoctor(response.data);
      setShowDoctorDetails(true);
    } catch (error) {
      alert("Error fetching doctor details");
      console.error("Error fetching doctor details:", error);
    }
  };

  // View Appointments - with check for no appointments
  // const handleViewAppointments = async (doctor) => {
  //   try {
  //     const response = await axios.get(
  //       `/api/appointments/doctor/${doctor._id}`
  //     );
  //     console.log("Fetched appointments:", response.data);
  //     setAppointments(response.data); // Save fetched appointments to state
  //     setSelectedDoctor(doctor); // Save the doctor whose appointments are being viewed
  //     setShowAppointmentsModal(true); // Open the appointments modal
  //   } catch (error) {
  //     console.error("Error fetching appointments:", error);
  //     setAppointmentError("Error fetching appointments. Please try again.");
  //   }
  // };
  const handleViewAppointments = async (doctor) => {
    try {
      // Fetch appointments for the specific doctor using the appropriate endpoint
      const response = await axios.get(
        `http://localhost:5000/api/appointments/doctor/${doctor._id}`
      );

      if (response.data.appointments.length > 0) {
        // Assuming `appointments` contains detailed appointment objects
        setAppointments(response.data.appointments);
        setAppointmentError(null); // Clear any error
        setShowAppointmentsModal(true); // Open the modal
        setSelectedDoctor(doctor); // Save the selected doctor
        console.log("Fetched appointments:", response.data.appointments);
      } else {
        // If no appointments exist for this doctor
        setAppointments([]); // Clear previous appointments
        setAppointmentError("No appointments scheduled for this doctor.");
        setShowAppointmentsModal(true); // Open the modal to show the error
      }
      console.log("modal status", showAppointmentsModal);
    } catch (error) {
      // Handle errors (e.g., server or network issues)
      setAppointments([]); // Clear previous appointments
      setAppointmentError("Error fetching appointments.");
      setShowAppointmentsModal(true); // Open the modal to show the error
      console.error("Error fetching appointments:", error);
    }
  };

  const handleUpdateProfile = (doctor) => {
    setEditDoctorData(doctor);
    setIsEditing(true);
  };
  const closeEditModal = () => {
    setEditDoctorData(null);
    setIsEditing(false);
  };
  const handleEditSubmit = async () => {
    try {
      const response = await axios.put(
        `/api/doctors/${editDoctorData._id}`,
        editDoctorData
      );
      console.log("Updated doctor:", response.data);
      closeEditModal(); // Close the modal
      fetchDoctors(); // Refresh the doctors list
    } catch (error) {
      console.error("Error updating doctor:", error);
      alert("Failed to update doctor. Please try again.");
    }
  };

  // Delete Doctor
  const openDeleteModal = (doctorId) => {
    setDoctorToDelete(doctorId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/doctors/${doctorToDelete}`
      );

      if (response.status === 200) {
        setDoctors(doctors.filter((doctor) => doctor._id !== doctorToDelete));
        alert("Doctor profile deleted successfully.");
      }
    } catch (error) {
      console.error("Error deleting doctor:", error);
      alert("Failed to delete doctor profile. Please try again.");
    } finally {
      setShowDeleteModal(false);
      setDoctorToDelete(null);
    }
  };
  const handleUpdateSave = async (updatedDoctor) => {
    await axios.put(`/api/doctors/${updatedDoctor._id}`, updatedDoctor);
    fetchDoctors();
  };
  // Pagination logic
  const indexOfLastDoctor = currentPage * doctorsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
  const currentDoctors = doctors.slice(indexOfFirstDoctor, indexOfLastDoctor);

  return (
    <div className="manage-doctors-page">
      <Navbar />
      <div className="manage-doctors">
        <h1>Manage Doctors</h1>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search by name"
          value={search}
          onChange={handleSearchChange}
        />

        {/* Filter by specialization */}
        <select onChange={(e) => setSpecialization(e.target.value)}>
          <option value="">All Specializations</option>
          <option value="Cardiologist">Cardiologist</option>
          <option value="Pulmonologist">Pulmonologist</option>
          <option value="General Practice">General Practice</option>
          <option value="Neurology">Neurology</option>
          <option value="Orthopedic">Orthopedic</option>
          <option value="Dermatologist">Dermatologist</option>
          <option value="Gynecologist">Gynecologist</option>
          <option value="Ophthalmologist">Ophthalmologist</option>
          <option value="Pediatrician">Pediatrician</option>
          <option value="Psychiatrist">Psychiatrist</option>
          <option value="Radiologist">Radiologist</option>
          <option value="Urologist">Urologist</option>
        </select>

        <div className="doctor-list">
          {currentDoctors
            .filter((doctor) =>
              doctor.user_id.name.toLowerCase().includes(search.toLowerCase())
            )
            .map((doctor) => (
              <DoctorCard
                key={doctor._id}
                doctor={doctor}
                onViewDetails={handleViewDetails}
                onViewAppointments={handleViewAppointments}
                onUpdateProfile={handleUpdateProfile}
                onDelete={openDeleteModal}
              />
            ))}
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalItems={doctors.length}
          itemsPerPage={doctorsPerPage}
        />
      </div>
      {showDoctorDetails && selectedDoctor && (
        <div className="overlay-doctor-details-modal">
          <div className="doctor-details-modal">
            <h2>{selectedDoctor.user_id.name}'s Details</h2>
            <p>
              <strong>Email:</strong> {selectedDoctor.user_id.email}
            </p>
            <p>
              <strong>Specialization:</strong> {selectedDoctor.specialization}
            </p>
            <p>
              <strong>Experience:</strong> {selectedDoctor.experience} years
            </p>
            <p>
              <strong>Contact:</strong> {selectedDoctor.contactNumber}
            </p>
            <p>
              <strong>City:</strong> {selectedDoctor.city}
            </p>
            <p>
              <strong>Availability:</strong>
            </p>
            <ul>
              {selectedDoctor.availability.map((slot) => (
                <li key={slot._id}>
                  {slot.day}: {slot.start_time} - {slot.end_time}
                </li>
              ))}
            </ul>
            <button
              onClick={() => setShowDoctorDetails(false)}
              className="modal-close-button"
            >
              Close
            </button>
          </div>
        </div>
      )}
      {showAppointmentsModal && selectedDoctor && (
        <div className="overlay-appointments-modal">
          {console.log("modal status appointments", showAppointmentsModal)}
          <div className="appointments-modal">
            <h2>Appointments for {selectedDoctor.user_id.name}</h2>
            {appointmentError ? (
              <p>{appointmentError}</p>
            ) : (
              <ul>
                {appointments.map((appointment) => (
                  <li key={appointment._id}>
                    Date: {appointment.date}, Time: {appointment.time}, Status:{" "}
                    {appointment.status}
                  </li>
                ))}
              </ul>
            )}
            <button
              onClick={() => {
                setShowAppointmentsModal(false);
                setAppointments([]);
                setAppointmentError(null);
                setSelectedDoctor(null);
              }}
              className="modal-close-button"
            >
              Close
            </button>
          </div>
        </div>
      )}
      {isEditing && editDoctorData && (
        <div className="edit-doctor-modal">
          <h2>Edit Doctor Profile</h2>
          <form>
            <label>
              Specialization:
              <input
                type="text"
                value={editDoctorData.specialization}
                onChange={(e) =>
                  setEditDoctorData({
                    ...editDoctorData,
                    specialization: e.target.value,
                  })
                }
              />
            </label>
            <label>
              Experience:
              <input
                type="number"
                value={editDoctorData.experience}
                onChange={(e) =>
                  setEditDoctorData({
                    ...editDoctorData,
                    experience: e.target.value,
                  })
                }
              />
            </label>
            <label>
              Contact Number:
              <input
                type="text"
                value={editDoctorData.contactNumber}
                onChange={(e) =>
                  setEditDoctorData({
                    ...editDoctorData,
                    contactNumber: e.target.value,
                  })
                }
              />
            </label>
            <button type="button" onClick={handleEditSubmit}>
              Save Changes
            </button>
            <button type="button" onClick={closeEditModal}>
              Cancel
            </button>
          </form>
        </div>
      )}
      {showDeleteModal && (
        <div className="overlay-delete-modal">
          <div className="delete-modal">
            <p>Are you sure you want to delete this doctor's profile?</p>
            <button onClick={confirmDelete}>Yes, Delete</button>
            <button onClick={() => setShowDeleteModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageDoctors;
