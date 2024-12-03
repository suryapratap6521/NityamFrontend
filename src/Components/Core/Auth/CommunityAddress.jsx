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
  const [pincodeList, setPincodeList] = useState([]); // Store pincodes
  const [isOtherPincode, setIsOtherPincode] = useState(false); // Track "Other" option
  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
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
            // Filter by district name matching city
            const filteredPincodes = data[0].PostOffice
              .filter((office) => office.District.toLowerCase() === formData.city.toLowerCase())
              .map((office) => office.Pincode);

            setPincodeList([...new Set(filteredPincodes)]); // Remove duplicates
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
      setFormData({ ...formData, pincode: "" });
    } else {
      setIsOtherPincode(false);
      setFormData({ ...formData, pincode: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate pincode
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
    <div className="community-address-form">
      <h2>Community Address</h2>
      <form onSubmit={handleSubmit}>
        {/* Country Dropdown */}
        <div>
          <label>Country</label>
          <CountrySelect
            onChange={(selectedCountry) => {
              setCountryId(selectedCountry.id);
              setFormData({ ...formData, country: selectedCountry.name });
            }}
            placeHolder="Select Country"
          />
        </div>

        {/* State Dropdown */}
        <div>
          <label>State</label>
          <StateSelect
            countryid={countryId}
            onChange={(selectedState) => {
              setStateId(selectedState.id);
              setFormData({ ...formData, state: selectedState.name });
            }}
            placeHolder="Select State"
            disabled={!countryId}
          />
        </div>

        {/* City Dropdown */}
        <div>
          <label>City</label>
          <CitySelect
            countryid={countryId}
            stateid={stateId}
            onChange={(selectedCity) => {
              setFormData({ ...formData, city: selectedCity.name });
            }}
            placeHolder="Select City"
            disabled={!stateId}
          />
        </div>

        {/* Pincode Dropdown with "Other" Option */}
        <div>
          <label>Pincode</label>
          <select
            name="pincode"
            value={isOtherPincode ? "Other" : formData.pincode}
            onChange={handlePincodeChange}
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
            <label>Enter Pincode</label>
            <input
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              maxLength="6"
              placeholder="Enter Pincode"
            />
          </div>
        )}

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default CommunityAddress;
