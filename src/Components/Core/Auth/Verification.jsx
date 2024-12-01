import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { verification } from "../../../services/operations/authApi"; // Import the verification API function
import { setLoading, SetSignUpData } from "../../../slices/authSlice"; // Update signup data action

export default function Verification() {
  const [document, setDocument] = useState(null); // File state for Aadhaar upload
  const [verificationMethod, setVerificationMethod] = useState(""); // State for selected verification method
  const [address, setAddress] = useState(""); // Address input
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token); // Access token from Redux store

  // Handle file upload (Aadhaar)
  const handleDocumentUpload = (e) => {
    setDocument(e.target.files[0]); // Store selected file in state
  };
  const handleSkip=()=>{
    navigate('/profession');
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true)); // Set loading state

    const formData = new FormData();

    // Conditionally add fields based on the selected verification method
    if (verificationMethod === "postalCard") {
      if (!address) {
        toast.error("Please provide an address for postal verification.");
        dispatch(setLoading(false));
        return;
      }
      formData.append("verificationByPostalCard", true);
      formData.append("address", address); // Address is required for postal card verification
    } else if (verificationMethod === "aadhaar") {
      if (!document) {
        toast.error("Please upload Aadhaar card for verification.");
        dispatch(setLoading(false));
        return;
      }
      formData.append("document", document); // Aadhaar upload required if selected
    } else {
      toast.error("Please select a verification method.");
      dispatch(setLoading(false));
      return;
    }

    // Call the verification API function
    await verification(formData, token, navigate, dispatch);

    dispatch(setLoading(false)); // Stop loading
  };

  return (
    <div className="verification-form-container p-4 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-6">Verify Your Account</h2>

      <form onSubmit={handleSubmit}>
        {/* Radio Buttons for Verification Method */}
        <div className="mb-4">
          <label className="block font-semibold mb-2">Choose Verification Method</label>
          <div className="flex items-center mb-2">
            <input
              type="radio"
              id="aadhaar"
              name="verificationMethod"
              value="aadhaar"
              checked={verificationMethod === "aadhaar"}
              onChange={() => setVerificationMethod("aadhaar")}
              className="mr-2"
            />
            <label htmlFor="aadhaar">Verify via Aadhaar Card</label>
          </div>
          <div className="flex items-center mb-2">
            <input
              type="radio"
              id="postalCard"
              name="verificationMethod"
              value="postalCard"
              checked={verificationMethod === "postalCard"}
              onChange={() => setVerificationMethod("postalCard")}
              className="mr-2"
            />
            <label htmlFor="postalCard">Verify via Postal Card</label>
          </div>
        </div>

        {/* Aadhaar Upload (Visible only if Aadhaar is selected) */}
        {verificationMethod === "aadhaar" && (
          <div className="mb-4">
            <label className="block font-semibold mb-2">Upload Aadhaar Card</label>
            <input
              type="file"
              onChange={handleDocumentUpload}
              className="w-full px-3 py-2 border rounded-lg"
              accept=".jpg,.png,.pdf"
              required
            />
          </div>
        )}

        {/* Address Field (Visible only if Postal Card is selected) */}
        {verificationMethod === "postalCard" && (
          <div className="mb-4">
            <label className="block font-semibold mb-2">Enter Your Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your address"
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Submit Verification
        </button>
      </form>
      <button onClick={handleSkip}>Skip</button>
    </div>
  );
}
