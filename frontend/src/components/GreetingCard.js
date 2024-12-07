import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/GreetingCard.css";

const GreetingCard = () => {
  const [adminName, setAdminName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      const token = localStorage.getItem("token"); // Get token from local storage
      if (!token) {
        console.error("No token found. User might not be logged in.");
        return;
      }

      try {
        const response = await axios.get("http://localhost:5000/api/user/me", {
          headers: {
            Authorization: `Bearer ${token}`, // Send token in Authorization header
          },
        });

        // Assuming the API returns a user object with a name property
        setAdminName(response.data.name);
        setLoading(false);
      } catch (error) {
        console.error(
          "Failed to fetch admin data:",
          error.response?.data || error.message
        );
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="greeting-card">
      <img
        src="https://via.placeholder.com/100" // Replace with admin profile image URL
        alt="Admin"
        className="admin-avatar"
      />
      <div className="greeting-content">
        <h1>
          Good Morning <span className="admin-name">{adminName}!</span>
        </h1>
        <p>
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </div>
    </div>
  );
};

export default GreetingCard;
