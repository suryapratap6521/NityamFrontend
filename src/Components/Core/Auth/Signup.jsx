import React, { useState, useEffect } from "react";
import { sendotp, signUp } from "../../../services/operations/authApi"; // Import your APIs
import { useDispatch } from "react-redux";
import Loader from "../../../Components/Common/Loader"; // Optional loading component
import Modal from "react-modal"; // For modal
import {useNavigate} from 'react-router-dom'
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
  const navigate=useNavigate();
  const [errors, setErrors] = useState({});
  const [showOtpModal, setShowOtpModal] = useState(false); // Show OTP modal
  const [otpInput, setOtpInput] = useState(""); // For OTP input in the modal
  const [timer, setTimer] = useState(30); // OTP Timer
  const dispatch = useDispatch();

  // Timer countdown effect
  useEffect(() => {
    let countdown;
    if (showOtpModal && timer > 0) {
      countdown = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } 
    return () => clearInterval(countdown); // Cleanup interval on unmount
  }, [showOtpModal, timer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
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
        // Await the result of the dispatch
        const res = await sendotp(formData.phoneNumber, dispatch);
        console.log(res.data.success, "---------> OTP sent response");

        // If OTP is successfully sent, show the OTP modal
        if (res.data.success === true) {
          setShowOtpModal(true); // Show OTP modal
          setTimer(30); // Reset timer
        } else {
          console.log("Failed to send OTP");
        }
      } catch (error) {
        console.log("Error sending OTP:", error);
      }
    } else {
      console.log("Form contains errors.");
    }
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    // Dispatch the signup action with the OTP included
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
    } else {
      console.log("Invalid OTP.");
    }
  };

  return (
    <div className="signup-form">
      <h2>Signup Form</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>First Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />
          {errors.firstName && <span className="error">{errors.firstName}</span>}
        </div>

        <div>
          <label>Last Name</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Phone Number</label>
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
          />
          {errors.phoneNumber && (
            <span className="error">{errors.phoneNumber}</span>
          )}
        </div>

        <div>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>

        <div>
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <span className="error">{errors.password}</span>}
        </div>

        <div>
          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          {errors.confirmPassword && (
            <span className="error">{errors.confirmPassword}</span>
          )}
        </div>

        <button type="submit">Signup</button>
      </form>

      {/* OTP Modal */}
      <Modal isOpen={showOtpModal}>
        <div className="otp-modal-header">
          <h2>Enter OTP</h2>
          <button onClick={() => setShowOtpModal(false)} className="close-modal">
            &times; {/* Close button (cross icon) */}
          </button>
        </div>
        <form onSubmit={handleOtpSubmit}>
          <div>
            <label>OTP</label>
            <input
              type="text"
              value={otpInput}
              onChange={(e) => setOtpInput(e.target.value)}
              maxLength="6" // Assuming OTP is 6 digits
            />
          </div>

          <button type="submit">Submit OTP</button>
        </form>
        <p>Time remaining: {timer} seconds</p>

        {/* "Resend OTP" button becomes visible when the timer reaches 0 */}
        {timer === 0 && (
          <button
            onClick={async () => {
              await sendotp(formData.phoneNumber, dispatch);
              setTimer(30); // Reset timer when OTP is resent
            }}
          >
            Resend OTP
          </button>
        )}
      </Modal>
    </div>
  );
};

export default Signup;
