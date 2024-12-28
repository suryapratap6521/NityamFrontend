import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { CitySelect, CountrySelect, StateSelect } from "react-country-state-city";
import { communityAddress } from "../../../services/operations/authApi";

const CommunityAddress = () => {
  const [formData, setFormData] = useState({
    country: "",
    state: "",
    city: "",
    pincode: "",
  });
  const [countryId, setCountryId] = useState(0);
  const [stateId, setStateId] = useState(0);
  const [pincodeList, setPincodeList] = useState([]);
  const [isOtherPincode, setIsOtherPincode] = useState(false);

  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    const fetchPincodes = async () => {
      if (formData.city) {
        try {
          const response = await fetch(
            `https://api.postalpincode.in/postoffice/${formData.city}`
          );
          const data = await response.json();
          if (data[0]?.Status === "Success") {
            const filteredPincodes = data[0].PostOffice.map((office) => office.Pincode);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isOtherPincode && (!formData.pincode || formData.pincode.length !== 6 || isNaN(formData.pincode))) {
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
    <div className="community-address-form max-w-lg mx-auto p-6 border rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Community Address</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Country Dropdown */}
        <div>
          <label className="block font-semibold mb-2">Country</label>
          <CountrySelect
            onChange={(selectedCountry) => {
              setCountryId(selectedCountry.id);
              setFormData((prevData) => ({ ...prevData, country: selectedCountry.name }));
            }}
            placeHolder="Select Country"
          />
        </div>

        {/* State Dropdown */}
        <div>
          <label className="block font-semibold mb-2">State</label>
          <StateSelect
            countryid={countryId}
            onChange={(selectedState) => {
              setStateId(selectedState.id);
              setFormData((prevData) => ({ ...prevData, state: selectedState.name }));
            }}
            placeHolder="Select State"
            disabled={!countryId}
          />
        </div>

        {/* City Dropdown */}
        <div>
          <label className="block font-semibold mb-2">City</label>
          <CitySelect
            countryid={countryId}
            stateid={stateId}
            onChange={(selectedCity) => {
              setFormData((prevData) => ({ ...prevData, city: selectedCity.name }));
            }}
            placeHolder="Select City"
            disabled={!stateId}
          />
        </div>

        {/* Pincode Dropdown with "Other" Option */}
        <div>
          <label className="block font-semibold mb-2">Pincode</label>
          <select
            name="pincode"
            value={isOtherPincode ? "Other" : formData.pincode}
            onChange={handlePincodeChange}
            className="w-full px-3 py-2 border rounded-lg"
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

        {/* Manual Pincode Input */}
        {isOtherPincode && (
          <div>
            <label className="block font-semibold mb-2">Enter Pincode</label>
            <input
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              maxLength="6"
              placeholder="Enter Pincode"
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
        )}

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default CommunityAddress;
