import React, { useState } from "react";
import DoctorForm from "../components/DoctorForm";
import TimeSlotTable from "../components/TimeSlotTable";
import "../styles/DoctorSignup.css";
import axios from "axios";

const DoctorSignup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    gender: "",
    contactNumber: "",
    email: "",
    password: "",
    specialization: "",
    medicalLicenseNumber: "",
    experience: "",
    city: "",
    about: "",
  });

  const [slots, setSlots] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSlotChange = (e) => {
    setSlots({ ...slots, [e.target.name]: e.target.checked });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({ ...formData, [name]: files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare payload
    const payload = { ...formData, slots };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/doctors/signup",
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert(response.data.message);
    } catch (error) {
      alert(error.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="bg-container">
      <div className="doctor-signup-left">
        <a href="/Signup" className="back-to-regular-signup">
          Back to Regular Signup
        </a>
        <DoctorForm
          formData={formData}
          handleChange={handleChange}
          handleFileChange={handleFileChange}
        />
      </div>
      <div className="doctor-signup-right">
        <TimeSlotTable slots={slots} handleSlotChange={handleSlotChange} />
        <button onClick={handleSubmit} className="submit-button">
          Send for Approval
        </button>
      </div>
    </div>
  );
};

export default DoctorSignup;
