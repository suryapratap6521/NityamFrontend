import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAdData } from "../../../slices/adSlice";
import AdPreview from "./ReusesableComponents/AdPreview";
import TotalPrice from "./ReusesableComponents/TotalPrice";
import { fetchAllCommunities } from "../../../services/operations/adApi";
import Select from "react-select";
import { CitySelect, StateSelect } from "react-country-state-city";
import { createAd } from "../../../services/operations/adApi";

const cityOptions = [
  { value: "new-york", label: "New York" },
  { value: "los-angeles", label: "Los Angeles" },
  { value: "chicago", label: "Chicago" },
  { value: "houston", label: "Houston" },
  { value: "phoenix", label: "Phoenix" },
];
const AdCenter = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();
  const adData = useSelector((state) => state.ad.adData || {});
  const pageData = useSelector((state) => state.page.pageData || {});
  const communitiesData = useSelector((state) => state.ad.communities || []);
  const token = useSelector((state) => state.auth.token);
  const [selectedStates, setSelectedStates] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);


  const handleStateChange = (selectedStates) => {
    setSelectedStates(selectedStates);
    dispatch(setAdData({ states: selectedStates.map(state => state.name) })); // Fix: store array of states
    setSelectedCities([]); // Reset city selection
    dispatch(setAdData({ cities: [] })); // Fix: Reset cities when state changes
  };
  

  const handleCityChange = (selectedCities) => {
    setSelectedCities(selectedCities);
    dispatch(setAdData({ cities: selectedCities.map(city => city.name) })); // Fix: store array of cities
  };
  
  const businessTypes = [
    "Contact Us",
    "Send Enquiry",
    "Apply Now",
    "Visit Our Website",
    "Message Us",
    "Download App",
    "Subscribe Us",
    "Fill Form"
  ];
  useEffect(() => {
    const fetchData = async () => {
      try {

        await fetchAllCommunities(token, dispatch);
        //console.log(communitiesData)

      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);



  const filteredBusinessTypes = businessTypes.filter((type) =>
    type.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length > 5) {
      alert("You can only upload up to 5 images.");
      return;
    }
  
    // Convert files to an array of objects for preview purposes
    const imagePreviews = files.map(file => ({
      url: URL.createObjectURL(file),
      file: file
    }));
  
    dispatch(setAdData({ images: imagePreviews }));
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(setAdData({ [name]: value }));  // Dispatch updated data to Redux store
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const today = new Date().toISOString().split("T")[0];
    const startDateTime = new Date(adData.startDate);
    const endDateTime = new Date(adData.endDate);
  
    if (startDateTime < new Date(today)) {
      alert("Start date cannot be in the past.");
      return;
    }
  
    if (endDateTime <= startDateTime) {
      alert("End date must be after the start date.");
      return;
    }
  
    if (adData.minAge < 5 || adData.maxAge > 90 || adData.minAge > adData.maxAge) {
      alert("Invalid age range. Min age must be at least 5, and max age cannot exceed 90.");
      return;
    }
  
    let selectedStates, selectedCities, selectedCommunities;
  
    if (adData.audianceType === "byState") {
      selectedStates = adData.states;
    } else if (adData.audianceType === "byCity") {
      selectedCities = adData.cities;
    } else if (adData.audianceType === "byCommunity") {
      selectedCommunities = adData.communities;
    }
  
    // Create FormData
    const formData = new FormData();
    formData.append("title", adData.title);
    formData.append("pageId", pageData._id);
    formData.append("price", 1000); // Assuming price is static
  
    // Append age group
    formData.append("ageGroup[minAge]", adData.minAge);
    formData.append("ageGroup[maxAge]", adData.maxAge);
  
    // Append date slot
    formData.append("dateSlot[startDate]", startDateTime.toISOString());
    formData.append("dateSlot[endDate]", endDateTime.toISOString());
  
    // Append audience type (optionType)
    formData.append("optionType", adData.audianceType);  // ✅ Fixed this
    console.log(adData.audianceType)
    // Append location filters based on selected option
    if (selectedStates) {
      selectedStates.forEach((state) => formData.append("states", state));
    }
    if (selectedCities) {
      selectedCities.forEach((city) => formData.append("cities", city));
    }
    if (selectedCommunities) {
      selectedCommunities.forEach((community) => formData.append("communities", community));
    }
  
    // Append button data
    formData.append("buttonLabel[type]", adData.type);
    formData.append("buttonLabel[value]", adData.value);
  
    // Append image files (for uploads)
    if (adData.images && Array.isArray(adData.images)) {
      adData.images.forEach((imageObj) => {
        formData.append("imagesArray", imageObj.file);
      });
    }
  
    try {
      const response = await createAd(formData, dispatch, token);
      alert("Ad created successfully!");
      console.log("Response:", response);
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to create ad. Please try again.");
    }
  };
  
  
  
  return (
    <div className="container items-start border-t-0 flex flex-row mx-auto p-6">
      <div className="w-3/5 p-4">
        <h1 className="text-xl text-left font-bold mb-4">Create New Ad</h1>
        <div className="w-10/12">
          <form>
            {/* Title */}
            <div className="mb-4">
              <label htmlFor="title" className="text-lg font-semibold">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={adData.title || ""}
                onChange={handleChange} // Handle change for title
                className="border rounded w-full p-2"
              />
            </div>

            {/* User Type Selection */}
            <div className="mb-1">
              <label className="text-lg font-semibold">Target Audience</label>
              <div className="flex gap-2 mt-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="audianceType"
                    value="allUsers"
                    checked={adData.audianceType === "allUsers"}
                    onChange={handleChange}
                  />
                  All Users
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="audianceType"
                    value="byState"
                    checked={adData.audianceType === "byState"}
                    onChange={handleChange}
                  />
                  By State
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="audianceType"
                    value="byCity"
                    checked={adData.audianceType === "byCity"}
                    onChange={handleChange}
                  />
                  By City
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="audianceType"
                    value="byCommunity"
                    checked={adData.audianceType === "byCommunity"}
                    onChange={handleChange}
                  />
                  By Communities
                </label>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2">
              {adData.audianceType === "byState" || adData.audianceType === "byCity" ? (
                <div className="mb-4 flex-1">
                  <label className="block text-gray-600 font-medium">Select State</label>
                  <StateSelect
                    isMulti
                    countryid={101} // Fixed to India (Country ID 101)
                    onChange={handleStateChange}
                    placeHolder="Select State"
                  />
                </div>
              ) : null}

              {adData.audianceType === "byCity" ? (
                <div className="mb-4 flex-1">
                  <label className="block text-gray-600 font-medium">Select Cities</label>
                  <CitySelect
                    countryid={101}
                    stateid={selectedStates.id}
                    onChange={handleCityChange}
                    placeHolder="Select City"
                    disabled={!selectedStates.id}
                  />
                </div>
              ) : null}

              {adData.audianceType === "byCommunity" ? (
                <div className="mb-4 flex-1">
                  <label className="block text-gray-600 font-medium">Select Communities</label>
                  {/* Multi-select component using react-select */}
                  <Select
                    isMulti
                    name="communities"
                    value={adData.communities && Array.isArray(adData.communities)
                      ? adData.communities.map(communityName => {
                        const community = communitiesData.find((community) => community.communityName === communityName);
                        return community ? { value: community.communityName, label: community.communityName } : null;
                      }).filter(Boolean) // Remove any null values
                      : []}
                    onChange={(selectedOptions) => {
                      const selectedValues = selectedOptions.map(option => option.value); // This will now be community names
                      dispatch(setAdData({ communities: selectedValues }));
                      //console.log(adData, selectedValues);
                    }}
                    options={communitiesData.map((community) => ({
                      value: community.communityName, // Use communityName as the value
                      label: community.communityName,
                    }))}
                    className="border rounded w-full p-2"
                  />
                </div>
              ) : null}

            </div>

            {/* Time Slot */}
            {/* <label className="text-lg font-semibold">Time Slot</label>
            <div className="flex gap-2">
              <div className="mb-4 flex-1">
                <label htmlFor="start" className="block text-gray-600 font-medium">Start Date</label>
                <input
                  type="time"
                  id="start"
                  name="start"
                  value={adData.start || ""}
                  onChange={handleChange}
                  className="border rounded w-full p-2"
                />
              </div>
              <div className="mb-4 flex-1">
                <label htmlFor="end" className="block text-gray-600 font-medium">End Date</label>
                <input
                  type="time"
                  id="end"
                  name="end"
                  value={adData.end || ""}
                  onChange={handleChange}
                  className="border rounded w-full p-2"
                />
              </div>
            </div> */}

            {/* Age Group */}
            <label className="text-lg font-semibold">Target Audience Age Group</label>
            <div className="flex gap-2">

              <div className="mb-4 flex-1">
                <label htmlFor="minAge" className="block text-gray-600 font-medium">Minimum Age</label>
                <input
                  type="number"
                  id="minAge"
                  name="minAge"
                  value={adData.minAge || ""}
                  onChange={handleChange}
                  className="border rounded w-full p-2"
                />
              </div>
              <div className="mb-4 flex-1">
                <label htmlFor="maxAge" className="block text-gray-600 font-medium">Maximum Age</label>
                <input
                  type="number"
                  id="maxAge"
                  name="maxAge"
                  value={adData.maxAge || ""}
                  onChange={handleChange}
                  className="border rounded w-full p-2"
                />
              </div>
            </div>

            {/* Date Slot */}
            <label className="text-lg font-semibold">Date Slot</label>
            <div className="flex gap-2">
              <div className="mb-4 flex-1">
                <label htmlFor="startDate" className="block text-gray-600 font-medium">Start Date</label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={adData.startDate || ""}
                  onChange={handleChange}
                  className="border rounded w-full p-2"
                />
              </div>
              <div className="mb-4 flex-1">
                <label htmlFor="endDate" className="block text-gray-600 font-medium">End Date</label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={adData.endDate || ""}
                  onChange={handleChange}
                  className="border rounded w-full p-2"
                />
              </div>
            </div>

            {/* Button Label */}
            <label className="text-lg font-semibold">Button</label>
            <div className="flex gap-2">
              <div className="mb-4 flex-1">
                <label htmlFor="type" className="block text-gray-600 font-medium">Type</label>
                <select
                  id="type"
                  name="type"
                  value={adData.type || ""}
                  onChange={handleChange}
                  className="border rounded w-full p-2"
                >
                  <option value="">Select Button Type</option>
                  {filteredBusinessTypes.map((type, index) => (
                    <option key={index} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4 flex-1">
                <label htmlFor="value" className="block text-gray-600 font-medium">Redirect Path</label>
                <input
                  type="text"
                  id="value"
                  name="value"
                  value={adData.value || ""}
                  onChange={handleChange}
                  className="border rounded w-full p-2"
                />
              </div>
            </div>

            {/* Multi-Select for Images */}
            <div className="mb-4">
              <label htmlFor="images" className="text-lg font-semibold">Upload Images (Select up to 5)</label>
              <input
                type="file"
                id="images"
                name="images"
                accept="image/*"
                multiple
                onChange={(e) => handleImageChange(e)}
                className="border rounded w-full p-2"
              />
            </div>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-green-500 text-white rounded w-full"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
      <div className="w-2/5">
        <AdPreview />
        <TotalPrice />
      </div>
    </div>

  );

};

export default AdCenter;
