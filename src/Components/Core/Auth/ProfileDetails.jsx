import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { profileDetails } from "../../../services/operations/authApi";
import { useDispatch, useSelector } from "react-redux";

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
        await profileDetails(formData, token, navigate, dispatch);
      } catch (error) {
        console.log("Error submitting profile details:", error);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-green-400 to-yellow-300 p-6">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-md p-8">
        <h2 className="text-2xl font-semibold text-center text-green-600 mb-6">Profile Details</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Gender Selection */}
          <div className="space-y-2">
            <label className="block text-gray-700 font-medium">Gender</label>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  checked={formData.gender === "Male"}
                  onChange={handleChange}
                  className="w-4 h-4 text-green-500 focus:ring-green-400"
                />
                <label className="ml-2 text-gray-600">Male</label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  checked={formData.gender === "Female"}
                  onChange={handleChange}
                  className="w-4 h-4 text-green-500 focus:ring-green-400"
                />
                <label className="ml-2 text-gray-600">Female</label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="Other"
                  checked={formData.gender === "Other"}
                  onChange={handleChange}
                  className="w-4 h-4 text-green-500 focus:ring-green-400"
                />
                <label className="ml-2 text-gray-600">Other</label>
              </div>
            </div>
            {errors.gender && <span className="text-red-500 text-sm">{errors.gender}</span>}
          </div>

          {/* Date of Birth */}
          <div className="space-y-2">
            <label className="block text-gray-700 font-medium">Date of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            {errors.dateOfBirth && <span className="text-red-500 text-sm">{errors.dateOfBirth}</span>}
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md shadow-md transition duration-300"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileDetails;
