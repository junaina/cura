import React from "react";
import { Link } from "react-router-dom";
import Logo from "../components/Logo"; // Adjust the path based on your file structure
import "../styles/Navbar.css"; // Create a CSS file for styling

const Navbar = () => {
  return (
    <nav className="navbar">
      <Logo />
      <ul className="nav-links">
        <li>
          <Link to="/dashboard" className="nav-link">
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/manage-doctors" className="nav-link">
            Manage Doctors
          </Link>
        </li>
        <li>
          <Link to="/manage-patient-records" className="nav-link">
            Manage Patient Records
          </Link>
        </li>
        <li>
          <Link to="/manage-doctor-applications" className="nav-link">
            Manage Doctor Applications
          </Link>
        </li>
        <li>
          <Link to="/view-analytics" className="nav-link">
            View Analytics
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
