import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { community } from "../../../services/operations/authApi";
import { toast } from "react-hot-toast";
import axios from "axios";
import communityImage from "../../../assests/signup_image.jpg"; // Replace with your actual image path
import nityamNeedsLogo from "../../../assests/nityam_mlogo.png";
const Community = () => {
  const [areas, setAreas] = useState([]);
  const [selectedArea, setSelectedArea] = useState("");
  const { token, signUpData } = useSelector((state) => state.auth);
  const pincode = signUpData?.communityAddress?.pincode;
  const city = signUpData?.communityAddress?.city;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAreas = async () => {
      if (pincode) {
        try {
          const response = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`);
          console.log(response, "postoffice response");
          const data = response.data[0];

          if (data?.Status === "Success") {
            setAreas(data.PostOffice);
          } else {
            toast.error(response.data.message);
          }
        } catch (error) {
          console.error("Error fetching areas:", error);
          toast.error(error.response.data.message);
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
      
    } catch (error) {
      console.error("Error submitting community:", error);

    }
  };

  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen">
      {/* Left Column - Image and Overlay */}
      <div className="hidden md:flex md:w-1/2 relative">
        <img
          src={communityImage}
          alt="Community"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center p-4">
          <h2 className="text-2xl font-bold mb-2 text-white">Discover Your Community</h2>
          <p className="text-center max-w-xs text-white">
            Select your area to connect with your local community and enjoy personalized services.
          </p>
        </div>
      </div>

      {/* Right Column - Form */}
      <div className="flex w-full md:w-1/2 justify-center items-center p-6">
        <div className="max-w-md w-full space-y-6">
        <div className="text-center">
            <img
              src={nityamNeedsLogo}
              alt="Nityam needs"
              className="mx-auto h-20"
            />
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-purple-600">Select Your Area</h1>
            <p className="text-sm text-gray-500 mt-2">
              Please select the area corresponding to your pincode.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-1">
                Area
              </label>
              <select
                id="area"
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm 
                           focus:outline-none focus:ring-2 focus:ring-purple-500"
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
              className="w-full py-3 bg-purple-600 text-white rounded-md shadow 
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

export default Community;
