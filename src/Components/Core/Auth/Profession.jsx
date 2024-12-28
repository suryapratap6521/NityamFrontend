import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { profession } from "../../../services/operations/authApi"; // Changed function name

export default function Profession() {
  const [selectedProfession, setSelectedProfession] = useState("");
  const [customProfession, setCustomProfession] = useState("");
  const [hourlyCharge, setHourlyCharge] = useState("");
  const [isOther, setIsOther] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  // Handle profession change
  const handleProfessionChange = (e) => {
    const selected = e.target.value;
    setSelectedProfession(selected);
    setIsOther(selected === "Other");
    if (selected !== "Other") setCustomProfession("");
  };

  // Handle Skip
  const handleSkip = () => {
    navigate("/dashboard");
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
      toast.success("Profession added successfully!");
    } catch (error) {
      toast.error("Failed to add profession.");
      console.error("Profession submission error:", error);
    }
  };

  return (
    <div className="profession-form-container p-6 max-w-lg mx-auto bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Add Your Profession
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profession Dropdown */}
        <div>
          <label htmlFor="profession" className="block text-sm font-medium text-gray-700">
            Select Your Profession
          </label>
          <select
            id="profession"
            value={selectedProfession}
            onChange={handleProfessionChange}
            className="w-full mt-1 p-2 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
            <label htmlFor="customProfession" className="block text-sm font-medium text-gray-700">
              Enter Your Profession
            </label>
            <input
              id="customProfession"
              type="text"
              value={customProfession}
              onChange={(e) => setCustomProfession(e.target.value)}
              placeholder="Enter your profession"
              className="w-full mt-1 p-2 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        )}

        {/* Hourly Charge Input */}
        <div>
          <label htmlFor="hourlyCharge" className="block text-sm font-medium text-gray-700">
            Hourly Charge (in Rs.)
          </label>
          <input
            id="hourlyCharge"
            type="number"
            value={hourlyCharge}
            onChange={(e) => setHourlyCharge(e.target.value)}
            placeholder="Enter your hourly charge"
            className="w-full mt-1 p-2 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="w-1/2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 shadow-md"
          >
            Submit
          </button>
          <button
            type="button"
            onClick={handleSkip}
            className="w-1/2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 shadow-md ml-2"
          >
            Skip
          </button>
        </div>
      </form>
    </div>
  );
}
