import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { profession } from "../../../services/operations/authApi";
import professionImage from "../../../assests/signup_image.jpg"; // Replace with your actual image path
import nityamNeedsLogo from "../../../assests/nityam_mlogo.png";
import { SetSignUpData } from "../../../slices/authSlice";

export default function Profession() {
  const [selectedProfession, setSelectedProfession] = useState("");
  const [customProfession, setCustomProfession] = useState("");
  const [hourlyCharge, setHourlyCharge] = useState(10); // default to minimum value
  const [isOther, setIsOther] = useState(false);

  // State for the Skip confirmation modal
  const [showSkipModal, setShowSkipModal] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  // Update slider background dynamically based on current value
  useEffect(() => {
    updateSliderBackground(hourlyCharge);
  }, [hourlyCharge]);

  // Dynamically compute gradient fill for the slider track
  const updateSliderBackground = (value) => {
    const min = 10;
    const max = 2000;
    const percentage = ((value - min) / (max - min)) * 100;
    const slider = document.getElementById("hourlyCharge");
    if (slider) {
      slider.style.background = `linear-gradient(to right, 
        #7c3aed 0%, 
        #7c3aed ${percentage}%, 
        #e5e7eb ${percentage}%, 
        #e5e7eb 100%)`;
    }
  };

  // Handle profession dropdown change
  const handleProfessionChange = (e) => {
    const selected = e.target.value;
    setSelectedProfession(selected);
    setIsOther(selected === "Other");
    if (selected !== "Other") {
      setCustomProfession("");
    }
  };

  // Show the skip confirmation modal
  const handleShowSkipModal = () => {
    setShowSkipModal(true);
  };

  // Called when user confirms skip in the modal
  const handleSkipConfirm = () => {
    dispatch(
      SetSignUpData({ 
        professionalDetails: { skipped: true, skippedAt: Date.now() }
      })
    );
    setShowSkipModal(false);
    navigate("/welcome");
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const professionData = {
      profession: isOther ? customProfession : selectedProfession,
      hourlyCharge,
    };

    try {
      await profession(professionData, token, navigate, dispatch);
    } catch (error) {
      console.error("Profession submission error:", error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen">
      {/* Left Column: Background Image with Overlay */}
      <div className="hidden md:flex md:w-1/2 relative">
        <img
          src={professionImage}
          alt="Profession"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center p-6">
          <h2 className="text-3xl font-bold text-white mb-4">
            Showcase Your Skills
          </h2>
          <p className="text-white text-center max-w-sm">
            Join our community and offer your professional services.
          </p>
        </div>
      </div>

      {/* Right Column: Form */}
      <div className="flex w-full md:w-1/2 justify-center items-center p-6 bg-gray-50">
        <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-lg">
          <div className="text-center">
            <img
              src={nityamNeedsLogo}
              alt="Nityam needs"
              className="mx-auto h-20"
            />
          </div>
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
            Add Your Profession
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profession Dropdown */}
            <div>
              <label
                htmlFor="profession"
                className="block text-sm font-medium text-gray-700"
              >
                Select Your Profession
              </label>
              <select
                id="profession"
                value={selectedProfession}
                onChange={handleProfessionChange}
                className="w-full mt-1 p-2 border rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500"
                required
              >
                <option value="" disabled>
                  Select a Profession
                </option>
                <option value="Carpenter">Carpenter</option>
                <option value="Plumber">Plumber</option>
                <option value="Electrician">Electrician</option>
                <option value="Mechanic">Mechanic</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Custom Profession Input */}
            {isOther && (
              <div>
                <label
                  htmlFor="customProfession"
                  className="block text-sm font-medium text-gray-700"
                >
                  Enter Your Profession
                </label>
                <input
                  id="customProfession"
                  type="text"
                  value={customProfession}
                  onChange={(e) => setCustomProfession(e.target.value)}
                  placeholder="Enter your profession"
                  className="w-full mt-1 p-2 border rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500"
                  required
                />
              </div>
            )}

            {/* Hourly Charge Range Slider */}
            <div>
              <label
                htmlFor="hourlyCharge"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Hourly Charge (in Rs.)
              </label>
              <input
                id="hourlyCharge"
                type="range"
                min="10"
                max="2000"
                step="10"
                value={hourlyCharge}
                onChange={(e) => setHourlyCharge(Number(e.target.value))}
                className="slider w-full appearance-none cursor-pointer"
              />
              {/* Display the value below the slider */}
              <div className="text-center mt-2 text-xl font-semibold text-gray-800">
                Rs. {hourlyCharge}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between mt-6">
              <button
                type="submit"
                className="w-1/2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 shadow-md transition"
              >
                Submit
              </button>
              <button
                type="button"
                onClick={handleShowSkipModal}
                className="w-1/2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 shadow-md ml-2 transition"
              >
                Skip
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Skip Confirmation Modal */}
      {showSkipModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white w-11/12 max-w-sm rounded-lg p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              Confirm Skip
            </h2>
            <p className="text-gray-700 mb-6">
              If you skip, your profession details will not be visible to other community members.
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setShowSkipModal(false)}
                className="mr-2 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSkipConfirm}
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition duration-200"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Slider Styling */}
      <style jsx>{`
        .slider {
          -webkit-appearance: none;
          width: 100%;
          height: 12px;
          border-radius: 9999px;
          background: #e5e7eb;
          outline: none;
          transition: background 0.3s ease-in-out;
          margin-top: 0.5rem;
        }
        .slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 30px;
          width: 30px;
          border-radius: 50%;
          background: #7c3aed;
          border: 3px solid #ffffff;
          box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
          margin-top: -9px;
          cursor: pointer;
          transition: transform 0.2s ease-in-out;
        }
        .slider::-webkit-slider-thumb:hover {
          transform: scale(1.15);
        }
        .slider::-moz-range-thumb {
          height: 30px;
          width: 30px;
          border-radius: 50%;
          background: #7c3aed;
          border: 3px solid #ffffff;
          box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
          cursor: pointer;
          transition: transform 0.2s ease-in-out;
        }
        .slider::-moz-range-thumb:hover {
          transform: scale(1.15);
        }
        .slider::-ms-thumb {
          height: 30px;
          width: 30px;
          border-radius: 50%;
          background: #7c3aed;
          border: 3px solid #ffffff;
          box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
          cursor: pointer;
          transition: transform 0.2s ease-in-out;
        }
        .slider::-ms-thumb:hover {
          transform: scale(1.15);
        }
      `}</style>
    </div>
  );
}
