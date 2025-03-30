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
import { toast } from "react-toastify";

// Initial ad data structure; ensure your Redux slice is initialized similarly.
const initialAdData = {
  title: "",
  description: "",
  "ageGroup[minAge]": "",
  "ageGroup[maxAge]": "",
  "dateSlot[startDate]": "",
  "dateSlot[endDate]": "",
  audianceType: "allUsers", // "allUsers", "byState", "byCity", "byCommunity"
  "buttonLabel[type]": "",
  "buttonLabel[value]": "",
  state: [],
  city: [],
  communities: [],
  premium: false,
  images: [],
};

const AdCenter = () => {
  const dispatch = useDispatch();
  const [step, setStep] = useState(1);
  const adData = useSelector((state) => state.ad.adData || {});
  const pageData = useSelector((state) => state.page.pageData || {});
  const communitiesData = useSelector((state) => state.ad.communities || []);
  const token = useSelector((state) => state.auth.token);

  // Local state for location selections
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedStates, setSelectedStates] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);
  const totalPriceRef = useRef(null);

  const API_KEY = "emRDWFZrcTRpMWxUNHdhTEluQktQbFFoZUhoRFhLS2Znc2RNSHJnRQ==";
  const BASE_URL = "https://api.countrystatecity.in/v1/countries/IN";

  // Wait for pageData to load.
  if (!pageData._id) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading page data, please wait...</p>
      </div>
    );
  }

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
        toast.error("Error fetching states.");
      }
    };
    fetchStates();
  }, [API_KEY, BASE_URL]);

  useEffect(() => {
    if (selectedStates.length > 0) {
      const fetchCities = async () => {
        try {
          let allCities = [];
          for (let state of selectedStates) {
            const response = await axios.get(
              `${BASE_URL}/states/${state.value}/cities`,
              { headers: { "X-CSCAPI-KEY": API_KEY } }
            );
            allCities = allCities.concat(
              response.data.map((city) => ({
                value: city.name,
                label: city.name,
              }))
            );
          }
          setCities(allCities);
        } catch (error) {
          console.error("Error fetching cities:", error);
          toast.error("Error fetching cities.");
        }
      };
      fetchCities();
    } else {
      setCities([]);
    }
  }, [selectedStates, API_KEY, BASE_URL]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchAllCommunities(token, dispatch);
      } catch (error) {
        console.error(error);
        toast.error("Error fetching communities.");
      }
    };
    fetchData();
  }, [dispatch, token]);

  // Handle state selection. Expecting multiple selection.
  const handleStateChange = (selected) => {
    setSelectedStates(selected);
    dispatch(setAdData({ state: selected.map((s) => s.label) }));
    // Clear city selection
    setSelectedCities([]);
    dispatch(setAdData({ city: [] }));
  };

  // Handle city selection.
  const handleCityChange = (selected) => {
    setSelectedCities(selected);
    dispatch(setAdData({ city: selected.map((c) => c.label) }));
  };

  // Premium toggle handler.
  const handlePremiumChange = (e) => {
    dispatch(setAdData({ premium: e.target.checked }));
  };

  const businessTypes = [
    "Contact Us",
    "Send Enquiry",
    "Apply Now",
    "Visit Our Website",
    "Message Us",
    "Download App",
    "Subscribe Us",
    "Fill Form",
  ];

  // Append new images to existing images.
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + (adData.images?.length || 0) > 5) {
      toast.warn("You can only upload up to 5 images.");
      return;
    }
    const imagePreviews = files.map((file) => ({
      url: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
      type: file.type,
      file,
    }));
    dispatch(setAdData({ images: [...(adData.images || []), ...imagePreviews] }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(setAdData({ [name]: value }));
  };

  // Helper: get current datetime formatted for datetime-local input.
  const getMinDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!adData["dateSlot[startDate]"] || !adData["dateSlot[endDate]"]) {
      toast.warn("Please fill in both start and end date/time.");
      return;
    }

    const formData = new FormData();
    formData.append("title", adData.title);
    formData.append("description", adData.description);
    formData.append("pageId", pageData._id);
    formData.append("price", 1000); // Static price; adjust as needed

    const startDateTime = new Date(adData["dateSlot[startDate]"]).toISOString();
    const endDateTime = new Date(adData["dateSlot[endDate]"]).toISOString();
    formData.append("dateSlot[startDate]", startDateTime);
    formData.append("dateSlot[endDate]", endDateTime);

    formData.append("ageGroup[minAge]", adData["ageGroup[minAge]"]);
    formData.append("ageGroup[maxAge]", adData["ageGroup[maxAge]"]);

    formData.append("optionType", adData.audianceType);
    formData.append("premium", adData.premium ? "true" : "false");

    if (adData.audianceType === "byState") {
      formData.append("states", JSON.stringify(adData.state));
    } else if (adData.audianceType === "byCity") {
      formData.append("cities", JSON.stringify(adData.city));
    } else if (adData.audianceType === "byCommunity") {
      formData.append("communities", JSON.stringify(adData.communities));
    }

    formData.append("buttonLabel[type]", adData["buttonLabel[type]"]);
    formData.append("buttonLabel[value]", adData["buttonLabel[value]"]);

    if (adData.images && Array.isArray(adData.images)) {
      adData.images.forEach((imgObj) => {
        formData.append("imagesArray", imgObj.file);
      });
    }

    try {
      const response = await createAd(formData, dispatch, token);
      toast.success("Ad created successfully!");
      // Clear form fields
      dispatch(setAdData(initialAdData));
      setSelectedStates([]);
      setSelectedCities([]);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to create ad. Please try again.");
    }
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (step < 2) setStep(step + 1);
  };

  const handleBack = (e) => {
    e.preventDefault();
    if (step > 1) setStep(step - 1);
  };

  // In your code, you used handleSubmit2 to trigger payment via TotalPrice component.
  // Here, we assume the "Proceed to Pay" button on step 2 calls handleSubmit.
  const handleProceedToPay = (e) => {
    e.preventDefault();
    handleSubmit(e);
  };

  return (
    <div className="max-w-[1320px] flex flex-col lg:flex-row mx-auto p-6 lg:mb-0 mb-14">
      <div className="lg:w-3/5 w-full p-4">
        <h1 className="md:text-3xl text-xl font-semibold mb-1 text-[#8E2DE2]">
          Create New Ad
        </h1>
        <p className="text-gray-400 text-sm mb-4">
          Design and launch impactful ads effortlessly.
        </p>
        <form onSubmit={(e) => e.preventDefault()}>
          {step === 1 && (
            <>
              {/* Title */}
              <div className="mb-4">
                <label htmlFor="title" className="text-lg text-gray-600">
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
              </div>
              {/* Description */}
              <div className="mb-4">
                <label htmlFor="description" className="text-lg text-gray-600">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Enter the description for your ad"
                  value={adData.description || ""}
                  onChange={handleChange}
                  className="border rounded w-full py-3 px-4 border-gray-300 bg-[#FAFAFA]"
                />
              </div>
              {/* Button Label */}
              <label className="text-lg text-gray-600">Button</label>
              <div className="flex items-center mb-4 justify-between">
                <div className="flex items-center gap-6 flex-1 border rounded w-[48%] py-3 px-4 border-gray-300 bg-[#FAFAFA]">
                  <select
                    id="type"
                    name="type"
                    value={adData.type || ""}
                    onChange={handleChange}
                    className="bg-[#FAFAFA] rounded w-full focus:outline-none text-base text-gray-600"
                  >
                    <option value="">Select Button Type</option>
                    {businessTypes.map((type, index) => (
                      <option key={index} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="w-[4%]"></div>
                <div className="flex items-center gap-6 flex-1 border rounded w-[48%] py-3 px-4 border-gray-300 bg-[#FAFAFA]">
                  <input
                    type="text"
                    id="value"
                    name="value"
                    value={adData.value || ""}
                    onChange={handleChange}
                    placeholder="Redirect Path"
                    className="bg-[#FAFAFA] rounded w-full focus:outline-none"
                  />
                </div>
              </div>
              {/* Image Upload with Preview */}
              <label htmlFor="images" className="text-lg text-gray-600">
                Upload Images (up to 5)
              </label>
              <div className="mb-4 flex flex-wrap gap-4">
                {adData.images &&
                  adData.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img.url}
                      alt={`Preview ${idx}`}
                      className="w-24 h-24 object-cover rounded"
                    />
                  ))}
                <label
                  htmlFor="images"
                  className="flex items-center justify-center w-24 h-24 border border-dashed rounded cursor-pointer"
                >
                  +
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
              {/* Age Group */}
              <div className="flex items-center mb-4 gap-4">
                <div className="flex-1">
                  <label htmlFor="ageGroup[minAge]" className="text-lg text-gray-600">
                    Minimum Age
                  </label>
                  <input
                    type="number"
                    id="ageGroup[minAge]"
                    name="ageGroup[minAge]"
                    value={adData["ageGroup[minAge]"]}
                    onChange={handleChange}
                    className="border rounded w-full py-2 px-3 bg-[#FAFAFA]"
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="ageGroup[maxAge]" className="text-lg text-gray-600">
                    Maximum Age
                  </label>
                  <input
                    type="number"
                    id="ageGroup[maxAge]"
                    name="ageGroup[maxAge]"
                    value={adData["ageGroup[maxAge]"]}
                    onChange={handleChange}
                    className="border rounded w-full py-2 px-3 bg-[#FAFAFA]"
                  />
                </div>
              </div>
              {/* Combined Date and Time */}
              <div className="flex flex-col mb-4">
                <label className="text-lg text-gray-600">
                  Select Date & Time Range
                </label>
                <div className="flex gap-4 mt-2">
                  <input
                    type="datetime-local"
                    name="dateSlot[startDate]"
                    value={adData["dateSlot[startDate]"]}
                    onChange={handleChange}
                    min={getMinDateTime()}
                    className="border rounded w-full py-2 px-3 bg-[#FAFAFA]"
                  />
                  <input
                    type="datetime-local"
                    name="dateSlot[endDate]"
                    value={adData["dateSlot[endDate]"]}
                    onChange={handleChange}
                    min={adData["dateSlot[startDate]"] || getMinDateTime()}
                    className="border rounded w-full py-2 px-3 bg-[#FAFAFA]"
                  />
                </div>
              </div>
              {/* Premium Toggle */}
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="premium"
                  name="premium"
                  checked={adData.premium || false}
                  onChange={handlePremiumChange}
                  className="mr-2"
                />
                <label htmlFor="premium" className="text-gray-600">
                  Premium (Add Rs.50)
                </label>
              </div>
            </>
          )}
          {step === 2 && (
            <>
              {/* Audience Selection */}
              <div className="mb-2">
                <label className="text-lg text-gray-600">Target Audience</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {["allUsers", "byState", "byCity", "byCommunity"].map((type) => (
                    <label
                      key={type}
                      className="flex items-center gap-2 border rounded py-3 px-4 border-gray-300 bg-[#FAFAFA] text-gray-700 text-base"
                    >
                      <input
                        type="radio"
                        name="audianceType"
                        value={type}
                        checked={adData.audianceType === type}
                        onChange={handleChange}
                      />
                      {type === "allUsers"
                        ? "All Users"
                        : type === "byState"
                        ? "By State"
                        : type === "byCity"
                        ? "By City"
                        : "By Communities"}
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex flex-wrap gap-4 mb-4">
                {(adData.audianceType === "byState" ||
                  adData.audianceType === "byCity") && (
                  <div className="flex-1">
                    <label className="block text-gray-600 font-semibold text-sm">
                      Select State(s)
                    </label>
                    <StateSelect
                      isMulti
                      countryid={101}
                      onChange={handleStateChange}
                      placeHolder="Select State(s)"
                    />
                  </div>
                )}
                {adData.audianceType === "byCity" && (
                  <div className="flex-1">
                    <label className="block text-gray-600 font-semibold text-sm">
                      Select City(ies)
                    </label>
                    <CitySelect
                      countryid={101}
                      stateid={selectedStates.length > 0 ? selectedStates[0].value : null}
                      onChange={handleCityChange}
                      placeHolder="Select City(ies)"
                      disabled={selectedStates.length === 0}
                    />
                  </div>
                )}
                {adData.audianceType === "byCommunity" && (
                  <div className="flex-1">
                    <label className="block text-gray-600 font-semibold text-sm">
                      Select Communities
                    </label>
                    <Select
                      isMulti
                      name="communities"
                      value={
                        adData.communities && Array.isArray(adData.communities)
                          ? adData.communities.map((communityName) => {
                              const community = communitiesData.find(
                                (c) => c.communityName === communityName
                              );
                              return community
                                ? { value: community.communityName, label: community.communityName }
                                : null;
                            }).filter(Boolean)
                          : []
                      }
                      onChange={(selectedOptions) => {
                        const selectedValues = selectedOptions.map(
                          (option) => option.value
                        );
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
              <div className="flex justify-between mt-6">
                <button
                  onClick={handleBack}
                  disabled={step === 1}
                  className="px-8 py-3 bg-gray-400 text-white rounded-full text-base font-semibold hover:bg-gray-300"
                >
                  Back
                </button>
                {step < 2 ? (
                  <button
                    onClick={handleNext}
                    className="px-8 py-3 bg-[#4A00E0] text-white rounded-full text-base font-semibold hover:bg-gray-400"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    onClick={handleProceedToPay}
                    className="px-8 py-3 bg-gradient text-white rounded-full text-base font-semibold hover:bg-gray-400"
                  >
                    Proceed to Pay
                  </button>
                )}
              </div>
            </>
          )}
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
