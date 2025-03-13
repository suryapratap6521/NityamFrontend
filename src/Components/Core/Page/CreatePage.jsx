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
      <div className="lg:w-2/5 w-full p-4">
        <div>
          <h1 className="md:text-3xl text-xl text-left font-semibold mb-1 text-[#8E2DE2]">
            Create New Page
          </h1>
          <p className="text-gray-400 leading-4 text-sm mb-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod</p>
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
                />
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
              </div>
            </form>
          </div>
        )}

        <div className="flex justify-between mt-6">
          <button
            onClick={handleBack}
            disabled={step === 1}
            className="px-8 py-3 bg-gray-400 text-base font-semibold text-white rounded-full hover:bg-gray-300"
          >
            Back
          </button>
          {step < 3 ? (
            <button
              onClick={handleNext}
              className="px-8 py-3 bg-[#4A00E0] text-base font-semibold text-white rounded-full hover:bg-gray-400"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
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
