import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector,useDispatch } from "react-redux"; // Assuming token is in Redux store
import { CitySelect, CountrySelect, StateSelect } from "react-country-state-city";
import { communityAddress } from "../../../services/operations/authApi"; // API call


const CommunityAddress = () => {
  const [formData, setFormData] = useState({
    country: "",
    state: "",
    city: "",
    pincode: "",
  });

  const [countryId, setCountryId] = useState(0);
  const [stateId, setStateId] = useState(0);
  const token = useSelector((state) => state.auth.token); // Get token from Redux state
  const navigate = useNavigate();
  const dispatch=useDispatch();
  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple validation for pincode length
    if (formData.pincode.length !== 6 || isNaN(formData.pincode)) {
     
      return;
    }

    // Make the API call to submit form data
    try {
      const res=await communityAddress(formData, token, navigate,dispatch); // Call API to save data
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
              setCountryId(selectedCountry.id); // Set country ID to fetch states
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
              setStateId(selectedState.id); // Set state ID to fetch cities
              setFormData({ ...formData, state: selectedState.name });
            }}
            placeHolder="Select State"
            disabled={!countryId} // Disable if no country selected
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
            disabled={!stateId} // Disable if no state selected
          />
        </div>

        {/* Pincode Input */}
        <div>
          <label>Pincode</label>
          <input
            type="text"
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
            maxLength="6"
            placeholder="Enter Pincode"
          />
        </div>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default CommunityAddress;
