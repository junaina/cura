import React from "react";
import { Link } from "react-router-dom";
import Logo from "../components/Logo"; // Adjust the path as needed
import "../styles/PatientDashNav.css"; // Separate CSS for styling

const NavbarForDoctor = () => {
  return (
    <aside className="patient-navbar">
      <div className="logo">
        <Logo />
      </div>
      <ul className="nav-links">
        <li>
          <Link to="/doctor-dashboard" className="nav-link">
            {" "}
            Home
          </Link>
        </li>
        <li>
          <Link to="/doctor-dashboard/appointments" className="nav-link">
            Appointments
          </Link>
        </li>
        <li>
          <Link to="/doctor-dashboard/profile" className="nav-link">
            Profile
          </Link>
        </li>
      </ul>
    </aside>
  );
};

export default NavbarForDoctor;