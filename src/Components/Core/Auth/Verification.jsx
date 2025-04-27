import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { verification } from "../../../services/operations/authApi";
import { setLoading, SetSignUpData } from "../../../slices/authSlice";
import axios from "axios";
import { locationEndpoints } from "../../../services/apis";
import verificationImage from "../../../assests/signup_image.jpg"; // Replace with your actual image path
import nityamNeedsLogo from "../../../assests/nityam_mlogo.png";
import { getNextRoute } from "../../Core/Auth/nextRoute";
export default function Verification() {
  const [document, setDocument] = useState(null);
  const [verificationMethod, setVerificationMethod] = useState("");
  const [address, setAddress] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const signUpData = useSelector((state) => state.auth.signUpData);
  // For skip confirmation modal
  const [showSkipModal, setShowSkipModal] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    fetchAccessToken();
    const interval = setInterval(() => {
      fetchAccessToken();
    }, 24 * 60 * 60 * 1000); // 24 hours

    return () => clearInterval(interval);
  }, []);

  const fetchAccessToken = async () => {
    toast.dismiss();
    try {
      const response = await axios.post(locationEndpoints.ACCESS_TOKEN);
      setAccessToken(response.data.access_token);
    } catch (error) {
      console.error("Error fetching the token:", error);
      toast.error("Failed to fetch access token.");
    }
  };

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    setTypingTimeout(
      setTimeout(() => {
        fetchSuggestions(e.target.value);
      }, 300)
    );
  };

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

  // Show the skip modal
  const handleShowSkipModal = () => {
    setShowSkipModal(true);
  };

  // Actually skip if user confirms
  const handleSkip = () => {
    dispatch(SetSignUpData({
      verificationDetails: { skipped: true, skippedAt: Date.now() }
    }));
    navigate(getNextRoute({ ...signUpData, verificationDetails: { skipped: true } }));
  };

  const handleSubmit = async (e) => {
    toast.dismiss();
    e.preventDefault();
    dispatch(setLoading(true));

    const formData = new FormData();

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

    await verification(formData, token, navigate, dispatch);
    dispatch(setLoading(false));
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Left Panel */}
      <div className="hidden md:flex md:w-1/2 relative">
        <img
          src={verificationImage}
          alt="Verification"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center p-6">
          <h2 className="text-3xl text-white font-bold mb-4">
            Account Verification
          </h2>
          <p className="text-white text-center max-w-sm">
            Verify your account using Aadhaar or Postal Card for a secure
            experience.
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex w-full md:w-1/2 justify-center items-center p-6 bg-gray-50">
        <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-md relative">
          <div className="text-center">
            <img
              src={nityamNeedsLogo}
              alt="Nityam needs"
              className="mx-auto h-20"
            />
          </div>
          <h2 className="text-2xl font-bold text-center mb-6 text-purple-600">
            Verify Your Account
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-lg font-semibold mb-2">
                Choose Verification Method
              </label>
              <div className="flex items-center mb-3">
                <input
                  type="radio"
                  id="aadhaar"
                  name="verificationMethod"
                  value="aadhaar"
                  checked={verificationMethod === "aadhaar"}
                  onChange={() => setVerificationMethod("aadhaar")}
                  className="mr-2 h-4 w-4 text-purple-600 focus:ring-purple-500"
                />
                <label htmlFor="aadhaar" className="text-sm text-gray-700">
                  Verify via Aadhaar Card
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="postalCard"
                  name="verificationMethod"
                  value="postalCard"
                  checked={verificationMethod === "postalCard"}
                  onChange={() => setVerificationMethod("postalCard")}
                  className="mr-2 h-4 w-4 text-purple-600 focus:ring-purple-500"
                />
                <label htmlFor="postalCard" className="text-sm text-gray-700">
                  Verify via Postal Card
                </label>
              </div>
            </div>

            {verificationMethod === "aadhaar" && (
              <div className="mb-6">
                <label className="block text-lg font-semibold mb-2">
                  Upload Aadhaar Card
                </label>
                <input
                  type="file"
                  onChange={(e) => setDocument(e.target.files[0])}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  accept=".jpg,.png,.pdf"
                />
              </div>
            )}

            {verificationMethod === "postalCard" && (
              <div className="mb-6">
                <label className="block text-lg font-semibold mb-2">
                  Enter Your Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={handleAddressChange}
                  placeholder="Enter your address"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none transition duration-200"
                />
                {suggestions.length > 0 && (
                  <ul className="mt-2 border border-gray-300 rounded-lg shadow-md bg-white max-h-40 overflow-y-auto">
                    {suggestions.map((suggestion, index) => (
                      <li
                        key={index}
                        className="p-2 hover:bg-purple-100 cursor-pointer transition duration-150"
                        onClick={() => {
                          setAddress(suggestion.formattedAddress);
                          setSuggestions([]); // Clear suggestions to close the dropdown
                        }}
                      >
                        {suggestion.formattedAddress}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition duration-200"
            >
              Submit Verification
            </button>
          </form>
          <button
            onClick={handleShowSkipModal}
            className="w-full mt-4 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition duration-200"
          >
            Skip
          </button>
        </div>
      </div>

      {/* Skip Confirmation Modal */}
      {showSkipModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white w-11/12 max-w-sm rounded-lg p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              Are you sure you want to skip?
            </h2>
            <p className="text-gray-700 mb-6">
              If you skip, your account will not be verified at this moment. You
              can complete this step later, but some features may be restricted.
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setShowSkipModal(false)}
                className="mr-2 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSkip}
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition duration-200"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
