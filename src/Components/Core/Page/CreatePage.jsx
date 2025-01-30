import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPageData } from "../../../slices/pageSlice";
import PagePreview from "./ReusesableComponents/PagePreview";
import { createPage } from "../../../services/operations/pageApi";

const CreatePage = () => {
  const [step, setStep] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();
  const pageData = useSelector((state) => state.page.pageData || {});
  const token = useSelector((state) => state.auth.token);
  const [loading, setLoading] = useState(false);

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
  ];

  const filteredbusinessCategorys = businessCategorys.filter((type) =>
    type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

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
      formData.append("businessCategory", pageData.businessCategory);
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
      // console.log("Response:", response);
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
                <label htmlFor="businessCategory" className="block font-medium">
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
              </div>
              <div className="mb-4">
                <label htmlFor="businessDescription" className="block font-medium">
                  Business Bio
                </label>
                <textarea
                  id="businessDescription"
                  name="businessDescription"
                  value={pageData.businessDescription || ""}
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
                <label htmlFor="businessUrl" className="block font-medium">
                  businessUrl
                </label>
                <input
                  type="text"
                  id="businessUrl"
                  name="businessUrl"
                  value={pageData.businessUrl || ""}
                  onChange={handleChange}
                  className="border rounded w-full p-2"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="businessPhoneNumber" className="block font-medium">
                  Phone Number
                </label>
                <input
                  type="text"
                  id="businessPhoneNumber"
                  name="businessPhoneNumber"
                  value={pageData.businessPhoneNumber || ""}
                  onChange={handleChange}
                  className="border rounded w-full p-2"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="businessEmail" className="block font-medium">
                  Email Address
                </label>
                <input
                  type="email"
                  id="businessEmail"
                  name="businessEmail"
                  value={pageData.businessEmail || ""}
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
                <label htmlFor="businessAddress" className="block font-medium">
                  Address
                </label>
                <input
                  type="text"
                  id="businessAddress"
                  name="businessAddress"
                  value={pageData.businessAddress || ""}
                  onChange={handleChange}
                  className="border rounded w-full p-2"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="businessCity" className="block font-medium">
                  City
                </label>
                <input
                  type="text"
                  id="businessCity"
                  name="businessCity"
                  value={pageData.businessCity || ""}
                  onChange={handleChange}
                  className="border rounded w-full p-2"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="businessPostCode" className="block font-medium">
                  Postal Code
                </label>
                <input
                  type="email"
                  id="businessPostCode"
                  name="businessPostCode"
                  value={pageData.businessPostCode || ""}
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

export default CreatePage;
