import React from "react";
import { Link } from "react-router-dom";
import Logo from "../components/Logo"; // Adjust the path as needed
import "../styles/PatientDashNav.css"; // Separate CSS for styling

const PatientDashNav = () => {
  return (
    <aside className="patient-navbar">
      <div className="logo">
        <Logo />
      </div>
      <ul className="nav-links">
        <li>
          <Link to="/patient-home" className="nav-link">
            Home
          </Link>
        </li>
        <li>
          <Link to="/patient-appointments" className="nav-link">
            Appointments
          </Link>
        </li>
        <li>
          <Link to="/view-prescriptions" className="nav-link">
            Prescriptions
          </Link>
        </li>
      </ul>
    </aside>
  );
};

export default PatientDashNav;
