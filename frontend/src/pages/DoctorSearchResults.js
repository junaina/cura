import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DoctorInfoCard from "../components/DoctorInfoCard"; // A component for rendering individual doctor cards

const DoctorSearchResults = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("query"); // Extract the query parameter from the URL

  useEffect(() => {
    if (query) {
      const fetchDoctors = async () => {
        try {
          const response = await fetch(
            `http://localhost:5000/api/patientSearch/search?query=${query}`
          );
          const data = await response.json();
          if (data && Array.isArray(data)) {
            setDoctors(data);
          } else {
            setError("No doctors found.");
          }
          setLoading(false);
        } catch (err) {
          setError("Failed to fetch doctors.");
          setLoading(false);
        }
      };

      fetchDoctors();
    }
  }, [query]);

  return (
    <div className="search-results">
      <h2>Search Results for "{query}"</h2>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <div className="doctor-cards">
        {doctors.length > 0 ? (
          doctors.map((doctor) => (
            <DoctorInfoCard key={doctor._id} doctor={doctor} />
          ))
        ) : (
          <p>No doctors found.</p>
        )}
      </div>
    </div>
  );
};

export default DoctorSearchResults;
