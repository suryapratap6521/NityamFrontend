import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { profession } from "../../../services/operations/authApi"; // Changed function name

export default function Profession() {
  const [selectedProfession, setSelectedProfession] = useState(""); // Renamed to avoid conflict
  const [customProfession, setCustomProfession] = useState(""); // State for custom profession input
  const [hourlyCharge, setHourlyCharge] = useState(""); // State for hourly charge
  const [isOther, setIsOther] = useState(false); // State to track if "Other" is selected
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token); // Access token from Redux store

  // Handle profession change
  const handleProfessionChange = (e) => {
    const selected = e.target.value;
    setSelectedProfession(selected);
    if (selected === "Other") {
      setIsOther(true); // Show custom profession input when "Other" is selected
    } else {
      setIsOther(false); // Hide custom profession input if not "Other"
      setCustomProfession(""); // Reset custom profession
    }
  };

  const handleSkip=()=>{
    navigate('/dashboard');
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const professionData = {
      profession: isOther ? customProfession : selectedProfession,
      hourlyCharge: hourlyCharge,
    };
    console.log(professionData);
    try {
      // Call the submitProfession function
      const res = await profession(professionData, token, navigate, dispatch);
    //   console.log(res);
    } catch (error) {
      console.error("Profession submission error:", error);
    }
  };

  return (
    <div className="profession-form-container p-4 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-6">Add Your Profession</h2>

      <form onSubmit={handleSubmit}>
        {/* Profession Dropdown */}
        <div className="mb-4">
          <label className="block font-semibold mb-2">Select Your Profession</label>
          <select
            value={selectedProfession}
            onChange={handleProfessionChange}
            className="w-full px-3 py-2 border rounded-lg"
            required
          >
            <option value="">Select a Profession</option>
            <option value="Carpenter">Carpenter</option>
            <option value="Plumber">Plumber</option>
            <option value="Electrician">Electrician</option>
            <option value="Mechanic">Mechanic</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Custom Profession Input (Visible only if "Other" is selected) */}
        {isOther && (
          <div className="mb-4">
            <label className="block font-semibold mb-2">Enter Your Profession</label>
            <input
              type="text"
              value={customProfession}
              onChange={(e) => setCustomProfession(e.target.value)}
              placeholder="Enter your profession"
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>
        )}

        {/* Hourly Charge Input */}
        <div className="mb-4">
          <label className="block font-semibold mb-2">Hourly Charge (in Rs.)</label>
          <input
            type="number"
            value={hourlyCharge}
            onChange={(e) => setHourlyCharge(e.target.value)}
            placeholder="Enter your hourly charge"
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Submit Profession
        </button>
      </form>
      <button onClick={handleSkip}>Skip</button>
    </div>
  );
}
