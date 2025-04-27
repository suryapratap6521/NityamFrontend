import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAdData } from "../../../slices/adSlice";
import AdPreview from "./ReusesableComponents/AdPreview";
import TotalPrice from "./ReusesableComponents/TotalPrice";
import { fetchAllCommunities } from "../../../services/operations/adApi";
import Select from "react-select";
import { CitySelect, StateSelect } from "react-country-state-city";
import { createAd } from "../../../services/operations/adApi";
import axios from "axios";
import { resetAdData } from "../../../slices/adSlice";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

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
  const [step, setStep] = useState(1);
  const [errorList, setErrorList] = useState({});
  const adData = useSelector((state) => state.ad.adData || {});
  const pageData = useSelector((state) => state.page.pageData || {});
  const communitiesData = useSelector((state) => state.ad.communities || []);
  const token = useSelector((state) => state.auth.token);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  // Local states used for dropdown selections
  const [selectedStates, setSelectedStates] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);
  const navigate = useNavigate();

  const API_KEY = "emRDWFZrcTRpMWxUNHdhTEluQktQbFFoZUhoRFhLS2Znc2RNSHJnRQ==";
  const BASE_URL = "https://api.countrystatecity.in/v1/countries/IN";
  console.log(selectedStates);
  console.log(selectedCities);

  // NEW FEATURE: use custom handler to update both local and Redux state for states
  const handleStateChange = (selectedOptions) => {
    setSelectedStates(selectedOptions);
    dispatch(setAdData({ state: selectedOptions.map((opt) => opt.label) })); // Handle multiple states
    // When states change, reset cities in both local state and Redux
    setSelectedCities([]);
    dispatch(setAdData({ city: [] }));
  };

  // NEW FEATURE: use custom handler for city selection
  const handleCityChange = (selectedOptions) => {
    setSelectedCities(selectedOptions);
    dispatch(setAdData({ city: selectedOptions.map((opt) => opt.label) })); // Handle multiple cities
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
    const fetchStates = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/states`, {
          headers: { "X-CSCAPI-KEY": API_KEY },
        });
        setStates(
          response.data.map((state) => ({
            value: state.iso2,
            label: state.name,
          }))
        );
      } catch (error) {
        console.error("Error fetching states:", error);
      }
    };
    fetchStates();
  }, []);

  useEffect(() => {
    if (selectedStates.length > 0) {
      const fetchCities = async () => {
        try {
          let allCities = [];
          for (let state of selectedStates) {
            const response = await axios.get(
              `${BASE_URL}/states/${state.value}/cities`,
              {
                headers: { "X-CSCAPI-KEY": API_KEY },
              }
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

  useEffect(() => {
    const fetchData = async () => {
      //dispatch(resetAdData());
      try {
        await fetchAllCommunities(token, dispatch);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [token, dispatch]);

  const filteredBusinessTypes = businessTypes.filter((type) =>
    type.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      alert("You can only upload up to 5 images.");
      return;
    }
    // Store both the file and its preview details
    const imagePreviews = files.map((file) => ({
      file, // actual File object
      url: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
      type: file.type,
    }));
    setErrorList((prev) => ({ ...prev, images: "" }));
    dispatch(setAdData({ images: imagePreviews }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let isValid = true
    if (name == 'title' && value.length > 256) {
      setErrorList((prev) => ({ ...prev, title: "Maximum length for title is 256" }));
      isValid = false
    }
    if (name == 'description' && value.length > 256) {
      setErrorList((prev) => ({ ...prev, description: "Maximum length for description is 256" }));
      isValid = false
    }
    if (isValid) {
      setErrorList((prev) => ({ ...prev, [name]: "" }));

      if (name === "startDate") {
        dispatch(setAdData({ startDate: value, endDate: "" })); // Reset endDate
      } else {
        dispatch(setAdData({ [name]: value }));
      }
    }

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

    let selectedCommunities;
    if (adData.audianceType === "byCommunity") {
      selectedCommunities = adData.communities;
    }

    // Create FormData
    const formData = new FormData();
    formData.append("title", adData.title);
    formData.append("description", adData.description);
    formData.append("pageId", pageData._id);
    formData.append("price", 1000); // Assuming price is static

    // Append age group
    formData.append("ageGroup[minAge]", adData.minAge);
    formData.append("ageGroup[maxAge]", adData.maxAge);

    // Append date slot
    formData.append("dateSlot[startDate]", startDateTime.toISOString());
    formData.append("dateSlot[endDate]", endDateTime.toISOString());

    // Append audience type (optionType)
    formData.append("optionType", adData.audianceType);
    // Append location filters based on selected option
    if (selectedStates) {
      let statesLabels = selectedStates.map(item => item.label);
      formData.append("states", JSON.stringify(statesLabels));
    }
    if (selectedCities) {
      let cityLabels = selectedCities.map(item => item.label);
      formData.append("cities", JSON.stringify(cityLabels));
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

  const handleNext = (event) => {
    event.stopPropagation();
    event.preventDefault();
    let isValid = true;
    if (step === 1) {
      if (!adData.title) {
        setErrorList((prev) => ({ ...prev, title: "Please Enter Title" }));
        isValid = false;
      } else {
        setErrorList((prev) => ({ ...prev, title: "" }));
      }

      if (!adData.description) {
        setErrorList((prev) => ({ ...prev, description: "Please Enter Description" }));
        isValid = false;
      } else {
        setErrorList((prev) => ({ ...prev, description: "" }));
      }

      if (!adData.type) {
        setErrorList((prev) => ({ ...prev, type: "Please Enter Button Type" }));
        isValid = false;
      } else {
        setErrorList((prev) => ({ ...prev, type: "" }));
      }
      const urlRegex = /^(https?:\/\/)?([a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+)(\/[^\s]*)?$/;
      if (!adData.value) {
        setErrorList((prev) => ({ ...prev, value: "Please Enter Bussiness Url" }));
        isValid = false;
      } else if (!urlRegex.test(adData.value)) {
        setErrorList((prev) => ({ ...prev, value: "Please enter a valid business URL" }));
        isValid = false;
      } else {
        setErrorList((prev) => ({ ...prev, value: "" }));
      }

      if (!adData.images || adData.images.length === 0) {
        setErrorList((prev) => ({ ...prev, images: "Please Upload at least 1 image" }));
        isValid = false;
      } else {
        setErrorList((prev) => ({ ...prev, images: "" }));
      }
    }

    if (step === 2) {
      if (!adData.audianceType) {
        setErrorList((prev) => ({ ...prev, audianceType: "Please Enter Audiance Type" }));
        isValid = false;
      } else {
        setErrorList((prev) => ({ ...prev, audianceType: "" }));
      }
      if ((adData.audianceType === "byState" || adData.audianceType === "byCity") && selectedStates.length === 0) {
        setErrorList((prev) => ({ ...prev, selectedStates: "Please Enter States" }));
        isValid = false;
      } else {
        setErrorList((prev) => ({ ...prev, selectedStates: "" }));
      }
      if (adData.audianceType === "byCity" && selectedCities.length === 0) {
        setErrorList((prev) => ({ ...prev, selectedCities: "Please Enter City" }));
        isValid = false;
      } else {
        setErrorList((prev) => ({ ...prev, selectedCities: "" }));
      }
      if (adData.audianceType === "byCommunity" && (!adData.communities || adData.communities.length === 0)) {
        setErrorList((prev) => ({ ...prev, communities: "Please Enter Communities" }));
        isValid = false;
      } else {
        setErrorList((prev) => ({ ...prev, communities: "" }));
      }
      if (!adData.minAge) {
        setErrorList((prev) => ({ ...prev, minAge: "Please Enter Minimum Age" }));
        isValid = false;
      } else {
        setErrorList((prev) => ({ ...prev, minAge: "" }));
      }
      if (!adData.maxAge) {
        setErrorList((prev) => ({ ...prev, maxAge: "Please Enter Maximum Age" }));
        isValid = false;
      } else {
        setErrorList((prev) => ({ ...prev, maxAge: "" }));
      }
      if (!adData.startDate) {
        setErrorList((prev) => ({ ...prev, startDate: "Please Enter Start Date" }));
        isValid = false;
      } else {
        setErrorList((prev) => ({ ...prev, startDate: "" }));
      }
      if (!adData.endDate) {
        setErrorList((prev) => ({ ...prev, endDate: "Please Enter End Date" }));
        isValid = false;
      } else {
        setErrorList((prev) => ({ ...prev, endDate: "" }));
      }
      if (!adData.start) {
        setErrorList((prev) => ({ ...prev, start: "Please Enter Start Time" }));
        isValid = false;
      } else {
        setErrorList((prev) => ({ ...prev, start: "" }));
      }
      if (!adData.end) {
        setErrorList((prev) => ({ ...prev, end: "Please Enter End Time" }));
        isValid = false;
      } else {
        setErrorList((prev) => ({ ...prev, end: "" }));
      }
    }
    if (isValid) {
      setErrorList({});
      if (step === 2) {
        handleSubmit2();
      } else {
        if (step < 2) setStep(step + 1);
      }
    }
  };

  const handleBack = (event) => {
    event.stopPropagation();
    event.preventDefault();
    if (step > 1) setStep(step - 1);
  };

  const totalPriceRef = useRef(null);

  const handleSubmit2 = (e) => {
    if (totalPriceRef.current) {
      totalPriceRef.current.handleSubmit(e);
    }
  };
  const handleBackClick = () => {
    if (adData != {}) {
      Swal.fire({
        title: 'Are you sure?',
        text: 'You have unsaved changes. Do you really want to leave?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#338e37',
        confirmButtonText: 'Yes, leave',
        cancelButtonText: 'Stay here',
      }).then((result) => {
        if (result.isConfirmed) {
          navigate(-1);
        }
      });
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="max-w-[1320px] items-start flex flex-col lg:flex-row mx-auto md:p-6 p-3 lg:mb-0 mb-14">
      <div className="lg:w-3/5 w-full p-4">
        <div>
          <div className="p-2 bg-[#8E2DE220] rounded-full w-8 h-8 flex justify-center align-items-center pl-3 mb-3 hover:scale-110" onClick={handleBackClick}>
            <ArrowBackIosIcon fontSize="14" style={{ color: "#8E2DE2" }} />
          </div>
          <h1 className="md:text-3xl text-xl text-left font-semibold mb-1 text-[#8E2DE2]">
            Create New Ad
          </h1>
          <p className="text-gray-400 leading-4 text-sm mb-4">
            Design and launch impactful ads effortlessly.
          </p>
        </div>
        <div className="lg:w-10/12 w-full">
          <form onSubmit={(e) => e.preventDefault()}>
            {step === 1 && (
              <>
                {/* Title */}
                <div className="mb-1">
                  <label htmlFor="title" className="text-lg font-normal text-gray-600">
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    placeholder="Enter the title for your ad"
                    value={adData.title || ""}
                    onChange={handleChange}
                    className="border rounded w-full py-3 px-4 border-gray-300 bg-[#FAFAFA]"
                  />
                  {errorList.title && errorList.title !== "" && (
                    <span className="text-red-600 pl-1">{errorList.title}</span>
                  )}
                </div>

                {/* Description */}
                <div className="mb-1">
                  <label htmlFor="description" className="text-lg font-normal text-gray-600">
                    Description
                  </label>
                  <input
                    type="text"
                    id="description"
                    name="description"
                    placeholder="Enter the description for your ad"
                    value={adData.description || ""}
                    onChange={handleChange}
                    className="border rounded w-full py-3 px-4 border-gray-300 bg-[#FAFAFA]"
                  />
                  {errorList.description && errorList.description !== "" && (
                    <span className="text-red-600 pl-1">{errorList.description}</span>
                  )}
                </div>

                {/* Button Label */}
                <label className="text-lg font-normal text-gray-600">Button</label>
                <div className="flex flex-col sm:flex-row gap-1 sm:gap-0  items-baseline mb-4 justify-between">
                  <div className="flex flex-col sm:w-[48%] w-full">
                    <div className="flex gap-6 items-center flex-1 border rounded w-full py-3 px-4 pr-6 border-gray-300 bg-[#FAFAFA]">
                      <select
                        id="type"
                        name="type"
                        value={adData.type || ""}
                        onChange={handleChange}
                        className="bg-[#FAFAFA] rounded w-full focus:outline-none text-base text-gray-600"
                      >
                        <option value="">Select Button Type</option>
                        {filteredBusinessTypes.map((type, index) => (
                          <option key={index} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>
                    {errorList.type && errorList.type !== "" && (
                      <span className="text-red-600 pl-1">{errorList.type}</span>
                    )}
                  </div>
                  <div className="sm:w-[4%] w-0 border-t-2 border-gray-300"></div>
                  <div className="flex flex-col sm:w-[48%] w-full">
                    <div className="flex gap-6 items-center flex-1 border rounded w-full py-3 px-4 pr-6 border-gray-300 bg-[#FAFAFA]">
                      <input
                        type="text"
                        id="value"
                        name="value"
                        value={adData.value || ""}
                        onChange={handleChange}
                        className="bg-[#FAFAFA] rounded w-full focus:outline-none"
                        placeholder="Bussiness Url"
                      />
                    </div>
                    {errorList.value && errorList.value !== "" && (
                      <span className="text-red-600 pl-1">{errorList.value}</span>
                    )}
                  </div>
                </div>

                {/* Multi-Select for Images */}
                <label htmlFor="images" className="text-lg font-normal text-gray-600">
                  Upload Images (Select up to 5)
                </label>
                <div className="mb-4 flex items-center gap-4">
                  <label
                    htmlFor="images"
                    className="flex gap-6 items-center text-gray-600 justify-between flex-1 border rounded w-full py-3 px-4 pr-6 border-gray-300 bg-[#FAFAFA]"
                  >
                    {adData.images && adData.images.length !== 0
                      ? `${adData.images.length} Image(s) Selected`
                      : "Choose Your Ad Photos"}
                    <div className="m-0 p-3 rounded-full bg-gradient">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M18 20H4V6H13V4H4C2.9 4 2 4.9 2 6V20C2 21.1 2.9 22 4 22H18C19.1 22 20 21.1 20 20V11H18V20ZM10.21 16.83L8.25 14.47L5.5 18H16.5L12.96 13.29L10.21 16.83ZM20 4V1H18V4H15C15.01 4.01 15 6 15 6H18V8.99C18.01 9 20 8.99 20 8.99V6H23V4H20Z"
                          fill="white"
                        />
                      </svg>
                    </div>
                  </label>
                  <input
                    type="file"
                    id="images"
                    name="images"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleImageChange(e)}
                    className="hidden"
                  />
                </div>
                {errorList.images && errorList.images !== "" && (
                  <span className="text-red-600 pl-1">{errorList.images}</span>
                )}
              </>
            )}
            {step === 2 && (
              <>
                {/* User Type Selection */}
                <div className="mb-1">
                  <label className="text-lg font-normal text-gray-600">Target Audience</label>
                  <div className="flex gap-2 mt-2 flex-wrap">
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
                  {errorList.audianceType && errorList.audianceType !== "" && (
                    <span className="text-red-600 pl-1">{errorList.audianceType}</span>
                  )}
                </div>

                <div className="flex items-center justify-center gap-2 mb-4">
                  {(adData.audianceType === "byState" || adData.audianceType === "byCity") && (
                    <div className="flex-1">
                      <div className="">
                        <label className="block text-gray-600 font-medium">Select State</label>
                        {/* Use new custom handler for state selection */}
                        <Select
                          isMulti
                          options={states}
                          value={selectedStates}
                          onChange={handleStateChange}
                        />
                      </div>
                      {errorList.selectedStates && errorList.selectedStates !== "" && (
                        <span className="text-red-600 pl-1 mb-4 d-block">{errorList.selectedStates}</span>
                      )}
                    </div>
                  )}

                  {adData.audianceType === "byCity" && (
                    <div className="flex-1">
                      <div className="">
                        <label className="block text-gray-600 font-medium">Select Cities</label>
                        {/* Use new custom handler for city selection */}
                        <Select
                          isMulti
                          options={cities}
                          value={selectedCities}
                          onChange={handleCityChange}
                          isDisabled={selectedStates.length === 0}
                        />
                      </div>
                      {errorList.selectedCities && errorList.selectedCities !== "" && (
                        <span className="text-red-600 pl-1 mb-4 d-block">{errorList.selectedCities}</span>
                      )}
                    </div>
                  )}

                  {adData.audianceType === "byCommunity" && (
                    <div className="flex-1">
                      <div className="flex-1">
                        <label className="block text-gray-600 font-medium">Select Communities</label>
                        <Select
                          isMulti
                          name="communities"
                          value={
                            adData.communities && Array.isArray(adData.communities)
                              ? adData.communities
                                .map((communityName) => {
                                  const community = communitiesData.find(
                                    (community) => community.communityName === communityName
                                  );
                                  return community
                                    ? { value: community.communityName, label: community.communityName }
                                    : null;
                                })
                                .filter(Boolean)
                              : []
                          }
                          onChange={(selectedOptions) => {
                            const selectedValues = selectedOptions.map(option => option.value);
                            dispatch(setAdData({ communities: selectedValues }));
                          }}
                          options={communitiesData.map((community) => ({
                            value: community.communityName,
                            label: community.communityName,
                          }))}
                          className="border rounded w-full p-2"
                        />
                      </div>
                      {errorList.communities && errorList.communities !== "" && (
                        <span className="text-red-600 pl-1 mb-4 d-block">{errorList.communities}</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Age Group */}
                <label className="text-lg font-normal text-gray-600">Target Audience Age Group</label>
                <div className="flex flex-col sm:flex-row gap-1 sm:gap-0  items-baseline mb-4">
                  <div className="flex flex-col sm:w-[48%] w-full">
                    <div className="flex gap-6 items-center flex-1 border rounded w-full py-3 px-4 pr-6 border-gray-300 bg-[#FAFAFA]">
                      <label htmlFor="minAge" className="block text-base text-[#838383] text-nowrap mb-0">
                        Minimum Age
                      </label>
                      <input
                        type="number"
                        id="minAge"
                        name="minAge"
                        value={adData.minAge || ""}
                        onChange={handleChange}
                        className="bg-[#FAFAFA] rounded w-full focus:outline-none"
                      />
                    </div>
                    {errorList.minAge && errorList.minAge !== "" && (
                      <span className="text-red-600 pl-1">{errorList.minAge}</span>
                    )}
                  </div>
                  <div className="sm:w-[4%] w-0 border-t-2 border-gray-300"></div>
                  <div className="flex flex-col sm:w-[48%] w-full">
                    <div className="flex gap-6 items-center flex-1 border rounded w-full py-3 px-4 pr-6 border-gray-300 bg-[#FAFAFA]">
                      <label htmlFor="maxAge" className="block text-base text-[#838383] text-nowrap mb-0">
                        Maximum Age
                      </label>
                      <input
                        type="number"
                        id="maxAge"
                        name="maxAge"
                        value={adData.maxAge || ""}
                        onChange={handleChange}
                        className="bg-[#FAFAFA] rounded w-full focus:outline-none"
                      />
                    </div>
                    {errorList.maxAge && errorList.maxAge !== "" && (
                      <span className="text-red-600 pl-1">{errorList.maxAge}</span>
                    )}
                  </div>
                </div>

                {/* Date Slot */}
                <label className="text-lg font-normal text-gray-600">Date Slot</label>
                <div className="flex flex-col sm:flex-row gap-1 sm:gap-0 items-baseline mb-4">
                  <div className="flex flex-col sm:w-[48%] w-full">
                    <div className="flex gap-6 items-center flex-1 border rounded w-full py-3 px-4 pr-6 border-gray-300 bg-[#FAFAFA] cursor-pointer">
                      <label
                        htmlFor="startDate"
                        className="flex justify-between text-base text-[#838383] text-nowrap mb-0 w-full"
                      >
                        Start Date
                        <input
                          type="date"
                          id="startDate"
                          name="startDate"
                          value={adData.startDate || ""}
                          onChange={handleChange}
                          className="bg-[#FAFAFA] rounded w-full focus:outline-none text-black"
                          min={new Date().toISOString().split("T")[0]} // today's date
                        />
                      </label>
                    </div>
                    {errorList.startDate && errorList.startDate !== "" && (
                      <span className="text-red-600 pl-1">{errorList.startDate}</span>
                    )}
                  </div>

                  <div className="sm:w-[4%] w-0 border-t-2 border-gray-300"></div>
                  <div className="flex flex-col sm:w-[48%] w-full">
                    <div className="flex gap-6 items-center flex-1 border rounded w-full py-3 px-4 pr-6 border-gray-300 bg-[#FAFAFA] cursor-pointer">
                      <label
                        htmlFor="endDate"
                        className="flex justify-between text-base text-[#838383] text-nowrap mb-0 w-full"
                      >
                        End Date
                        <input
                          type="date"
                          id="endDate"
                          name="endDate"
                          value={adData.endDate || ""}
                          onChange={handleChange}
                          className="bg-[#FAFAFA] rounded w-full focus:outline-none text-black"
                          min={adData.startDate || ""}

                        />
                      </label>
                    </div>
                    {errorList.endDate && errorList.endDate !== "" && (
                      <span className="text-red-600 pl-1">{errorList.endDate}</span>
                    )}
                  </div>
                </div>

                {/* Time Slot */}
                <label className="text-lg font-normal text-gray-600">Time Slot</label>
                <div className="flex flex-col sm:flex-row gap-1 sm:gap-0  items-baseline mb-4">
                  <div className="flex flex-col sm:w-[48%] w-full">
                    <div className="flex gap-6 items-center flex-1 border rounded w-full py-3 px-4 pr-6 border-gray-300 bg-[#FAFAFA]">
                      <label htmlFor="start" className="flex justify-between text-base text-[#838383] text-nowrap mb-0 w-full">
                        From
                        <input
                          type="time"
                          id="start"
                          name="start"
                          value={adData.start || ""}
                          onChange={handleChange}
                          className="bg-[#FAFAFA] rounded w-full focus:outline-none text-black"
                        />
                      </label>
                    </div>
                    {errorList.start && errorList.start !== "" && (
                      <span className="text-red-600 pl-1">{errorList.start}</span>
                    )}
                  </div>
                  <div className="sm:w-[4%] w-0 border-t-2 border-gray-300"></div>
                  <div className="flex flex-col sm:w-[48%] w-full">
                    <div className="flex gap-6 items-center flex-1 border rounded w-full py-3 px-4 pr-6 border-gray-300 bg-[#FAFAFA]">
                      <label htmlFor="end" className="flex justify-between text-base text-[#838383] text-nowrap mb-0 w-full">
                        To
                        <input
                          type="time"
                          id="end"
                          name="end"
                          value={adData.end || ""}
                          onChange={handleChange}
                          className="bg-[#FAFAFA] rounded w-full focus:outline-none text-black"
                        />
                      </label>
                    </div>
                    {errorList.end && errorList.end !== "" && (
                      <span className="text-red-600 pl-1">{errorList.end}</span>
                    )}
                  </div>
                </div>
              </>
            )}
            <div className="flex justify-between mt-6 ">
              {step != 1 ? (
                <button
                  onClick={handleBack}
                  disabled={step === 1}
                  className="px-8 py-3 bg-gray-400 text-base font-semibold text-white rounded-full hover:bg-gray-300"
                >
                  Back
                </button>
              ) : null}
              {step < 2 ? (
                <button
                  onClick={handleNext}
                  className="px-8 py-3 bg-[#4A00E0] text-base font-semibold text-white rounded-full hover:bg-gray-400 ml-auto"
                >
                  Next
                </button>
              ) :
                (
                  <button
                    onClick={handleNext}
                    className="px-8 py-3 bg-gradient text-base font-semibold text-white rounded-full hover:bg-gray-400"
                  >
                    Proceed to Pay
                  </button>
                )

              }
            </div>
          </form>
        </div>
      </div>
      <div className="lg:w-2/5 w-full">
        <div className="hidden lg:block">
          <AdPreview />
        </div>
        {step >= 2 && <TotalPrice ref={totalPriceRef} />}
      </div>
    </div>
  );
};

export default AdCenter;
