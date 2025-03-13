import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { CitySelect, StateSelect } from "react-country-state-city";
import { communityAddress } from "../../../services/operations/authApi";
import nityamNeedsLogo from "../../../assests/nityam_mlogo.png";
import communityImage from "../../../assests/signup_image.jpg";

const CommunityAddress = () => {
  // Default country is India
  const [formData, setFormData] = useState({
    country: "India",
    state: "",
    city: "",
    pincode: "",
  });
  const [countryId] = useState(101); // India
  const [stateId, setStateId] = useState(0);
  const [pincodeList, setPincodeList] = useState([]);
  const [isOtherPincode, setIsOtherPincode] = useState(false);

  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Update form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Fetch pincodes whenever city changes
  useEffect(() => {
    const fetchPincodes = async () => {
      if (formData.city) {
        try {
          const response = await fetch(
            `https://api.postalpincode.in/postoffice/${formData.city}`
          );
          const data = await response.json();
          if (data[0]?.Status === "Success") {
            const filteredPincodes = data[0].PostOffice.map(
              (office) => office.Pincode
            );
            setPincodeList([...new Set(filteredPincodes)]);
          } else {
            setPincodeList([]);
          }
        } catch (error) {
          console.error("Error fetching pincodes:", error);
          setPincodeList([]);
        }
      }
    };

    fetchPincodes();
  }, [formData.city]);

  // Handle pincode dropdown vs. "Other" manual entry
  const handlePincodeChange = (e) => {
    const { value } = e.target;
    if (value === "Other") {
      setIsOtherPincode(true);
      setFormData((prevData) => ({ ...prevData, pincode: "" }));
    } else {
      setIsOtherPincode(false);
      setFormData((prevData) => ({ ...prevData, pincode: value }));
    }
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate "Other" pincode if used
    if (
      isOtherPincode &&
      (!formData.pincode || formData.pincode.length !== 6 || isNaN(formData.pincode))
    ) {
      alert("Please enter a valid 6-digit pincode.");
      return;
    }
    try {
      const res = await communityAddress(formData, token, navigate, dispatch);
      console.log(res);
    } catch (error) {
      console.error("Error submitting community address:", error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen">
      {/* Left side (image + overlay) */}
      <div className="hidden md:flex md:w-1/2 relative">
        <img
          src={communityImage}
          alt="Community"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center text-white p-4">
          <h2 className="text-2xl font-bold mb-2">Your Community Address</h2>
          <p className="text-center max-w-xs">
            Complete your address details for better service
          </p>
        </div>
      </div>

      {/* Right side (form) */}
      <div className="flex w-full md:w-1/2 justify-center items-center p-6">
        <div className="max-w-md w-full space-y-6">
          {/* Heading */}
          <div className="text-center">
            <img
              src={nityamNeedsLogo}
              alt="Nityam needs"
              className="mx-auto h-20"
            />
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-purple-600">
              Community Address
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              Provide your address details to continue
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Country (Only India) */}
            <div>
              <label className="block font-medium mb-1">Country</label>
              <select
                name="country"
                value="India"
                disabled
                className="w-full px-3 py-2 border border-gray-300 
                           rounded-md focus:outline-none focus:ring-2 
                           focus:ring-purple-500 bg-gray-100"
              >
                <option value="India">India</option>
              </select>
            </div>

            {/* State */}
            <div>
              <label className="block font-medium mb-1">State</label>
              <StateSelect
                countryid={countryId}
                onChange={(selectedState) => {
                  setStateId(selectedState.id);
                  setFormData((prevData) => ({
                    ...prevData,
                    state: selectedState.name,
                  }));
                }}
                placeHolder="Select State"
                disabled={!countryId}
                className="w-full px-3 py-2 border border-gray-300 
                           rounded-md focus:outline-none focus:ring-2 
                           focus:ring-purple-500"
              />
            </div>

            {/* City */}
            <div>
              <label className="block font-medium mb-1">City</label>
              <CitySelect
                countryid={countryId}
                stateid={stateId}
                onChange={(selectedCity) => {
                  setFormData((prevData) => ({
                    ...prevData,
                    city: selectedCity.name,
                  }));
                }}
                placeHolder="Select City"
                disabled={!stateId}
                className="w-full px-3 py-2 border border-gray-300 
                           rounded-md focus:outline-none focus:ring-2 
                           focus:ring-purple-500"
              />
            </div>

            {/* Pincode Dropdown with "Other" Option */}
            <div>
              <label className="block font-medium mb-1">Pincode</label>
              <select
                name="pincode"
                value={isOtherPincode ? "Other" : formData.pincode}
                onChange={handlePincodeChange}
                className="w-full px-3 py-2 border border-gray-300 
                           rounded-md focus:outline-none focus:ring-2 
                           focus:ring-purple-500"
                disabled={!pincodeList.length}
              >
                <option value="">Select Pincode</option>
                {pincodeList.map((pincode, index) => (
                  <option key={index} value={pincode}>
                    {pincode}
                  </option>
                ))}
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Manual Pincode Input (only if "Other") */}
            {isOtherPincode && (
              <div>
                <label className="block font-medium mb-1">Enter Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  maxLength="6"
                  placeholder="Enter Pincode"
                  className="w-full px-3 py-2 border border-gray-300 
                             rounded-md focus:outline-none focus:ring-2 
                             focus:ring-purple-500"
                />
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 bg-purple-600 text-white rounded-md 
                         hover:bg-purple-700 transition font-semibold
                         focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CommunityAddress;
