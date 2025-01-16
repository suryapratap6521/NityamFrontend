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
  });
  const [errors, setErrors] = useState({});
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpInput, setOtpInput] = useState("");
  const [timer, setTimer] = useState(30);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  const validateForm = () => {
    const errors = {};
    const phonePattern = /^[0-9]{10}$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.firstName) errors.firstName = "First name is required.";
    if (!phonePattern.test(formData.phoneNumber))
      errors.phoneNumber = "Phone number must be 10 digits.";
    if (!emailPattern.test(formData.email)) errors.email = "Invalid email.";
    if (!formData.password) errors.password = "Password is required.";
    if (formData.password !== formData.confirmPassword)
      errors.confirmPassword = "Passwords do not match.";

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const res = await sendotp(formData.phoneNumber, dispatch);
        if (res?.data?.success) {
          setShowOtpModal(true);
          setTimer(30);
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-300 to-yellow-200">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-3xl font-semibold text-center text-green-600 mb-6">
          Create Account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Fields */}
          <div className="flex space-x-4">
            <div className="w-1/2">
              <label className="block text-sm font-medium">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-green-400"
              />
              {errors.firstName && (
                <p className="text-sm text-red-600">{errors.firstName}</p>
              )}
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-medium">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-green-400"
              />
            </div>
          </div>

          {/* Contact Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Phone Number</label>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-green-400"
              />
              {errors.phoneNumber && (
                <p className="text-sm text-red-600">{errors.phoneNumber}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-green-400"
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email}</p>
              )}
            </div>
          </div>

          {/* Password Fields */}
          <div>
            <label className="block text-sm font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-green-400"
            />
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-green-400"
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-600">{errors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring focus:ring-green-300"
          >
            Sign Up
          </button>
        </form>
        <p className="mt-4 text-sm text-center">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-600 hover:underline cursor-pointer"
          >
            Login
          </span>
        </p>

        {/* OTP Modal */}
        <Modal isOpen={showOtpModal} ariaHideApp={false} className="modal">
          <div className="p-6">
            <h3 className="text-xl font-semibold text-green-600 mb-4">
              Verify OTP
            </h3>
            <form onSubmit={handleOtpSubmit}>
              <input
                type="text"
                maxLength="6"
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring focus:ring-green-400"
              />
              <button
                type="submit"
                className="mt-4 w-full py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                Submit
              </button>
            </form>
            {timer === 0 ? (
              <button
                onClick={async () => {
                  await sendotp(formData.phoneNumber, dispatch);
                  setTimer(30);
                }}
                className="mt-4 text-blue-600 underline"
              >
                Resend OTP
              </button>
            ) : (
              <p className="mt-2 text-sm">Resend OTP in {timer} seconds</p>
            )}
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Signup;
