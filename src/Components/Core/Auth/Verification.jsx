import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { verification } from "../../../services/operations/authApi";
import { setLoading } from "../../../slices/authSlice";
import { fetchAccessToken, fetchAreaSuggestions } from "../../../config/fetching_location";

export default function Verification() {
  const [document, setDocument] = useState(null);
  const [verificationMethod, setVerificationMethod] = useState("");
  const [address, setAddress] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    // Fetch access token and set interval to refresh it every 24 hours
    const fetchToken = async () => {
      try {
        const token = await fetchAccessToken();
        setAccessToken(token);
      } catch (error) {
        console.error("Error initializing access token:", error);
      }
    };
    fetchToken();
    const interval = setInterval(fetchToken, 24 * 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  // Fetch suggestions with debounce
  const handleAddressChange = (e) => {
    setAddress(e.target.value);
    if (typingTimeout) clearTimeout(typingTimeout);
    setTypingTimeout(
      setTimeout(async () => {
        try {
          const results = await fetchAreaSuggestions(e.target.value, accessToken);
          setSuggestions(results);
        } catch (error) {
          console.error("Error fetching suggestions:", error);
        }
      }, 50)
    );
  };

  const handleSkip = () => navigate("/profession");

  const handleSubmit = async (e) => {
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
    <div className="verification-form-container p-4 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-6">Verify Your Account</h2>
      <form onSubmit={handleSubmit}>
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

        {verificationMethod === "aadhaar" && (
          <div className="mb-4">
            <label className="block font-semibold mb-2">Upload Aadhaar Card</label>
            <input
              type="file"
              onChange={(e) => setDocument(e.target.files[0])}
              className="w-full px-3 py-2 border rounded-lg"
              accept=".jpg,.png,.pdf"
            />
          </div>
        )}

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
