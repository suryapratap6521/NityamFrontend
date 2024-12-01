import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { profileDetails } from "../../../services/operations/authApi"
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
const ProfileDetails = () => {
  const [formData, setFormData] = useState({
    gender: "",
    dateOfBirth: "",
  });
  const [errors, setErrors] = useState({});
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Validate form fields
  const validateForm = () => {
    let formErrors = {};
    if (!formData.gender) formErrors.gender = "Gender is required.";
    if (!formData.dateOfBirth) formErrors.dateOfBirth = "Date of birth is required.";

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        // Call the profileDetails API
        await profileDetails(formData, token, navigate,dispatch);
      } catch (error) {
        console.log("Error submitting profile details:", error);
        
      }
    }
  };

  return (
    <div className="gender-dateOfBirth-form">
      <h2>Profile Details</h2>
      <form onSubmit={handleSubmit}>
        {/* Gender Radio Buttons */}
        <div>
          <label>Gender</label>
          <div>
            <input
              type="radio"
              name="gender"
              value="Male"
              checked={formData.gender === "Male"}
              onChange={handleChange}
            />
            <label>Male</label>
          </div>
          <div>
            <input
              type="radio"
              name="gender"
              value="Female"
              checked={formData.gender === "Female"}
              onChange={handleChange}
            />
            <label>Female</label>
          </div>
          <div>
            <input
              type="radio"
              name="gender"
              value="Other"
              checked={formData.gender === "Other"}
              onChange={handleChange}
            />
            <label>Other</label>
          </div>
          {errors.gender && <span className="error">{errors.gender}</span>}
        </div>

        {/* Date of Birth */}
        <div>
          <label>Date of Birth</label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
          />
          {errors.dateOfBirth && <span className="error">{errors.dateOfBirth}</span>}
        </div>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default ProfileDetails;
