import React, { useState } from "react";
import "../styles/DoctorCard.css";

const DoctorCard = ({
  doctor,
  onViewDetails,
  onViewAppointments,
  onUpdateProfile,
  onDelete,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

  const handleViewDetails = () => {
    setIsModalOpen(true); // Open the modal
    onViewDetails(doctor); // Optional: Trigger a parent function when details are viewed
  };

  return (
    <div className="doctor-card">
      <div className="doctor-info">
        <h3>{doctor.user_id.name}</h3>
        <p>Specialization: {doctor.specialization}</p>
        <p>Experience: {doctor.experience} years</p>
      </div>

      <div className="actions">
        {/* View Details Button */}{" "}
        <button onClick={() => onViewDetails(doctor)}>View Details</button>
        <button onClick={() => onViewAppointments(doctor)}>
          View Appointments
        </button>
        <button onClick={() => onUpdateProfile(doctor)}>Update Profile</button>
        <button onClick={() => onDelete(doctor)}>Delete</button>
      </div>
    </div>
  );
};

export default DoctorCard;
