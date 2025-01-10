import React, { useState,useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPageData } from "../../../slices/pageSlice";
import PagePreview from "./PagePreview";
import { createPage } from "../../../services/operations/pageApi";

const PageAd = () => {
  const [step, setStep] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();
  const pageData = useSelector((state) => state.page.pageData || {});
  const token = useSelector((state) => state.auth.token);

  const businessTypes = [
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
  ];

  const filteredBusinessTypes = businessTypes.filter((type) =>
    type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  useEffect(() => {
    console.log(pageData)
}, []);

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(setPageData({ ...pageData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("businessName", pageData.businessName);
      formData.append("businessCategory", pageData.businessType);
      formData.append("businessDescription", pageData.businessBio);
      formData.append("businessUrl", pageData.website);
      formData.append("businessPhoneNumber", pageData.phoneNumber);
      formData.append("businessEmail", pageData.emailAddress);
      formData.append("businessAddress", pageData.address);
      formData.append("businessCity", pageData.city);
      formData.append("businessPostCode", pageData.postCode);
      formData.append(
        "businessProfilePicture",
        pageData.businessProfilePicture
      );

      const response = await createPage(formData, token);
      alert("Business page created successfully!");
      console.log("Response:", response);
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

  return (
    <div className="container items-start border-t-0 flex flex-row mx-auto p-6">
      <div className="w-3/5">
        <PagePreview />
      </div>
      <div className="w-2/5 p-4">
        <h1 className="text-xl text-left font-bold mb-4">
          Create Business Page
        </h1>
        {step === 1 && (
          <div>
            <h2 className="text-lg font-semibold">Business Details</h2>
            <form>
              <div className="mb-4">
                <label htmlFor="businessName" className="block font-medium">
                  Business Name
                </label>
                <input
                  type="text"
                  id="businessName"
                  name="businessName"
                  value={pageData.businessName || ""}
                  onChange={handleChange}
                  className="border rounded w-full p-2"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="profilePic" className="block font-medium">
                  Profile Picture
                </label>
                <input
                  type="file"
                  id="profilePic"
                  accept="image/*"
                  onChange={handleProfilePicChange}
                  className="border rounded w-full p-2"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="businessType" className="block font-medium">
                  Business Type
                </label>
                <select
                  id="businessType"
                  name="businessType"
                  value={pageData.businessType || ""}
                  onChange={handleChange}
                  className="border rounded w-full p-2"
                >
                  <option value="">Select Business Type</option>
                  {filteredBusinessTypes.map((type, index) => (
                    <option key={index} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="businessBio" className="block font-medium">
                  Business Bio
                </label>
                <textarea
                  id="businessBio"
                  name="businessBio"
                  value={pageData.businessBio || ""}
                  onChange={handleChange}
                  className="border rounded w-full p-2"
                />
              </div>
            </form>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-lg font-semibold">Contact Information</h2>
            <form>
              <div className="mb-4">
                <label htmlFor="website" className="block font-medium">
                  Website
                </label>
                <input
                  type="text"
                  id="website"
                  name="website"
                  value={pageData.website || ""}
                  onChange={handleChange}
                  className="border rounded w-full p-2"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="phoneNumber" className="block font-medium">
                  Phone Number
                </label>
                <input
                  type="text"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={pageData.phoneNumber || ""}
                  onChange={handleChange}
                  className="border rounded w-full p-2"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="emailAddress" className="block font-medium">
                  Email Address
                </label>
                <input
                  type="email"
                  id="emailAddress"
                  name="emailAddress"
                  value={pageData.emailAddress || ""}
                  onChange={handleChange}
                  className="border rounded w-full p-2"
                />
              </div>
            </form>
          </div>
        )}
        {step === 3 && (
          <div>
            <h2 className="text-lg font-semibold">Address Information</h2>
            <form>
              <div className="mb-4">
                <label htmlFor="address" className="block font-medium">
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={pageData.address || ""}
                  onChange={handleChange}
                  className="border rounded w-full p-2"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="city" className="block font-medium">
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={pageData.city || ""}
                  onChange={handleChange}
                  className="border rounded w-full p-2"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="postCode" className="block font-medium">
                  Postal Code
                </label>
                <input
                  type="email"
                  id="postCode"
                  name="postCode"
                  value={pageData.postCode || ""}
                  onChange={handleChange}
                  className="border rounded w-full p-2"
                />
              </div>
            </form>
          </div>
        )}

        <div className="flex justify-between mt-6">
          <button
            onClick={handleBack}
            disabled={step === 1}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Back
          </button>
          {step < 3 ? (
            <button
              onClick={handleNext}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-green-500 text-white rounded"
            >
              Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageAd;
