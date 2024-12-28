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

  const access_token = async () => {
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
    if (typingTimeout) clearTimeout(typingTimeout);
    setTypingTimeout(
      setTimeout(() => {
        fetchSuggestions(e.target.value);
      }, 300) // Debounce interval
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

  const handleSkip = () => {
    navigate("/profession");
  };

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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-green-200 to-yellow-100">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Verify Your Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-lg font-semibold mb-2">Choose Verification Method</label>
            <div className="flex items-center mb-3">
              <input
                type="radio"
                id="aadhaar"
                name="verificationMethod"
                value="aadhaar"
                checked={verificationMethod === "aadhaar"}
                onChange={() => setVerificationMethod("aadhaar")}
                className="mr-2"
              />
              <label htmlFor="aadhaar" className="text-sm">Verify via Aadhaar Card</label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="postalCard"
                name="verificationMethod"
                value="postalCard"
                checked={verificationMethod === "postalCard"}
                onChange={() => setVerificationMethod("postalCard")}
                className="mr-2"
              />
              <label htmlFor="postalCard" className="text-sm">Verify via Postal Card</label>
            </div>
          </div>

          {verificationMethod === "aadhaar" && (
            <div className="mb-6">
              <label className="block text-lg font-semibold mb-2">Upload Aadhaar Card</label>
              <input
                type="file"
                onChange={(e) => setDocument(e.target.files[0])}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                accept=".jpg,.png,.pdf"
              />
            </div>
          )}

          {verificationMethod === "postalCard" && (
            <div className="mb-6">
              <label className="block text-lg font-semibold mb-2">Enter Your Address</label>
              <input
                type="text"
                value={address}
                onChange={handleAddressChange}
                placeholder="Enter your address"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:outline-none"
              />
              {suggestions.length > 0 && (
                <ul className="mt-2 border border-gray-300 rounded-lg shadow-md bg-white max-h-40 overflow-y-auto">
                  {suggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      className="p-2 hover:bg-yellow-200 cursor-pointer"
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
            className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
          >
            Submit Verification
          </button>
        </form>
        <button
          onClick={handleSkip}
          className="w-full mt-4 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
        >
          Skip
        </button>
      </div>
    </div>
  );
}
