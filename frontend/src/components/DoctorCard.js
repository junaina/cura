import React, { useState } from "react";
import "../styles/DoctorCard.css";

const DoctorCard = ({
  doctor,
  onViewDetails,
  onViewAppointments,
  onUpdateProfile,
  onDelete,
}) => {
  return (
    <div className="doctor-card">
      <div className="doctor-info">
        <h3>{doctor.user_id.name}</h3>
        <p>Specialization: {doctor.specialization}</p>
        <p>Experience: {doctor.experience} years</p>
      </div>

      <div className="actions">
        {/* View Details Button */}{" "}
        <button
          className="dr-card-details dr-card-btns"
          onClick={() => onViewDetails(doctor)}
        >
          View Details
        </button>
        <button
          className="dr-card-view-appointments dr-card-btns"
          onClick={() => onViewAppointments(doctor)}
        >
          View Appointments
        </button>
        <button
          className="dr-card-update-profile dr-card-btns"
          onClick={() => onUpdateProfile(doctor)}
        >
          Update Profile
        </button>
        <button
          className="dr-card-delete dr-card-btns"
          onClick={() => onDelete(doctor._id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default DoctorCard;
