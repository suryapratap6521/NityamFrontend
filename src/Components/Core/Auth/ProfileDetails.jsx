import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { profileDetails } from "../../../services/operations/authApi";
import { useDispatch, useSelector } from "react-redux";
import signup_image from "../../../assests/signup_image.jpg"; // Replace with your own image
import nityamNeedsLogo from "../../../assests/nityam_mlogo.png";
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

    // Gender validation
    if (!formData.gender) {
      formErrors.gender = "Gender is required.";
    }

    // DOB validation
    if (!formData.dateOfBirth) {
      formErrors.dateOfBirth = "Date of birth is required.";
    } else {
      // Check minimum age of 5 years
      const selectedDOB = new Date(formData.dateOfBirth);
      const now = new Date();
      const fiveYearsAgo = new Date(
        now.getFullYear() - 5,
        now.getMonth(),
        now.getDate()
      );
      if (selectedDOB > fiveYearsAgo) {
        formErrors.dateOfBirth = "You must be at least 5 years old to continue.";
      }
    }

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
    <div className="flex flex-col md:flex-row w-full min-h-screen">
      {/* Left side (image + overlay) */}
      <div className="hidden md:flex md:w-1/2 relative">
        <img
          src={signup_image}
          alt="Profile Info"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center text-white p-4">
          <h2 className="text-2xl font-bold mb-2">Complete Your Profile</h2>
          <p className="text-center max-w-xs">
            This helps us tailor the experience and serve you better.
          </p>
        </div>
      </div>

      {/* Right side (form) */}
      <div className="flex w-full md:w-1/2 justify-center items-center p-6">
        <div className="max-w-md w-full space-y-6">
          {/* Heading */}
          <div className="text-center">
            <img
              src={nityamNeedsLogo}
              alt="Nityam needs"
              className="mx-auto h-20"
            />
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-purple-600">Profile Details</h1>
            <p className="text-sm text-gray-500 mt-2">
              Fill out your information to continue
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Gender */}
            <div>
              <label className="block text-sm font-medium">Gender</label>
              <div className="flex items-center space-x-4 mt-2">
                {/* Male */}
                <label className="flex items-center text-gray-600">
                  <input
                    type="radio"
                    name="gender"
                    value="Male"
                    checked={formData.gender === "Male"}
                    onChange={handleChange}
                    className="w-4 h-4 text-purple-500 
                               focus:ring-2 focus:ring-purple-500"
                  />
                  <span className="ml-2">Male</span>
                </label>
                {/* Female */}
                <label className="flex items-center text-gray-600">
                  <input
                    type="radio"
                    name="gender"
                    value="Female"
                    checked={formData.gender === "Female"}
                    onChange={handleChange}
                    className="w-4 h-4 text-purple-500 
                               focus:ring-2 focus:ring-purple-500"
                  />
                  <span className="ml-2">Female</span>
                </label>
                {/* Other */}
                <label className="flex items-center text-gray-600">
                  <input
                    type="radio"
                    name="gender"
                    value="Other"
                    checked={formData.gender === "Other"}
                    onChange={handleChange}
                    className="w-4 h-4 text-purple-500 
                               focus:ring-2 focus:ring-purple-500"
                  />
                  <span className="ml-2">Other</span>
                </label>
              </div>
              {errors.gender && (
                <p className="text-xs text-red-600 mt-1">{errors.gender}</p>
              )}
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-sm font-medium">Date of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border border-gray-300 
                           rounded-md focus:outline-none focus:ring-2 
                           focus:ring-purple-500"
              />
              {errors.dateOfBirth && (
                <p className="text-xs text-red-600 mt-1">{errors.dateOfBirth}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 bg-purple-600 text-white rounded-md 
                         hover:bg-purple-700 transition font-semibold
                         focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetails;
