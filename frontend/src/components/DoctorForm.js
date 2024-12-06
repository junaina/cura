import React from "react";

const DoctorForm = ({ formData, handleChange, errors }) => {
  return (
    <div className="doctor-form">
      <h1 className="doctor-form-header">Sign Up as a Doctor</h1>
      <form>
        <div className="input-group">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            required
            className={errors.firstName ? "error-field" : ""}
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            required
            className={errors.lastName ? "error-field" : ""}
          />
        </div>
        <input
          type="date"
          name="dob"
          placeholder="Date of Birth"
          value={formData.dob}
          onChange={handleChange}
          required
        />

        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          required
          className={errors.gender ? "error-field" : ""}
        >
          <option value="">Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        <input
          type="text"
          name="contactNumber"
          placeholder="Contact Number"
          value={formData.contactNumber}
          onChange={handleChange}
          required
          className={errors.contactNumber ? "error-field" : ""}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className={errors.email ? "error-field" : ""}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className={errors.password ? "error-field" : ""}
        />
        <input
          type="text"
          name="specialization"
          placeholder="Specialization"
          value={formData.specialization}
          onChange={handleChange}
          required
          className={errors.specialization ? "error-field" : ""}
        />
        <input
          type="text"
          name="medicalLicenseNumber"
          placeholder="Medical License Number"
          value={formData.medicalLicenseNumber}
          onChange={handleChange}
          required
          className={errors.medicalLicenseNumber ? "error-field" : ""}
        />
        <input
          type="number"
          name="experience"
          placeholder="Years of Experience"
          value={formData.experience}
          onChange={handleChange}
          required
          className={errors.experience ? "error-field" : ""}
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          value={formData.city}
          onChange={handleChange}
          required
          className={errors.city ? "error-field" : ""}
        />
        <textarea
          name="about"
          placeholder="About You"
          value={formData.about}
          onChange={handleChange}
          required
          className={errors.about ? "error-field" : ""}
        />
      </form>
    </div>
  );
};

export default DoctorForm;
