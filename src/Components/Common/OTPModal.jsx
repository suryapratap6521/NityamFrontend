// components/OTPModal.js
import React, { useState } from "react";
import { toast } from "react-hot-toast";

const OTPModal = ({ onSubmit, onClose, phoneNumber }) => {
  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(otp);
    } catch (error) {
      toast.error(error.message || "OTP verification failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-96">
        <h3 className="text-xl font-semibold text-green-600 mb-4">Verify OTP</h3>
        <p className="mb-4">Enter the OTP sent to {phoneNumber}</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            maxLength="6"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full px-3 py-2 border rounded-md mb-4"
            placeholder="Enter OTP"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-400"
          >
            {isSubmitting ? "Verifying..." : "Verify"}
          </button>
        </form>
        <button
          onClick={onClose}
          className="mt-4 w-full py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default OTPModal;