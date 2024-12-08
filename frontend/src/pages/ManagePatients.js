import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar"; // Adjust path if necessary
import "../styles/ManagePatients.css"; // Style the page

const ManagePatients = () => {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null); // For handling view and update

  useEffect(() => {
    // Fetch patients from the backend
    axios
      .get("http://localhost:5000/api/patients")
      .then((response) => {
        setPatients(response.data);
      })
      .catch((error) => {
        console.error("Error fetching patients:", error);
      });
  }, []);

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:5000/api/patients/delete/${id}`)
      .then(() => {
        setPatients((prev) => prev.filter((patient) => patient._id !== id));
        alert("Patient deleted successfully");
      })
      .catch((error) => {
        console.error("Error deleting patient:", error);

        alert("Failed to delete patient");
      });
  };

  const handleView = (id) => {
    // Fetch the patient details by id for viewing
    axios
      .get(`http://localhost:5000/api/patients/view/${id}`)
      .then((response) => {
        setSelectedPatient(response.data); // Set patient details to view
      })
      .catch((error) => {
        console.error("Error fetching patient details:", error);
      });
  };

  const handleUpdate = (id, updatedData) => {
    // Update patient details
    axios
      .put(`http://localhost:5000/api/patients/update/${id}`, updatedData)
      .then((response) => {
        setPatients((prev) =>
          prev.map((patient) =>
            patient._id === id ? { ...patient, ...updatedData } : patient
          )
        );
        alert("Patient updated successfully");
        setSelectedPatient(null); // Close the update form
      })
      .catch((error) => {
        console.error("Error updating patient:", error);
        alert("Failed to update patient");
      });
  };

  const filteredPatients = patients.filter((patient) =>
    patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="manage-patients-page">
      <Navbar />
      <div className="manage-patients-container">
        <h2>Manage Patient Records</h2>
        <input
          type="text"
          placeholder="Search by email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
        />
        <table className="patients-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.map((patient) => (
              <tr key={patient._id}>
                <td>{patient.name}</td>
                <td>{patient.email}</td>
                <td>
                  <button
                    className="view-btn"
                    onClick={() => handleView(patient._id)}
                  >
                    View
                  </button>
                  <button
                    className="update-btn"
                    onClick={() => handleView(patient._id)}
                  >
                    Update
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(patient._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedPatient && (
        <div className="update-modal">
          <div className="patient-modal-content">
            <h3>View and Update Patient Information</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const updatedData = {
                  name: e.target.name.value,
                  email: e.target.email.value,
                  contact_number: e.target.contact_number.value,
                  gender: e.target.gender.value,
                  date_of_birth: e.target.date_of_birth.value,
                  address: e.target.address.value,
                };
                handleUpdate(selectedPatient._id, updatedData);
              }}
            >
              <div>
                <label>Name:</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={selectedPatient.name}
                  required
                />
              </div>
              <div>
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  defaultValue={selectedPatient.email}
                  required
                />
              </div>
              <div>
                <label>Contact Number:</label>
                <input
                  type="text"
                  name="contact_number"
                  defaultValue={selectedPatient.contact_number}
                />
              </div>
              <div>
                <label>Gender:</label>
                <select name="gender" defaultValue={selectedPatient.gender}>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label>Date of Birth:</label>
                <input
                  type="date"
                  name="date_of_birth"
                  defaultValue={selectedPatient.date_of_birth}
                />
              </div>
              <div>
                <label>Address:</label>
                <textarea
                  name="address"
                  defaultValue={selectedPatient.address}
                ></textarea>
              </div>
              <button type="submit">Update</button>
              <button
                type="button"
                className="cancel-button"
                onClick={() => setSelectedPatient(null)}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagePatients;
