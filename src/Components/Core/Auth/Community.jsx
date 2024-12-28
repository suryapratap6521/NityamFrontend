import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { community } from "../../../services/operations/authApi"; // Assuming the API call is in services/api.js
import { toast } from "react-hot-toast";
import axios from "axios";

const Community = () => {
  const [areas, setAreas] = useState([]);
  const [selectedArea, setSelectedArea] = useState("");
  const { token, signUpData } = useSelector((state) => state.auth);
  const pincode = signUpData?.formData?.pincode;
  const city = signUpData?.formData?.city;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAreas = async () => {
      if (pincode) {
        try {
          const response = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`);
          const data = response.data[0];

          if (data?.Status === "Success") {
            const filteredAreas = data.PostOffice.filter(
              (area) => area.District.toLowerCase() === city.toLowerCase()
            );

            if (filteredAreas.length > 0) {
              setAreas(filteredAreas);
            } else {
              toast.error("No areas found for the provided city and pincode.");
            }
          } else {
            toast.error("Invalid pincode or no areas found.");
          }
        } catch (error) {
          console.error("Error fetching areas:", error);
          toast.error("Could not fetch areas. Please try again.");
        }
      }
    };

    fetchAreas();
  }, [pincode, city]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedArea) {
      toast.error("Please select an area.");
      return;
    }

    const formData = { community: selectedArea };

    try {
      await community(formData, token, navigate, dispatch);
      toast.success("Community submitted successfully!");
    } catch (error) {
      console.error("Error submitting community:", error);
      toast.error("Could not submit community. Please try again.");
    }
  };

  return (
    <div className="community-page max-w-lg mx-auto mt-8 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold text-center mb-6">Select Your Area</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="area"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Area
          </label>
          <select
            id="area"
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">Select an area</option>
            {areas.map((area, index) => (
              <option key={index} value={area.Name}>
                {area.Name}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Community;
