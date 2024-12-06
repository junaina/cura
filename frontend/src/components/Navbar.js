// components/Navbar.js

import React from "react";
import "../styles/Navbar.css"; // Ensure this path is correct

const Navbar = () => {
  return (
    <div className="navbar">
      {/* Small White Rectangle Above the Brand */}
      <div className="brand-rectangle">
        {/* You can add any icon or text inside this container if needed */}
      </div>
      
      {/* "cura" brand text */}
      <div className="brand">cura</div>
      
      {/* Navbar Menu */}
      <ul>
        <li>Dashboard</li>
        <li>Manage Doctors</li>
        <li>Manage Patient Records</li>
        <li>Manage User Accounts</li>
        <li>View Analytics</li>
      </ul>
    </div>
  );
};

export default Navbar;
