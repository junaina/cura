import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios for making API requests
import PatientDashNav from "../components/patientDashNav"; // Import the Patient Dashboard Navigation
import femaleDoc from "../assets/femaledoc.png"; // Image for doctor
import "../styles/PatientHome.css"; // CSS for styling the layout

const PatientHome = () => {
  const [query, setQuery] = useState(""); // State to hold search query
  const [loading, setLoading] = useState(false); // State to handle loading state
  const [error, setError] = useState(null); // State to handle errors
  const navigate = useNavigate(); // Hook to navigate to the search results page

  // Handle search submit
  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (query.trim()) {
      setLoading(true);
      setError(null); // Reset error on new search

      try {
        // Make the API call to the backend to fetch doctor search results
        const response = await axios.get(
          `http://localhost:5000/api/patientSearch/search?query=${query}`
        );

        // If successful, navigate to the search results page
        setLoading(false);
        navigate(`/doctor-search?query=${query}`);
      } catch (err) {
        // Handle any errors during the API request
        setError("No doctors found or an error occurred.");
        setLoading(false);
      }
    }
  };

  return (
    <div className="patient-home">
      {/* Sidebar Navigation from PatientDashNav */}
      <PatientDashNav />

      {/* Main Content */}
      <main className="content">
        <div className="hero-section">
          <h1>Find and Book the Best Doctors Near You</h1>
          <span>
            <img src={femaleDoc} alt="Female Doctor" className="female-doc" />
          </span>
          <div className="patient-search-bar">
            <form
              onSubmit={handleSearchSubmit}
              className="patient-search-bar-form"
            >
              <input
                type="text"
                placeholder="Doctors, Hospital, Conditions"
                className="search-input"
                value={query}
                onChange={(e) => setQuery(e.target.value)} // Update query on input change
              />
              <button className="patient-search-button">Search</button>
            </form>
          </div>
          {/* Show loading indicator */}
          {loading && <p>Loading...</p>}
          {/* Show error message */}
          {error && <p>{error}</p>}
        </div>

        {/* Articles Section - Remains visible */}
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
