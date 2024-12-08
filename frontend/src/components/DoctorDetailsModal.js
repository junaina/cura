// DoctorDetailsModal.js
import React from "react";

const DoctorDetailsModal = ({ doctor, onClose }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2>Doctor Details</h2>
        <div className="doctor-details">
          <img src={doctor.image} alt={doctor.name} />
          <h3>{doctor.name}</h3>
          <p>Specialty: {doctor.specialty}</p>
          <p>Phone: {doctor.phone}</p>
          <p>Email: {doctor.email}</p>
          <h4>Medical Report</h4>
          <p>Diagnoses: {doctor.diagnoses.join(", ")}</p>
          <p>Allergies: {doctor.allergies.join(", ")}</p>
          <p>Prescriptions: {doctor.prescriptions.join(", ")}</p>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetailsModal;
