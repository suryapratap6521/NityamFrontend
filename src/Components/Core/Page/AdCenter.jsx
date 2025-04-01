import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAdData } from "../../../slices/adSlice";
import AdPreview from "./ReusesableComponents/AdPreview";
import TotalPrice from "./ReusesableComponents/TotalPrice";
import { fetchAllCommunities } from "../../../services/operations/adApi";
import Select from "react-select";
import axios from "axios";
import { createAd } from "../../../services/operations/adApi";
import { setPageData } from "../../../slices/pageSlice";    

const AdCenter = () => {
  const dispatch = useDispatch();
  const [step, setStep] = useState(1);
  
  // Get adData and related info from Redux
  const adData = useSelector((state) => state.ad.adData || {});
  const pageData = useSelector((state) => state.page.pageData || {});
  const communitiesData = useSelector((state) => state.ad.communities || []);
  const token = useSelector((state) => state.auth.token);

  // Local state for multi-select dropdowns
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedStates, setSelectedStates] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);

  const API_KEY = "emRDWFZrcTRpMWxUNHdhTEluQktQbFFoZUhoRFhLS2Znc2RNSHJnRQ==";
  const BASE_URL = "https://api.countrystatecity.in/v1/countries/IN";

  // When states change update both local state and Redux state.
  const handleStateChange = (selected) => {
    setSelectedStates(selected);
    dispatch(setAdData({ state: selected ? selected.map((s) => s.label) : [] }));
    // Clear cities when states change
    setSelectedCities([]);
    dispatch(setAdData({ city: [] }));
  };

  // When cities change update local state and Redux state.
  const handleCityChange = (selected) => {
    setSelectedCities(selected);
    dispatch(setAdData({ city: selected ? selected.map((c) => c.label) : [] }));
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

  // Fetch states using the API
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/states`, {
          headers: { "X-CSCAPI-KEY": API_KEY },
        });
        setStates(response.data.map((state) => ({
          value: state.iso2,
          label: state.name,
        })));
      } catch (error) {
        console.error("Error fetching states:", error);
      }
    };
    fetchStates();
  }, []);

  // Fetch cities for each selected state
  useEffect(() => {
    if (selectedStates && selectedStates.length > 0) {
      const fetchCities = async () => {
        try {
          let allCities = [];
          for (let state of selectedStates) {
            const response = await axios.get(
              `${BASE_URL}/states/${state.value}/cities`,
              { headers: { "X-CSCAPI-KEY": API_KEY } }
            );
            allCities = [
              ...allCities,
              ...response.data.map((city) => ({
                value: city.name,
                label: city.name,
              })),
            ];
          }
          setCities(allCities);
        } catch (error) {
          console.error("Error fetching cities:", error);
        }
      };
      fetchCities();
    } else {
      setCities([]);
    }
  }, [selectedStates]);

  // Fetch communities from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchAllCommunities(token, dispatch);
      } catch (error) {
        console.error("Error fetching communities:", error);
      }
    };
    fetchData();
  }, [dispatch, token]);

  // Filter business types for the button label select
  const filteredBusinessTypes = businessTypes.filter((type) =>
    type.toLowerCase().includes((adData.searchTerm || "").toLowerCase())
  );

  // Handle image selection and create preview objects with the file attached.
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      alert("You can only upload up to 5 images.");
      return;
    }
    const imagePreviews = files.map((file) => ({
      url: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
      type: file.type,
      file: file,
    }));
    dispatch(setAdData({ images: imagePreviews }));
  };

  // General change handler: for age fields, convert value to a number.
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "minAge" || name === "maxAge") {
      dispatch(setAdData({ [name]: parseInt(value, 10) || "" }));
    } else {
      dispatch(setAdData({ [name]: value }));
    }
  };

  // Price calculation logic (update this as needed)
  const calculatePriceSomehow = () => {
    const numberOfItems =
      adData.audianceType === "byState"
        ? (adData.state || []).length
        : adData.audianceType === "byCity"
        ? (adData.city || []).length
        : adData.audianceType === "byCommunity"
        ? (adData.communities || []).length
        : 0;
    const numberOfDays =
      adData.startDate && adData.endDate
        ? Math.ceil(
            (new Date(adData.endDate) - new Date(adData.startDate)) /
              (1000 * 60 * 60 * 24)
          )
        : 0;
    // Example price calculation: adjust multiplier as needed
    return (numberOfItems * numberOfDays * 50) / 2;
  };

  // Handle form submission.
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure that the page data is loaded.
    if (!pageData._id) {
      alert("Page data is missing. Please select or create a page.");
      return;
    }

    // Validate and convert date values.
    const startDateTime = new Date(adData.startDate);
    const endDateTime = new Date(adData.endDate);
    if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
      alert("Please select valid start and end dates.");
      return;
    }

    // Prepare time slot if provided (using today's date for time values)
    const today = new Date().toISOString().split("T")[0];
    const startIsoString = adData.start
      ? new Date(`${today}T${adData.start}:00.000Z`).toISOString()
      : "";
    const endIsoString = adData.end
      ? new Date(`${today}T${adData.end}:00.000Z`).toISOString()
      : "";

    // Calculate price
    const price = calculatePriceSomehow();

    // Determine location fields based on audience type.
    let state, city;
    if (adData.audianceType === "byState") {
      state = adData.state;
    } else if (adData.audianceType === "byCity") {
      city = adData.city;
    }

    // Create FormData and append all fields.
    const formData = new FormData();
    formData.append("title", adData.title);
    formData.append("pageId", pageData._id);
    formData.append("price", price);

    if (startIsoString && endIsoString) {
      formData.append("timeSlot[start]", startIsoString);
      formData.append("timeSlot[end]", endIsoString);
    }

    formData.append("ageGroup[minAge]", adData.minAge);
    formData.append("ageGroup[maxAge]", adData.maxAge);
    formData.append("dateSlot[startDate]", startDateTime.toISOString());
    formData.append("dateSlot[endDate]", endDateTime.toISOString());

    // Use the audience type (here stored as audianceType)
    formData.append("optionType", adData.audianceType);

    // Append location fields if available.
    if (state && state.length) {
      state.forEach((s) => formData.append("states[]", s));
    }
    if (city && city.length) {
      city.forEach((c) => formData.append("cities[]", c));
    }

    // Append communities if audience type is byCommunity.
    if (adData.audianceType === "byCommunity" && Array.isArray(adData.communities)) {
      adData.communities.forEach((community) => {
        formData.append("communities[]", community);
      });
    }

    // Append button label details.
    formData.append("buttonLabel[type]", adData.type);
    formData.append("buttonLabel[value]", adData.value);

    // Append images if available.
    if (adData.images && Array.isArray(adData.images)) {
      adData.images.forEach((imgObj) => {
        if (imgObj.file) {
          formData.append("media", imgObj.file);
        }
      });
    }

    try {
      const response = await createAd(formData, dispatch, token);
      // Process the response or navigate as needed.
      console.log("Ad created successfully", response.data);
    } catch (error) {
      console.error("Error creating ad:", error);
      alert("Failed to create ad. Please try again.");
    }
  };

  // Navigation handlers for multi-step form.
  const handleNext = (event) => {
    event.preventDefault();
    if (step < 2) setStep(step + 1);
  };

  const handleBack = (event) => {
    event.preventDefault();
    if (step > 1) setStep(step - 1);
  };

  // totalPriceRef is used in TotalPrice component.
  const totalPriceRef = useRef(null);
  const handleSubmit2 = (e) => {
    if (totalPriceRef.current) {
      totalPriceRef.current.handleSubmit(e);
    }
  };

  return (
    <div className="max-w-[1320px] flex flex-col lg:flex-row mx-auto p-6 mb-14">
      <div className="lg:w-3/5 w-full p-4">
        <h1 className="md:text-3xl text-xl font-semibold mb-1 text-[#8E2DE2]">Create New Ad</h1>
        <p className="text-gray-400 text-sm mb-4">Design and launch impactful ads effortlessly.</p>
        <form onSubmit={(e) => e.preventDefault()}>
          {step === 1 && (
            <>
              {/* Title */}
              <div className="mb-4">
                <label htmlFor="title" className="text-lg text-gray-600">Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  placeholder="Enter the title for your ad"
                  value={adData.title || ""}
                  onChange={handleChange}
                  className="w-full py-3 px-4 border rounded bg-[#FAFAFA] border-gray-300"
                />
              </div>
              {/* Description */}
              <div className="mb-1">
                <label htmlFor="description" className="text-lg text-gray-600">Description</label>
                <input
                  type="text"
                  id="description"
                  name="description"
                  placeholder="Enter the description for your ad"
                  value={adData.description || ""}
                  onChange={handleChange}
                  className="w-full py-3 px-4 border rounded bg-[#FAFAFA] border-gray-300"
                />
              </div>
              {/* Button Label */}
              <label className="text-lg text-gray-600">Button</label>
              <div className="flex justify-between items-center mb-4">
                <div className="w-[48%] border rounded py-3 px-4 bg-[#FAFAFA] border-gray-300">
                  <select
                    id="type"
                    name="type"
                    value={adData.type || ""}
                    onChange={handleChange}
                    className="w-full bg-[#FAFAFA] text-gray-600 rounded focus:outline-none"
                  >
                    <option value="">Select Button Type</option>
                    {filteredBusinessTypes.map((type, index) => (
                      <option key={index} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div className="w-[48%] border rounded py-3 px-4 bg-[#FAFAFA] border-gray-300">
                  <input
                    type="text"
                    id="value"
                    name="value"
                    value={adData.value || ""}
                    onChange={handleChange}
                    placeholder="Redirect Path"
                    className="w-full bg-[#FAFAFA] rounded focus:outline-none"
                  />
                </div>
              </div>
              {/* Images */}
              <label htmlFor="images" className="text-lg text-gray-600">Upload Images (Select up to 5)</label>
              <div className="mb-4 flex items-center gap-4">
                <label
                  htmlFor="images"
                  className="flex justify-between items-center w-full border rounded py-3 px-4 bg-[#FAFAFA] border-gray-300 text-gray-600"
                >
                  {adData.images && adData.images.length !== 0
                    ? `${adData.images.length} Image(s) Selected`
                    : "Choose Your Ad Photos"}
                  <div className="p-3 rounded-full bg-gradient">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M18 20H4V6H13V4H4C2.9 4 2 4.9 2 6V20C2 21.1 2.9 22 4 22H18C19.1 22 20 21.1 20 20V11H18V20ZM10.21 16.83L8.25 14.47L5.5 18H16.5L12.96 13.29L10.21 16.83ZM20 4V1H18V4H15C15.01 4.01 15 6 15 6H18V8.99C18.01 9 20 8.99 20 8.99V6H23V4H20Z" fill="white"/>
                    </svg>
                  </div>
                </label>
                <input
                  type="file"
                  id="images"
                  name="images"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            </>
          )}
          {step === 2 && (
            <>
              {/* Audience Type */}
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
                {(adData.audianceType === "byState" || adData.audianceType === "byCity") && (
                  <div className="mb-4 flex-1">
                    <label className="block text-gray-600 font-medium">Select State</label>
                    <Select
                      isMulti
                      options={states}
                      value={selectedStates}
                      onChange={handleStateChange}
                    />
                  </div>
                )}
                {adData.audianceType === "byCity" && (
                  <div className="mb-4 flex-1">
                    <label className="block text-gray-600 font-medium">Select Cities</label>
                    <Select
                      isMulti
                      options={cities}
                      value={selectedCities}
                      onChange={handleCityChange}
                      isDisabled={selectedStates.length === 0}
                    />
                  </div>
                )}
                {adData.audianceType === "byCommunity" && (
                  <div className="mb-4 flex-1">
                    <label className="block text-gray-600 font-medium">Select Communities</label>
                    <Select
                      isMulti
                      name="communities"
                      value={
                        adData.communities && Array.isArray(adData.communities)
                          ? adData.communities
                              .map((communityName) => {
                                const community = communitiesData.find(
                                  (comm) => comm.communityName === communityName
                                );
                                return community
                                  ? { value: community.communityName, label: community.communityName }
                                  : null;
                              })
                              .filter(Boolean)
                          : []
                      }
                      onChange={(selectedOptions) => {
                        const selectedValues = selectedOptions ? selectedOptions.map((option) => option.value) : [];
                        dispatch(setAdData({ communities: selectedValues }));
                      }}
                      options={communitiesData.map((community) => ({
                        value: community.communityName,
                        label: community.communityName,
                      }))}
                      className="border rounded w-full p-2"
                    />
                  </div>
                )}
              </div>
              {/* Age Group */}
              <label className="text-lg text-gray-600">Target Audience Age Group</label>
              <div className="flex items-center mb-4">
                <div className="w-[48%] border rounded py-3 px-4 bg-[#FAFAFA] border-gray-300">
                  <label htmlFor="minAge" className="block text-base text-[#a5a5a5]">Minimum Age</label>
                  <input
                    type="number"
                    id="minAge"
                    name="minAge"
                    value={adData.minAge || ""}
                    onChange={handleChange}
                    className="w-full bg-[#FAFAFA] rounded focus:outline-none"
                  />
                </div>
                <div className="w-[4%] border-t-2 border-gray-300"></div>
                <div className="w-[48%] border rounded py-3 px-4 bg-[#FAFAFA] border-gray-300">
                  <label htmlFor="maxAge" className="block text-base text-[#a5a5a5]">Maximum Age</label>
                  <input
                    type="number"
                    id="maxAge"
                    name="maxAge"
                    value={adData.maxAge || ""}
                    onChange={handleChange}
                    className="w-full bg-[#FAFAFA] rounded focus:outline-none"
                  />
                </div>
              </div>
              {/* Date Slot */}
              <label className="text-lg text-gray-600">Date Slot</label>
              <div className="flex items-center mb-4">
                <div className="w-[48%] border rounded py-3 px-4 bg-[#FAFAFA] border-gray-300">
                  <label htmlFor="startDate" className="flex justify-between text-base text-[#a5a5a5] w-full">
                    Start Date
                    <input
                      type="date"
                      id="startDate"
                      name="startDate"
                      value={adData.startDate || ""}
                      onChange={handleChange}
                      className="w-full bg-[#FAFAFA] rounded focus:outline-none text-black"
                    />
                  </label>
                </div>
                <div className="w-[4%] border-t-2 border-gray-300"></div>
                <div className="w-[48%] border rounded py-3 px-4 bg-[#FAFAFA] border-gray-300">
                  <label htmlFor="endDate" className="flex justify-between text-base text-[#a5a5a5] w-full">
                    End Date
                    <input
                      type="date"
                      id="endDate"
                      name="endDate"
                      value={adData.endDate || ""}
                      onChange={handleChange}
                      className="w-full bg-[#FAFAFA] rounded focus:outline-none text-black"
                    />
                  </label>
                </div>
              </div>
              {/* Time Slot */}
              <label className="text-lg text-gray-600">Time Slot</label>
              <div className="flex items-center mb-4">
                <div className="w-[48%] border rounded py-3 px-4 bg-[#FAFAFA] border-gray-300">
                  <label htmlFor="start" className="flex justify-between text-base text-[#a5a5a5] w-full">
                    From
                    <input
                      type="time"
                      id="start"
                      name="start"
                      value={adData.start || ""}
                      onChange={handleChange}
                      className="w-full bg-[#FAFAFA] rounded focus:outline-none text-black"
                    />
                  </label>
                </div>
                <div className="w-[4%] border-t-2 border-gray-300"></div>
                <div className="w-[48%] border rounded py-3 px-4 bg-[#FAFAFA] border-gray-300">
                  <label htmlFor="end" className="flex justify-between text-base text-[#a5a5a5] w-full">
                    To
                    <input
                      type="time"
                      id="end"
                      name="end"
                      value={adData.end || ""}
                      onChange={handleChange}
                      className="w-full bg-[#FAFAFA] rounded focus:outline-none text-black"
                    />
                  </label>
                </div>
              </div>
            </>
          )}
          <div className="flex justify-between mt-6">
            <button
              onClick={handleBack}
              disabled={step === 1}
              className="px-8 py-3 bg-gray-400 text-base font-semibold text-white rounded-full hover:bg-gray-300"
            >
              Back
            </button>
            {step < 2 ? (
              <button
                onClick={handleNext}
                className="px-8 py-3 bg-[#4A00E0] text-base font-semibold text-white rounded-full hover:bg-gray-400"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit2}
                className="px-8 py-3 bg-gradient text-base font-semibold text-white rounded-full hover:bg-gray-400"
              >
                Proceed to Pay
              </button>
            )}
          </div>
        </form>
      </div>
      <div className="lg:w-2/5 w-full">
        <div className="hidden lg:block">
          <AdPreview />
        </div>
        <TotalPrice ref={totalPriceRef} />
      </div>
    </div>
  );
};

export default AdCenter;
