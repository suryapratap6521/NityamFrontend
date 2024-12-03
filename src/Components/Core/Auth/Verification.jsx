import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { verification } from "../../../services/operations/authApi";
import { setLoading } from "../../../slices/authSlice";
import axios from "axios";
import { locationEndpoints } from "../../../services/apis";

export default function Verification() {
  const [document, setDocument] = useState(null); // File state for Aadhaar upload
  const [verificationMethod, setVerificationMethod] = useState(""); // State for selected verification method
  const [address, setAddress] = useState(""); // State for address
  const [accessToken, setAccessToken] = useState(""); // State for access token
  const [suggestions, setSuggestions] = useState([]); // State for address suggestions
  const [typingTimeout, setTypingTimeout] = useState(null); // Timeout for debounce
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token); // Access token from Redux store

  // Automatically fetch token every 24 hours
  useEffect(() => {
    access_token();
    const interval = setInterval(() => {
      access_token();
    }, 24 * 60 * 60 * 1000); // 24 hours

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  // Fetch access token
  const access_token = async () => {
    try {
      const response = await axios.post(locationEndpoints.ACCESS_TOKEN);
      setAccessToken(response.data.access_token); // Store access token
      console.log(response.data.access_token, "----> Access Token");
    } catch (error) {
      console.error("Error fetching the token:", error);
      toast.error("Failed to fetch access token.");
    }
  };

  // Fetch location data with debounce
  const handleAddressChange = (e) => {
    setAddress(e.target.value);
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    setTypingTimeout(
      setTimeout(() => {
        fetchSuggestions(e.target.value);
      }, 50)
    );
  };

  // Fetch suggestions for address
  const fetchSuggestions = async (query) => {
    if (!query) return setSuggestions([]);
    try {
      const response = await axios.post(locationEndpoints.GET_AREAS, {
        address: query,
        access_token: accessToken,
      });
      setSuggestions(response.data.copResults || []);
    } catch (error) {
      console.error("Error fetching areas:", error);
    }
  };

  // Skip handler
  const handleSkip = () => {
    navigate("/profession");
  };

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
      formData.append("address", address);
    } else if (verificationMethod === "aadhaar") {
      if (!document) {
        toast.error("Please upload Aadhaar card for verification.");
        dispatch(setLoading(false));
        return;
      }
      formData.append("document", document);
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
          <label className="block font-semibold mb-2">
            Choose Verification Method
          </label>
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

        {/* Aadhaar Upload */}
        {verificationMethod === "aadhaar" && (
          <div className="mb-4">
            <label className="block font-semibold mb-2">
              Upload Aadhaar Card
            </label>
            <input
              type="file"
              onChange={(e) => setDocument(e.target.files[0])}
              className="w-full px-3 py-2 border rounded-lg"
              accept=".jpg,.png,.pdf"
            />
          </div>
        )}

        {/* Address Field */}
        {verificationMethod === "postalCard" && (
          <div className="mb-4">
            <label className="block font-semibold mb-2">Enter Your Address</label>
            <input
              type="text"
              value={address}
              onChange={handleAddressChange}
              placeholder="Enter your address"
              className="w-full px-3 py-2 border rounded-lg"
            />
            {suggestions.length > 0 && (
              <ul className="mt-2 border border-gray-300 rounded-lg shadow-lg bg-white max-h-40 overflow-y-auto">
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className="p-2 hover:bg-gray-200 cursor-pointer"
                    onClick={() => setAddress(suggestion.formattedAddress)}
                  >
                    {suggestion.formattedAddress}
                  </li>
                ))}
              </ul>
            )}
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

      <button
        onClick={handleSkip}
        className="mt-4 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
      >
        Skip
      </button>
    </div>
  );
}
