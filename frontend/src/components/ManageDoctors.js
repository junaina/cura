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
  const handleViewDetails = (doctor) => {
    setSelectedDoctor(doctor);
    setShowDoctorDetails(true);
  };

  // View Appointments - with check for no appointments
  const handleViewAppointments = (doctor) => {
    console.log("Viewing appointments for:", doctor);
    axios
      .get(`/api/appointments?doctor_id=${doctor._id}`)
      .then((response) => {
        if (response.data.length === 0) {
          setAppointmentError("No appointments scheduled for this doctor.");
        } else {
          setAppointments(response.data);
          setAppointmentError(null); // Clear any previous error message
        }
      })
      .catch((error) => {
        setAppointmentError("Error fetching appointments.");
        console.error("Error fetching appointments:", error);
      });
  };

  const handleUpdateProfile = (doctor) => {
    setSelectedDoctor(doctor);
    setShowUpdateProfile(true);
  };
  // Delete Doctor
  const handleDelete = (doctorId) => {
    axios
      .delete(`/api/doctors/${doctorId}`)
      .then(() => {
        setDoctors(doctors.filter((doctor) => doctor._id !== doctorId));
      })
      .catch((error) => {
        console.error("Error deleting doctor:", error);
      });
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
                onDelete={handleDelete}
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
    </div>
  );
};

export default ManageDoctors;
