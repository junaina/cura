import React from "react";
import "../styles/ApproveDrApplicationsCard.css";

const ApproveDrApplicationsCard = () => {
  const handleClick = () => {
    // Logic for handling the button click (e.g., navigate to approval page)
    window.location.href = "/manage-doctor-applications"; // Replace with your actual route
  };

  return (
    <div className="approve-doctor-card">
      <h3 className="approve-doctor-title">Approve Doctor Applications</h3>
      <button className="approve-doctor-button" onClick={handleClick}>
        Let’s Go →
      </button>
    </div>
  );
};

export default ApproveDrApplicationsCard;
