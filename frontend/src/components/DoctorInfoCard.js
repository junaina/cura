import React from "react";
import { Link } from "react-router-dom";

const DoctorInfoCard = ({ doctor }) => {
  return (
    <div className="doctor-card">
      <h3>{doctor.user_id.name}</h3>
      <p>{doctor.specialization}</p>
      <p>{doctor.city}</p>
      <p>{doctor.about}</p>
      <Link to={`/doctor-profile/${doctor._id}`} className="view-profile-btn">
        View Profile
      </Link>
    </div>
  );
};

export default DoctorInfoCard;
