import React, { useState, useEffect } from "react";
import { sendotp, signUp } from "../../../services/operations/authApi"; 
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
    otp: "",
  });
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpInput, setOtpInput] = useState("");
  const [timer, setTimer] = useState(30);
  const dispatch = useDispatch();

  useEffect(() => {
    let countdown;
    if (showOtpModal && timer > 0) {
      countdown = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }
    return () => clearInterval(countdown);
  }, [showOtpModal, timer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    let formErrors = {};
    const phonePattern = /^[0-9]{10}$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.firstName) formErrors.firstName = "First name is required.";
    if (!phonePattern.test(formData.phoneNumber))
      formErrors.phoneNumber = "Phone number must be 10 digits.";
    if (!emailPattern.test(formData.email))
      formErrors.email = "Invalid email address.";
    if (!formData.password) formErrors.password = "Password is required.";
    if (formData.password !== formData.confirmPassword)
      formErrors.confirmPassword = "Passwords do not match.";

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const res = await sendotp(formData.phoneNumber, dispatch);
        if (res.data.success === true) {
          setShowOtpModal(true);
          setTimer(30);
        }
      } catch (error) {
        console.error("Error sending OTP:", error);
      }
    }
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    if (otpInput.length === 6) {
      dispatch(
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-300 to-yellow-200">
      <div className="w-full max-w-lg p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold text-center text-green-600 mb-4">
          Signup
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Parallel Input Fields: First Name and Last Name */}
          <div className="flex flex-wrap gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-green-400"
              />
              {errors.firstName && (
                <p className="text-sm text-red-600">{errors.firstName}</p>
              )}
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-green-400"
              />
            </div>
          </div>

          {/* Parallel Input Fields: Phone Number and Email */}
          <div className="flex flex-wrap gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-green-400"
              />
              {errors.phoneNumber && (
                <p className="text-sm text-red-600">{errors.phoneNumber}</p>
              )}
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-green-400"
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email}</p>
              )}
            </div>
          </div>

          {/* Password Fields */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-green-400"
            />
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-green-400"
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-600">{errors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring focus:ring-green-300"
          >
            Signup
          </button>
        </form>

        {/* OTP Modal */}
        <Modal isOpen={showOtpModal} className="modal">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-green-600">
              Enter OTP
            </h2>
            <form onSubmit={handleOtpSubmit}>
              <input
                type="text"
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value)}
                className="w-full mt-2 p-2 border border-gray-300 rounded-md focus:ring focus:ring-green-400"
                maxLength="6"
              />
              <button
                type="submit"
                className="w-full mt-4 py-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                Submit OTP
              </button>
            </form>
            {timer === 0 && (
              <button
                onClick={async () => {
                  await sendotp(formData.phoneNumber, dispatch);
                  setTimer(30);
                }}
                className="mt-4 text-sm text-blue-600 underline"
              >
                Resend OTP
              </button>
            )}
            <p className="text-sm mt-2">Time remaining: {timer} seconds</p>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Signup;
