import React from "react";
import { Link } from "react-router-dom";
import PatientDashNav from "../components/patientDashNav"; // Import the Patient Dashboard Navigation
import "../styles/PatientHome.css"; // CSS for styling the layout
import femaleDoc from "../assets/femaledoc.png"; //
const PatientHome = () => {
  return (
    <div className="patient-home">
      {/* Sidebar Navigation from PatientDashNav */}
      <PatientDashNav />

      {/* Main Content */}
      <main className="content">
        <div className="hero-section">
          <h1>Find and Book the Best Doctors Near You</h1>
          <span>
            {" "}
            <img src={femaleDoc} alt="Female Doctor" className="female-doc" />
          </span>
          <div className="patient-search-bar">
            <input
              type="text"
              placeholder="Doctors, Hospital, Conditions"
              className="search-input"
            />
            <button className="patient-search-button">Search</button>
          </div>
        </div>

        <div className="articles-section">
          <h2>Top Health Articles</h2>
          <div className="articles">
            <div className="article">
              <img
                src="https://via.placeholder.com/150"
                alt="Article Thumbnail"
                className="article-image"
              />
              <p>
                What are the benefits of eating bananas on an empty stomach?
              </p>
            </div>
            <div className="article">
              <img
                src="https://via.placeholder.com/150"
                alt="Article Thumbnail"
                className="article-image"
              />
              <p>Health Benefits of Anjeer</p>
            </div>
            <div className="article">
              <img
                src="https://via.placeholder.com/150"
                alt="Article Thumbnail"
                className="article-image"
              />
              <p>Moringa Benefits: 8 Powerful Reasons</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PatientHome;
