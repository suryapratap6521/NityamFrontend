import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAdData } from "../../../slices/adSlice";
import AdPreview from "./ReusesableComponents/AdPreview";
import TotalPrice from "./ReusesableComponents/TotalPrice";
import { fetchAllCommunities } from "../../../services/operations/adApi";
import Select from "react-select";
import { CitySelect, StateSelect } from "react-country-state-city";
import { createAd } from "../../../services/operations/adApi";
import axios from "axios";
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
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedStates, setSelectedStates] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);
  console.log(selectedCities);
  console.log(selectedStates);
  const API_KEY = "emRDWFZrcTRpMWxUNHdhTEluQktQbFFoZUhoRFhLS2Znc2RNSHJnRQ==";
  const BASE_URL = "https://api.countrystatecity.in/v1/countries/IN";
  console.log(selectedStates);
  console.log(selectedCities)
  const handleStateChange = (selectedState) => {
    setSelectedStates(selectedState);
    dispatch(setAdData({ state: selectedState.name }));
    setSelectedCities([]); // Reset city selection when state changes
    dispatch(setAdData({ city: "" }));
  };

  const handleCityChange = (selectedCity) => {
    setSelectedCities(selectedCity);
    dispatch(setAdData({ city: selectedCity.name }));
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
            const response = await axios.get(`${BASE_URL}/states/${state.value}/cities`, {
              headers: { "X-CSCAPI-KEY": API_KEY },
            });
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

    let selectedCommunities;

    // if (adData.audianceType === "byState") {
    //   selectedStates = adData.states;
    // } else if (adData.audianceType === "byCity") {
    //   selectedCities = adData.cities;
    if (adData.audianceType === "byCommunity") {
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
    // console.log(adaudianceType)
    // Append location filters based on selected option
    if (selectedStates) {
      console.log(selectedStates);
      let statesLabels = selectedStates.map(item => item.label);
      console.log(statesLabels);
      formData.append("states", JSON.stringify(statesLabels)); // Use JSON.stringify to ensure proper array formatting in the form data
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



  return (
    <div className="container items-start border-t-0 flex flex-col lg:flex-row mx-auto p-6 lg:mb-0 mb-14">
      <div className="lg:w-3/5 w-full p-4">
        <div>
          <h1 className="md:text-3xl text-xl text-left font-semibold mb-1 text-[#8E2DE2]">
            Create New Ad
          </h1>
          <p className="text-gray-400 leading-4 text-sm mb-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod</p>
        </div>
        <div className="lg:w-10/12 w-full">
          <form>
            {/* Title */}
            <div className="mb-4">
              <label htmlFor="title" className="text-lg font-normal text-gray-600">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                placeholder="Enter the title for your ad"
                value={adData.title || ""}
                onChange={handleChange} // Handle change for title
                className="border rounded w-full py-3 px-4 border-gray-300 bg-[#FAFAFA]"
              />
            </div>

            {/* User Type Selection */}
            <div className="mb-1">
              <label className="text-lg font-normal text-gray-600">Target Audience</label>
              <div className="flex gap-2 mt-2">
                <label className="flex items-center gap-2 border rounded w-fit py-3 px-4 pr-6 border-gray-300 bg-[#FAFAFA] text-gray-700 text-base">
                  <input
                    type="radio"
                    name="audianceType"
                    value="allUsers"
                    checked={adData.audianceType === "allUsers"}
                    onChange={handleChange}
                  />
                  All Users
                </label>
                <label className="flex items-center gap-2 border rounded w-fit py-3 px-4 pr-6 border-gray-300 bg-[#FAFAFA] text-gray-700 text-base">
                  <input
                    type="radio"
                    name="audianceType"
                    value="byState"
                    checked={adData.audianceType === "byState"}
                    onChange={handleChange}
                  />
                  By State
                </label>
                <label className="flex items-center gap-2 border rounded w-fit py-3 px-4 pr-6 border-gray-300 bg-[#FAFAFA] text-gray-700 text-base">
                  <input
                    type="radio"
                    name="audianceType"
                    value="byCity"
                    checked={adData.audianceType === "byCity"}
                    onChange={handleChange}
                  />
                  By City
                </label>
                <label className="flex items-center gap-2 border rounded w-fit py-3 px-4 pr-6 border-gray-300 bg-[#FAFAFA] text-gray-700 text-base">
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
                  <label className="block text-gray-600 font-semibold text-sm">Select State</label>
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
                  <label className="block text-gray-600 font-semibold text-sm">Select Cities</label>
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
                  <label className="block text-gray-600 font-semibold text-sm">Select Communities</label>
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
            <label className="text-lg font-normal text-gray-600">Time Slot</label>
            <div className="flex items-center mb-4">
              <div className=" flex gap-6 items-center flex-1 border rounded w-[48%] py-3 px-4 pr-6 border-gray-300 bg-[#FAFAFA] ">
                <label htmlFor="start" className="block text-base text-gray-600 text-nowrap mb-0">Start Date</label>
                <input
                  type="time"
                  id="start"
                  name="start"
                  value={adData.start || ""}
                  onChange={handleChange}
                  className="bg-[#FAFAFA] rounded w-full focus:outline-none"
                />
              </div>
              <div className="w-[4%] border-t-2 border-gray-300"></div>
              <div className=" flex gap-6 items-center flex-1 border roundedw-[48%]  py-3 px-4 pr-6 border-gray-300 bg-[#FAFAFA] ">
                <label htmlFor="end" className="block text-base text-gray-600 text-nowrap mb-0">End Date</label>
                <input
                  type="time"
                  id="end"
                  name="end"
                  value={adData.end || ""}
                  onChange={handleChange}
                  className="bg-[#FAFAFA] rounded w-full focus:outline-none"
                />
              </div>
            </div> */}

            {/* Age Group */}
            <label className="text-lg font-normal text-gray-600">Target Audience Age Group</label>
            <div className="flex items-center mb-4">

              <div className=" flex gap-6 items-center flex-1 border rounded w-[48%] py-3 px-4 pr-6 border-gray-300 bg-[#FAFAFA] ">
                <label htmlFor="minAge" className="block text-base text-gray-600 text-nowrap mb-0">Minimum Age</label>
                <input
                  type="number"
                  id="minAge"
                  name="minAge"
                  value={adData.minAge || ""}
                  onChange={handleChange}
                  className="bg-[#FAFAFA] rounded w-full focus:outline-none"
                />
              </div>
              <div className="w-[4%] border-t-2 border-gray-300"></div>
              <div className=" flex gap-6 items-center flex-1 border rounded w-[48%] py-3 px-4 pr-6 border-gray-300 bg-[#FAFAFA] ">
                <label htmlFor="maxAge" className="block text-base text-gray-600 text-nowrap mb-0">Maximum Age</label>
                <input
                  type="number"
                  id="maxAge"
                  name="maxAge"
                  value={adData.maxAge || ""}
                  onChange={handleChange}
                  className="bg-[#FAFAFA] rounded w-full focus:outline-none"
                />
              </div>
            </div>

            {/* Date Slot */}
            <label className="text-lg font-normal text-gray-600">Date Slot</label>
            <div className="flex items-center mb-4">
              <div className=" flex gap-6 items-center flex-1 border rounded w-[48%] py-3 px-4 pr-6 border-gray-300 bg-[#FAFAFA] ">
                <label htmlFor="startDate" className="block text-base text-gray-600 text-nowrap mb-0">Start Date</label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={adData.startDate || ""}
                  onChange={handleChange}
                  className="bg-[#FAFAFA] rounded w-full focus:outline-none"
                />
              </div>
              <div className="w-[4%] border-t-2 border-gray-300"></div>
              <div className=" flex gap-6 items-center flex-1 border rounded w-[48%] py-3 px-4 pr-6 border-gray-300 bg-[#FAFAFA] ">
                <label htmlFor="endDate" className="block text-base text-gray-600 text-nowrap mb-0">End Date</label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={adData.endDate || ""}
                  onChange={handleChange}
                  className="bg-[#FAFAFA] rounded w-full focus:outline-none"
                />
              </div>
            </div>

            {/* Button Label */}
            <label className="text-lg font-normal text-gray-600">Button</label>
            <div className="flex items-center mb-4 justify-between">
              <div className=" flex gap-6 items-center flex-1 border rounded w-[48%] py-3 px-4 pr-6 border-gray-300 bg-[#FAFAFA] ">
                {/* <label htmlFor="type" className="block text-base text-gray-600 text-nowrap mb-0">Type</label> */}
                <select
                  id="type"
                  name="type"
                  value={adData.type || ""}
                  onChange={handleChange}
                  className="bg-[#FAFAFA] rounded w-full focus:outline-none text-base text-gray-600 text-nowrap mb-0"
                >
                  <option value="">Select Button Type</option>
                  {filteredBusinessTypes.map((type, index) => (
                    <option key={index} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div className="w-[4%] "></div>
              <div className=" flex gap-6 items-center flex-1 border rounded w-[48%] py-3 px-4 pr-6 border-gray-300 bg-[#FAFAFA] ">
                {/* <label htmlFor="value" className="block text-base text-gray-600 text-nowrap mb-0">Redirect Path</label> */}
                <input
                  type="text"
                  id="value"
                  name="value"
                  value={adData.value || ""}
                  onChange={handleChange}
                  className="bg-[#FAFAFA] rounded w-full focus:outline-none"
                  placeholder="Redirect Path"
                />
              </div>
            </div>

            {/* Multi-Select for Images */}
            <label htmlFor="images" className="text-lg font-normal text-gray-600">Upload Images (Select up to 5)</label>
            <div className="mb-4 flex items-center gap-4">
              <label htmlFor="images" className=" flex gap-6 items-center text-gray-600 justify-between flex-1 border rounded w-full py-3 px-4 pr-6 border-gray-300 bg-[#FAFAFA] ">Choose Your Ad Photos
                <div className="m-0 p-3 rounded-full bg-gradient"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 20H4V6H13V4H4C2.9 4 2 4.9 2 6V20C2 21.1 2.9 22 4 22H18C19.1 22 20 21.1 20 20V11H18V20ZM10.21 16.83L8.25 14.47L5.5 18H16.5L12.96 13.29L10.21 16.83ZM20 4V1H18V4H15C15.01 4.01 15 6 15 6H18V8.99C18.01 9 20 8.99 20 8.99V6H23V4H20Z" fill="white" />
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
                className="hidden w-11/12 gap-6 items-center flex-1 border rounded py-3 px-4 pr-6 border-gray-300 bg-[#FAFAFA] "
              />


            </div>
            {/* <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-green-500 text-white rounded w-full"
            >
              Submit
            </button> */}
          </form>
        </div>
      </div >
      <div className="lg:w-2/5 w-full">
        <div className="hidden lg:block">
          <AdPreview />
        </div>
        <TotalPrice />
      </div>
    </div >

  );

};

export default AdCenter;
