import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPageData } from "../../../slices/pageSlice";

const Page = () => {
  const [step, setStep] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();
  const pageData = useSelector((state) => state.page.pageData || {});

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

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(setPageData({ ...pageData, [name]: value }));
  };

  const handleSubmit = () => {
    console.log("Submitted Data: ", pageData);
    // Perform submission logic here
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">Create Business Page</h1>

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
              <label htmlFor="businessType" className="block font-medium">
                Business Type
              </label>
              <input
                type="text"
                placeholder="Search Business Type"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border rounded w-full p-2 mb-2"
              />
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

      {/* Location Form */}
      {/* Similar logic for Step 3 */}

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
  );
};

export default Page;
