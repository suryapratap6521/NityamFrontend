import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPageData } from "../../../slices/pageSlice";
import PagePreview from "./ReusesableComponents/PagePreview";
import { createPage } from "../../../services/operations/pageApi";
import { useNavigate } from 'react-router-dom';

const CreatePage = () => {
  const [step, setStep] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();
  const pageData = useSelector((state) => state.page.pageData || {});
  const token = useSelector((state) => state.auth.token);
  const [loading, setLoading] = useState(false);
  const [errorList, setErrorList] = useState({})
  const navigate = useNavigate();

  const businessCategorys = [
    "Retail & E-commerce",
    "Clothing & Accessories",
    "Electronics",
    "Grocery Stores",
    "Jewelry & Watches",
    "Furniture Stores",
    "Books & Stationery",
    "Beauty & Cosmetics",
    "Sports Equipment",
    "Pet Supplies",
    "Toy Stores",
    "Kitchenware",
    "Outdoor Gear",
    "Footwear Stores",
    "Home Appliances",
    "Gifts & Souvenirs",
    "Eyewear Shops",
    "Organic Products",
    "Baby Products",
    "Medical Supplies",
    "Automotive Parts",
    "Craft Supplies",
    "Thrift Stores",
    "Custom Merchandise",
    "Antiques & Collectibles",
    "Gardening Supplies",
    "Art Supplies",
    "Luxury Goods",
    "Mobile Phones & Accessories",
    "Health Supplements",
    "Musical Instruments",
    "Tech Gadgets",
    "Luggage & Travel Gear",
    "Lighting & Fixtures",
    "Party Supplies",
    "Stationery Artifacts",
    "DIY Craft Stores",
    "Discount Outlets",
    "Flagship Stores",
    "Seasonal Shops",
    "Others"
  ];

  const filteredbusinessCategorys = businessCategorys.filter((type) =>
    type.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const handleChange = (e) => {
    const { name, value } = e.target;
    setErrorList((prev) => ({ ...prev, [name]: "" }));
    dispatch(setPageData({ ...pageData, [name]: value }));
  };

  const handleSubmit = async () => {

    try {
      const formData = new FormData();
      formData.append("pageId", pageData._id);
      formData.append("businessName", pageData.businessName);
      if (pageData.businessCategory == 'Others') {
        formData.append("businessCategory", pageData.otherBusinessCategory);
      } else {
        formData.append("businessCategory", pageData.businessCategory);
      }
      formData.append("businessDescription", pageData.businessDescription);
      formData.append("businessUrl", pageData.businessUrl);
      formData.append("businessPhoneNumber", pageData.businessPhoneNumber);
      formData.append("businessEmail", pageData.businessEmail);
      formData.append("businessAddress", pageData.businessAddress);
      formData.append("businessCity", pageData.businessCity);
      formData.append("businessPostCode", pageData.businessPostCode);
      formData.append(
        "businessProfilePicture",
        pageData.businessProfilePicture
      );

      const response = await createPage(formData, dispatch, token);
      // alert("Business page created successfully!");
      if (response.data.success == true) {
        navigate('/dashboard/page');
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to create business page. Please try again.");
    }
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        dispatch(
          setPageData({
            ...pageData,
            profilePic: reader.result,
            businessProfilePicture: file,
          })
        );
      };
      reader.readAsDataURL(file);
    }
  };


  const handleNext = (type) => {
    let isValid = true;
    console.log(pageData)
    if (type == 1) {
      console.log()
      if (step == 1) {
        if (pageData.businessName == "" || pageData.businessName == undefined) {
          setErrorList((prev) => ({ ...prev, businessName: "Please Enter Business name" }));
          isValid = false;
        } else {
          setErrorList((prev) => ({ ...prev, businessName: "" }));
        }

        if (pageData.businessProfilePicture == undefined) {
          setErrorList((prev) => ({ ...prev, businessProfilePicture: "Please Enter Business Profile Pic" }));
          isValid = false;
        } else {
          setErrorList((prev) => ({ ...prev, businessProfilePicture: "" }));
        }

        if (pageData.businessCategory == "" || pageData.businessCategory == undefined) {
          setErrorList((prev) => ({ ...prev, businessCategory: "Please Enter  Business Category" }));
          isValid = false;
        } else if (pageData.businessCategory == "Others" && (pageData.otherBusinessCategory == '' || pageData.otherBusinessCategory == undefined)) {
          setErrorList((prev) => ({ ...prev, businessCategory: "Please Enter Other Business Category" }));
          isValid = false;
        } else {
          setErrorList((prev) => ({ ...prev, businessCategory: "" }));
        }

        if (pageData.businessDescription == "" || pageData.businessDescription == undefined) {
          setErrorList((prev) => ({ ...prev, businessDescription: "Please Enter  Business Description" }));
          isValid = false;
        } else {
          setErrorList((prev) => ({ ...prev, businessDescription: "" }));
        }
      }

      if (step == 2) {
        const urlRegex = /^(https?:\/\/)?([a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+)(\/[^\s]*)?$/;
        const phoneRegex = /^[+]?[0-9\s-]{7,15}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (pageData.businessUrl == "" || pageData.businessUrl == undefined) {
          setErrorList((prev) => ({ ...prev, businessUrl: "Please Enter Business Url" }));
          isValid = false;
        } else if (!urlRegex.test(pageData.businessUrl)) {
          setErrorList((prev) => ({ ...prev, businessUrl: "Please enter a valid business URL" }));
          isValid = false;
        } else {
          setErrorList((prev) => ({ ...prev, businessUrl: "" }));
        }

        if (pageData.businessPhoneNumber == "" || pageData.businessPhoneNumber == undefined) {
          setErrorList((prev) => ({ ...prev, businessPhoneNumber: "Please Enter Business Phone Number" }));
          isValid = false;
        } else if (!phoneRegex.test(pageData.businessPhoneNumber)) {
          setErrorList((prev) => ({ ...prev, businessPhoneNumber: "Please enter a valid phone number" }));
          isValid = false;
        } else {
          setErrorList((prev) => ({ ...prev, businessPhoneNumber: "" }));
        }

        if (pageData.businessEmail == "" || pageData.businessEmail == undefined) {
          setErrorList((prev) => ({ ...prev, businessEmail: "Please Enter Business Email Address" }));
          isValid = false;
        } else if (!emailRegex.test(pageData.businessEmail)) {
          setErrorList((prev) => ({ ...prev, businessEmail: "Please enter a valid email address" }));
          isValid = false;
        } else {
          setErrorList((prev) => ({ ...prev, businessEmail: "" }));
        }
      }

      if (step == 3) {
        if (pageData.businessAddress == "" || pageData.businessAddress == undefined) {
          setErrorList((prev) => ({ ...prev, businessAddress: "Please Enter Business Address" }));
          isValid = false;
        } else {
          setErrorList((prev) => ({ ...prev, businessAddress: "" }));
        }

        if (pageData.businessCity == "" || pageData.businessCity == undefined) {
          setErrorList((prev) => ({ ...prev, businessCity: "Please Enter Business City" }));
          isValid = false;
        } else {
          setErrorList((prev) => ({ ...prev, businessCity: "" }));
        }

        if (pageData.businessPostCode == "" || pageData.businessPostCode == undefined) {
          setErrorList((prev) => ({ ...prev, businessPostCode: "Please Enter Business Post Code" }));
          isValid = false;
        } else {
          setErrorList((prev) => ({ ...prev, businessPostCode: "" }));
        }
      }
      if (isValid == true) {
        if (step == 3) {
          handleSubmit()
        } else {
          setStep(step + 1);
        }
      }
    } else if (type == 2) {
      if (step > 1) setStep(step - 1);
    }
  };

  return (
    <div className="container items-start border-t-0 flex flex-row mx-auto p-6">
      <div className="lg:w-2/5 w-full p-4">
        <div>
          <h1 className="md:text-3xl text-xl text-left font-semibold mb-1 text-[#695ea8]">
            Create New Page
          </h1>
          <p className="text-gray-400 leading-4 text-sm mb-4">Create/Edit Details of your page which will help people reach you.</p>
        </div>
        {step === 1 && (
          <div>
            {/* <h2 className="text-lg font-medium text-gray-900">Business Details</h2> */}
            <form>
              <div className="mb-4">
                <label htmlFor="businessName" className="text-base font-semibold text-gray-600">
                  Business Name
                </label>
                <input
                  type="text"
                  id="businessName"
                  name="businessName"
                  placeholder="Please Enter Bussiness Name"
                  value={pageData.businessName || ""}
                  onChange={handleChange}
                  className="border rounded w-full p-2"
                />
                {errorList.businessName && errorList.businessName != '' &&
                  <span className="text-red-600 pl-1">{errorList.businessName}</span>
                }
              </div>
              <div className="mb-4">
                <label htmlFor="profilePic" className="text-base font-semibold text-gray-600">
                  Profile Picture
                </label>
                <input
                  type="file"
                  id="profilePic"
                  accept="image/*"
                  onChange={handleProfilePicChange}
                  className="border rounded w-full p-2"
                />
                {errorList.businessProfilePicture && errorList.businessProfilePicture != '' &&
                  <span className="text-red-600 pl-1">{errorList.businessProfilePicture}</span>
                }
              </div>
              <div className="mb-4">
                <label htmlFor="businessCategory" className="text-base font-semibold text-gray-600">
                  Business Type
                </label>
                <select
                  id="businessCategory"
                  name="businessCategory"
                  value={pageData.businessCategory || ""}
                  onChange={handleChange}
                  className="border rounded w-full p-2"
                >
                  <option value="">Select Business Type</option>
                  {filteredbusinessCategorys.map((type, index) => (
                    <option key={index} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                {pageData.businessCategory == 'Others' &&
                  <input
                    type="text"
                    id="otherBusinessCategory"
                    name="otherBusinessCategory"
                    placeholder="Please Enter Bussiness Category"
                    value={pageData.otherBusinessCategory || ""}
                    onChange={handleChange}
                    className="border rounded w-full p-2 mt-2"
                  />
                }
                {errorList.businessCategory && errorList.businessCategory != '' &&
                  <span className="text-red-600 pl-1">{errorList.businessCategory}</span>
                }
              </div>
              <div className="mb-4">
                <label htmlFor="businessDescription" className="text-base font-semibold text-gray-600">
                  Business Bio
                </label>
                <textarea
                  id="businessDescription"
                  name="businessDescription"
                  placeholder="Please Enter Bussiness Description"
                  value={pageData.businessDescription || ""}
                  onChange={handleChange}
                  className="border rounded w-full p-2"
                />
                {errorList.businessDescription && errorList.businessDescription != '' &&
                  <span className="text-red-600 pl-1">{errorList.businessDescription}</span>
                }
              </div>
            </form>
          </div>
        )}

        {step === 2 && (
          <div>
            {/* <h2 className="text-lg font-medium text-gray-900">Contact Information</h2> */}
            <form>
              <div className="mb-4">
                <label htmlFor="businessUrl" className="text-base font-semibold text-gray-600">
                  Business Url
                </label>
                <input
                  type="text"
                  id="businessUrl"
                  name="businessUrl"
                  value={pageData.businessUrl || ""}
                  onChange={handleChange}
                  className="border rounded w-full p-2"
                />
                {errorList.businessUrl && errorList.businessUrl != '' &&
                  <span className="text-red-600 pl-1">{errorList.businessUrl}</span>
                }
              </div>
              <div className="mb-4">
                <label htmlFor="businessPhoneNumber" className="text-base font-semibold text-gray-600">
                  Phone Number
                </label>
                <input
                  type="text"
                  id="businessPhoneNumber"
                  name="businessPhoneNumber"
                  placeholder="Please Enter Phone Number"
                  value={pageData.businessPhoneNumber || ""}
                  onChange={handleChange}
                  className="border rounded w-full p-2"
                  maxLength={10}
                />
                {errorList.businessPhoneNumber && errorList.businessPhoneNumber != '' &&
                  <span className="text-red-600 pl-1">{errorList.businessPhoneNumber}</span>
                }
              </div>
              <div className="mb-4">
                <label htmlFor="businessEmail" className="text-base font-semibold text-gray-600">
                  Email Address
                </label>
                <input
                  type="email"
                  id="businessEmail"
                  name="businessEmail"
                  placeholder="Please Enter Email"
                  value={pageData.businessEmail || ""}
                  onChange={handleChange}
                  className="border rounded w-full p-2"
                />
                {errorList.businessEmail && errorList.businessEmail != '' &&
                  <span className="text-red-600 pl-1">{errorList.businessEmail}</span>
                }
              </div>
            </form>
          </div>
        )}
        {step === 3 && (
          <div>
            {/* <h2 className="text-lg font-medium text-gray-900">Address Information</h2> */}
            <form>
              <div className="mb-4">
                <label htmlFor="businessAddress" className="text-base font-semibold text-gray-600">
                  Address
                </label>
                <input
                  type="text"
                  id="businessAddress"
                  name="businessAddress"
                  placeholder="Please Enter Bussiness Address"
                  value={pageData.businessAddress || ""}
                  onChange={handleChange}
                  className="border rounded w-full p-2"
                />
                {errorList.businessAddress && errorList.businessAddress != '' &&
                  <span className="text-red-600 pl-1">{errorList.businessAddress}</span>
                }
              </div>
              <div className="mb-4">
                <label htmlFor="businessCity" className="text-base font-semibold text-gray-600">
                  City
                </label>
                <input
                  type="text"
                  id="businessCity"
                  name="businessCity"
                  placeholder="Please Enter Bussiness City"
                  value={pageData.businessCity || ""}
                  onChange={handleChange}
                  className="border rounded w-full p-2"
                />
                {errorList.businessCity && errorList.businessCity != '' &&
                  <span className="text-red-600 pl-1">{errorList.businessCity}</span>
                }
              </div>
              <div className="mb-4">
                <label htmlFor="businessPostCode" className="text-base font-semibold text-gray-600">
                  Postal Code
                </label>
                <input
                  type="email"
                  id="businessPostCode"
                  name="businessPostCode"
                  placeholder="Please Enter Bussiness Postal Code"
                  value={pageData.businessPostCode || ""}
                  onChange={handleChange}
                  className="border rounded w-full p-2"
                />
                {errorList.businessPostCode && errorList.businessPostCode != '' &&
                  <span className="text-red-600 pl-1">{errorList.businessPostCode}</span>
                }
              </div>
            </form>
          </div>
        )}

        <div className="flex justify-between mt-6">
          <button
            onClick={() => handleNext(2)}
            disabled={step === 1}
            className="px-8 py-3 bg-gray-400 text-base font-semibold text-white rounded-full hover:bg-gray-300"
          >
            Back
          </button>
          {step < 3 ? (
            <button
              onClick={() => handleNext(1)}
              className="px-8 py-3 bg-[#695ea8] text-base font-semibold text-white rounded-full hover:bg-gray-400"
            >
              Next
            </button>
          ) : (
            <button
              onClick={() => handleNext(1)}
              className="px-8 py-3 bg-gradient text-base font-semibold text-white rounded-full hover:bg-gray-400"
            >
              Submit
            </button>
          )}
        </div>
      </div>
      <div className="w-3/5 hidden lg:block">
        <PagePreview />
      </div>

    </div>
  );
};

export default CreatePage;
