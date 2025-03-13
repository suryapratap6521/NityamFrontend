import React, { useState, useEffect } from "react";
import { sendotp, signUp } from "../../../services/operations/authApi";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import signup_image from "../../../assests/signup_image.jpg";
import nityamNeedsLogo from "../../../assests/nityam_mlogo.png";
// ^ Replace with your actual path & file name

import { sendotp, signUp } from "../../../services/operations/authApi"; // Import your APIs
import { useDispatch, useSelector } from 'react-redux';
import Loader from "../../../Components/Common/Loader"; // Optional loading component
import Modal from "react-modal"; // For modal
import { useNavigate } from 'react-router-dom'
const Signup = () => {

  const { loading } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpInput, setOtpInput] = useState("");
  const [timer, setTimer] = useState(300); // 5 minutes = 300 seconds
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Timer effect for OTP
  useEffect(() => {
    let countdown;
    if (showOtpModal && timer > 0) {
      countdown = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(countdown);
  }, [showOtpModal, timer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Improved validations
  const validateForm = () => {
    const newErrors = {};
    const phonePattern = /^[0-9]{10}$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.firstName) newErrors.firstName = "First name is required.";
    if (!formData.lastName) newErrors.lastName = "Last name is required.";

    if (!phonePattern.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Phone number must be 10 digits.";
    }
    if (!emailPattern.test(formData.email)) {
      newErrors.email = "Invalid email.";
    }
    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const res = await sendotp(formData.phoneNumber, formData.email, dispatch);
        if (res?.data?.success) {
          setShowOtpModal(true);
          setTimer(300); // reset to 5 minutes
        }
      } catch (error) {
        console.error("Error sending OTP:", error);
      }
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (otpInput.length === 6) {
      await dispatch(
        signUp(
          formData.firstName,
          formData.lastName,
          formData.email,
          formData.password,
          formData.confirmPassword,
          formData.phoneNumber,
          otpInput,
          navigate
        )
      );
    }
  };

  const handleGoogleLogin = () => {
    // Redirect to your backend Google OAuth endpoint.
    window.location.href = 'http://localhost:8080/api/v1/auth/google';
  };

  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen">
      {/* Left side (image + text) */}
      <div className="hidden md:flex md:w-1/2 relative">
        <img
          src={signup_image}
          alt="Community"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center text-white p-4">
          <h2 className="text-2xl font-bold mb-2">Connect With Your Community</h2>
          <p className="text-center max-w-xs">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore.
          </p>
        </div>
      </div>

      {/* Right side (signup form) */}
      <div className="flex w-full md:w-1/2 justify-center items-center p-4">
        <div className="max-w-md w-full space-y-6">
          {/* Top heading (replace text with your logo image) */}
          <div className="text-center">
            <img
              src={nityamNeedsLogo}
              alt="Nityam needs"
              className="mx-auto h-20"
            />
          </div>

          {/* Continue with Google Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="flex items-center justify-center w-full bg-white border border-gray-300 
                       rounded-md py-2 text-sm font-medium hover:bg-gray-100 transition
                       focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {/* Simple inline Google icon (replace with an actual icon if you prefer) */}
            <svg
              className="w-5 h-5 mr-2"
              viewBox="0 0 533.5 544.3"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="#4285F4"
                d="M533.5 278.4c0-15.6-1.3-30.7-3.8-45.3H272v85.7h146.9a125.9 125.9 0 0 1-54.5 82.6v68h88.2c51.4-47.2 80.9-116.8 80.9-191z"
              />
              <path
                fill="#34A853"
                d="M272 544.3c73.5 0 135.1-24.5 180.1-66.4l-88.2-68c-23.6 16-54 25.4-91.9 25.4a158.4 158.4 0 0 1-149.1-109h-89.2v68.5A272 272 0 0 0 272 544.3z"
              />
              <path
                fill="#FBBC04"
                d="M122.9 326.3a158.5 158.5 0 0 1 0-108.3v-68.5H33.7a272 272 0 0 0 0 245.3l89.2-68.5z"
              />
              <path
                fill="#EA4335"
                d="M272 105.7c39.8 0 75.5 13.7 103.7 40.7l77.7-77.7C430 24.2 368.4 0 272 0A272 272 0 0 0 33.7 149.5l89.2 68.5c21-64.7 81.6-112.3 149.1-112.3z"
              />
            </svg>
            Continue with Google
          </button>

          {/* Small divider text */}
          <div className="flex items-center justify-center">
            <span className="h-px bg-gray-300 w-1/5"></span>
            <span className="mx-2 text-sm text-gray-400">OR</span>
            <span className="h-px bg-gray-300 w-1/5"></span>
          </div>

          {/* Sign Up Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* First and Last Name */}
            <div className="flex flex-col md:flex-row md:space-x-4">
              <div className="md:w-1/2">
                <label className="block text-sm font-medium">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 
                             rounded-md focus:outline-none focus:ring-2 
                             focus:ring-purple-500"
                />
                {errors.firstName && (
                  <p className="text-xs text-red-600 mt-1">{errors.firstName}</p>
                )}
              </div>
              <div className="md:w-1/2 mt-4 md:mt-0">
                <label className="block text-sm font-medium">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 
                             rounded-md focus:outline-none focus:ring-2 
                             focus:ring-purple-500"
                />
                {errors.lastName && (
                  <p className="text-xs text-red-600 mt-1">{errors.lastName}</p>
                )}
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium">Phone Number</label>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border border-gray-300 
                           rounded-md focus:outline-none focus:ring-2 
                           focus:ring-purple-500"
              />
              {errors.phoneNumber && (
                <p className="text-xs text-red-600 mt-1">{errors.phoneNumber}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border border-gray-300 
                           rounded-md focus:outline-none focus:ring-2 
                           focus:ring-purple-500"
              />
              {errors.email && (
                <p className="text-xs text-red-600 mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="relative">
              <label className="block text-sm font-medium">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border border-gray-300 
                           rounded-md focus:outline-none focus:ring-2 
                           focus:ring-purple-500 pr-10"
              />
              {/* Toggle icon */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-12 right-3 text-gray-500 hover:text-gray-700 
                           focus:outline-none focus:ring-2 focus:ring-purple-500 
                           rounded"
              >
                {showPassword ? (
                  // Eye slash icon
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19.5C7.857 19.5 4.25 16.833 2.25 12c.66-1.66 1.71-3.156 3.05-4.45M9.53 9.53a3 3 0 014.24 4.24"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 15l6 6m-6-6l-6 6"
                    />
                  </svg>
                ) : (
                  // Eye icon
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M1.42 12C2.67 7.47 6.9 4 12 4s9.33 3.47 10.58 8c-1.25 4.53-5.48 8-10.58 8S2.67 16.53 1.42 12z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9a3 3 0 110 6 3 3 0 010-6z"
                    />
                  </svg>
                )}
              </button>
              {errors.password && (
                <p className="text-xs text-red-600 mt-1">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <label className="block text-sm font-medium">Confirm Password</label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border border-gray-300 
                           rounded-md focus:outline-none focus:ring-2 
                           focus:ring-purple-500 pr-10"
              />
              {/* Toggle icon */}
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute top-12 right-3 text-gray-500 hover:text-gray-700 
                           focus:outline-none focus:ring-2 focus:ring-purple-500 
                           rounded"
              >
                {showConfirmPassword ? (
                  // Eye slash icon
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19.5C7.857 19.5 4.25 16.833 2.25 12c.66-1.66 1.71-3.156 3.05-4.45M9.53 9.53a3 3 0 014.24 4.24"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 15l6 6m-6-6l-6 6"
                    />
                  </svg>
                ) : (
                  // Eye icon
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M1.42 12C2.67 7.47 6.9 4 12 4s9.33 3.47 10.58 8c-1.25 4.53-5.48 8-10.58 8S2.67 16.53 1.42 12z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9a3 3 0 110 6 3 3 0 010-6z"
                    />
                  </svg>
                )}
              </button>
              {errors.confirmPassword && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Sign Up Button */}
            <button
              type="submit"
              className="w-full py-3 bg-purple-600 text-white rounded-md 
                         hover:bg-purple-700 transition font-semibold
                         focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              Sign Up
            </button>
          </form>

          {/* Already have account? */}
          <p className="text-center text-sm mt-4">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-purple-600 hover:underline"
            >
              Login Here
            </button>
          </p>
        </div>
      </div>

      {/* OTP Modal */}
      <Modal
        isOpen={showOtpModal}
        ariaHideApp={false}
        className="fixed inset-0 flex items-center justify-center"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <div className="bg-white p-6 rounded-md shadow-md w-full max-w-sm relative">
          <button
            type="button"
            className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 
                       focus:outline-none focus:ring-2 focus:ring-purple-500 
                       rounded"
            onClick={() => setShowOtpModal(false)}
          >
            &times;
          </button>
          <h3 className="text-xl font-semibold text-purple-600 mb-4 text-center">
            Verify OTP
          </h3>
          <form onSubmit={handleOtpSubmit}>
            <input
              type="text"
              maxLength="6"
              value={otpInput}
              onChange={(e) => setOtpInput(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 
                         rounded-md focus:ring-2 focus:ring-purple-500 
                         focus:outline-none"
              placeholder="Enter 6-digit OTP"
            />
            <button
              type="submit"
              className="mt-4 w-full py-2 bg-purple-600 text-white 
                         rounded-md hover:bg-purple-700 transition
                         focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              Submit
            </button>
          </form>
          {timer === 0 ? (
            <button
              onClick={async () => {
                await sendotp(formData.phoneNumber, formData.email, dispatch);
                setTimer(300);
              }}
              className="mt-4 text-blue-600 underline block text-center 
                         focus:outline-none focus:ring-2 focus:ring-purple-500 
                         rounded"
            >
              Resend OTP
            </button>
          ) : (
            <p className="mt-2 text-sm text-center">
              Resend OTP in {timer} seconds
            </p>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default Signup;
