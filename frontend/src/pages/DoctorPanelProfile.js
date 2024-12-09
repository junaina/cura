import React, { useState, useEffect } from "react";
import axios from "axios";
import NavbarForDoctor from "../components/NavbarForDoctor";
import "../styles/DoctorPanelProfile.css"; // Add your styles here

const DoctorProfilePanel = () => {
  const [doctor, setDoctor] = useState(null);
  const [availability, setAvailability] = useState([]);
  const [newAvailability, setNewAvailability] = useState({
    day: "Monday",
    start_time: "",
    end_time: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const doctorId = localStorage.getItem("doctor_id");
        if (!doctorId) {
          setError("Doctor ID is missing in localStorage.");
          return;
        }

        const doctorResponse = await axios.get(
          `http://localhost:5000/api/doctor/${doctorId}`
        );
        const availabilityResponse = await axios.get(
          `http://localhost:5000/api/availability/${doctorId}`
        );

        setDoctor(doctorResponse.data);
        setAvailability(availabilityResponse.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching doctor profile:", err);
        setError("Error fetching doctor profile.");
        setLoading(false);
      }
    };

    fetchDoctorData();
  }, []);

  const handleAddAvailability = async () => {
    const doctorId = localStorage.getItem("doctor_id");
    try {
      const response = await axios.post(
        "http://localhost:5000/api/availability",
        {
          doctor_id: doctorId,
          ...newAvailability,
        }
      );
      setAvailability([...availability, response.data.newAvailability]);
      setNewAvailability({ day: "Monday", start_time: "", end_time: "" });
    } catch (err) {
      console.error("Error adding availability:", err);
    }
  };

  const handleDeleteAvailability = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/availability/${id}`);
      setAvailability(availability.filter((item) => item._id !== id));
    } catch (err) {
      console.error("Error deleting availability:", err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="doctor-profile-page">
      <NavbarForDoctor />
      <div className="doctor-profile-content">
        <h2>Doctor Profile</h2>
        <div className="profile-card">
          <h3>{doctor.user_id.name}</h3>
          <p>
            <strong>Email:</strong> {doctor.user_id.email}
          </p>
          <p>
            <strong>Specialization:</strong> {doctor.specialization}
          </p>
        </div>

        <h3>Availability Settings</h3>
        <div className="availability-form">
          <label>Day:</label>
          <select
            value={newAvailability.day}
            onChange={(e) =>
              setNewAvailability({ ...newAvailability, day: e.target.value })
            }
          >
            {[
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ].map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
          <label>Start Time:</label>
          <input
            type="time"
            value={newAvailability.start_time}
            onChange={(e) =>
              setNewAvailability({
                ...newAvailability,
                start_time: e.target.value,
              })
            }
          />
          <label>End Time:</label>
          <input
            type="time"
            value={newAvailability.end_time}
            onChange={(e) =>
              setNewAvailability({
                ...newAvailability,
                end_time: e.target.value,
              })
            }
          />
          <button onClick={handleAddAvailability}>Add Availability</button>
        </div>

        <h3>Current Availability</h3>
        <table className="availability-table">
          <thead>
            <tr>
              <th>Day</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {availability.map((item) => (
              <tr key={item._id}>
                <td>{item.day}</td>
                <td>{item.start_time}</td>
                <td>{item.end_time}</td>
                <td>
                  <button onClick={() => handleDeleteAvailability(item._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DoctorProfilePanel;
