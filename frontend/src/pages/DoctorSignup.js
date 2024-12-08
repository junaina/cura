import React, { useState } from "react";
import DoctorForm from "../components/DoctorForm";
import TimeSlotTable from "../components/TimeSlotTable";
import "../styles/DoctorSignup.css";
import axios from "axios";

// Initialize slots with all days and times set to false
const initializeSlots = () => {
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const times = [
    "8:00",
    "9:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
  ];
  const slots = {};

  days.forEach((day) => {
    times.forEach((time) => {
      slots[`${day}-${time}`] = false;
    });
  });

  return slots;
};

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

  const [slots, setSlots] = useState(() => initializeSlots());
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: false });
  };

  const handleSlotChange = (e) => {
    setSlots({ ...slots, [e.target.name]: e.target.checked });
  };

  const validateForm = () => {
    const requiredFields = [
      "firstName",
      "lastName",
      "dob",
      "gender",
      "contactNumber",
      "email",
      "password",
      "specialization",
      "medicalLicenseNumber",
      "experience",
      "city",
      "about",
    ];

    const newErrors = {};

    // Validate required fields
    requiredFields.forEach((field) => {
      if (!formData[field] || formData[field].trim() === "") {
        newErrors[field] = `${field} is required`;
      }
    });

    // Validate slots
    const hasSelectedSlots = Object.values(slots).some(
      (value) => value === true
    );
    if (!hasSelectedSlots) {
      newErrors["slots"] = "At least one availability slot must be selected";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      alert(
        "Please fill in all required fields and select at least one availability slot."
      );
      return;
    }

    // Transform slots for the backend
    const formattedSlots = Object.entries(slots)
      .filter(([key, value]) => value === true)
      .map(([key]) => {
        const [day, time] = key.split("-");
        return { day, time };
      });

    const payload = {
      ...formData,
      name: `${formData.firstName} ${formData.lastName}`,
      slots: formattedSlots,
    };

    try {
      console.log("Payload being sent to backend:", payload);

      const response = await axios.post(
        "http://localhost:5000/api/doctors/signup",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      alert(response.data.message);
    } catch (error) {
      console.error("Error response:", error.response); // Log backend response
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
          errors={errors}
        />
      </div>
      <div className="doctor-signup-right">
        <TimeSlotTable slots={slots} handleSlotChange={handleSlotChange} />
        {errors["slots"] && (
          <p className="error-message">Please select at least one slot.</p>
        )}
        <form onSubmit={handleSubmit}>
          <button type="submit" className="submit-button">
            Send for Approval
          </button>
        </form>
      </div>
    </div>
  );
};

export default DoctorSignup;
