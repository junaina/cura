import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/ViewPrescriptions.css";
import PatientDashNav from "../components/patientDashNav";

const ViewPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const patientId = localStorage.getItem("patient_id"); // Replace with actual logic
        const response = await axios.get(
          `/api/patient-prescriptions/${patientId}`
        );
        setPrescriptions(response.data);
        setLoading(false);
      } catch (err) {
        setError(
          err.response?.data?.message || "Error fetching prescriptions."
        );
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, []);

  if (loading) return <p>Loading prescriptions...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="view-prescriptions-page">
      <PatientDashNav />
      <div className="view-prescriptions-content">
        {" "}
        <h1 className="main-header">My Prescriptions</h1>
        {prescriptions.length > 0 ? (
          <div className="prescription-list">
            {prescriptions.map((prescription) => (
              <div className="prescription-card" key={prescription._id}>
                <h3>Prescribed by Dr. {prescription.doctor_id.name}</h3>
                <p>
                  <strong>Specialization:</strong>{" "}
                  {prescription.doctor_id.specialization}
                </p>
                <h4>Medications:</h4>
                <ul>
                  {prescription.medications.map((med, index) => (
                    <li key={index}>
                      {med.medicine} - {med.dosage} for {med.duration}
                    </li>
                  ))}
                </ul>
                {prescription.notes && (
                  <p>
                    <strong>Notes:</strong> {prescription.notes}
                  </p>
                )}
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(prescription.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p>No prescriptions found.</p>
        )}
      </div>
    </div>
  );
};

export default ViewPrescriptions;
