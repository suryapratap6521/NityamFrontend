import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPageData } from "../../../slices/pageSlice";
import PagePreview from "./ReusesableComponents/PagePreview";
import { createPage, fetchPageDetails } from "../../../services/operations/pageApi";
import DashboardIcon from '@mui/icons-material/Dashboard';
import InsightsIcon from '@mui/icons-material/Insights';
import AdsClickIcon from '@mui/icons-material/AdsClick';
import PostAddIcon from '@mui/icons-material/PostAdd';
import RocketIcon from '@mui/icons-material/Rocket';
import SettingsIcon from '@mui/icons-material/Settings';
import { Link } from 'react-router-dom';
const ViewPage = () => {
  const [step, setStep] = useState(1);
  const [id, setId] = useState("678611ced44199055cb22c60");
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();
  const pageData = useSelector((state) => state.page.pageData || {});
  const token = useSelector((state) => state.auth.token);
  const { user } = useSelector((state) => state.profile);

  //console.log("678611ced44199055cb22c60");
  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchPageDetails(id, token, dispatch);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [token, dispatch]);
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

  const getPageData = async (e) => {
    try {

      const response = await fetchPageDetails(id, token);
      console.log("Response:", response);
    } catch (error) {
      console.error("Error:", error);
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

      <div className="w-4/12 p-4">
        <h1 className="text-2xl text-left font-bold mb-4">
          Manage
        </h1>
        {step === 1 && (
          <div>
            <div className="font-medium flex border border-gray-300 py-4 bg-white rounded-md px-3 cursor-pointer">
              <DashboardIcon style={{ fontSize: "24px", fill: "#1a8e44" }} />
              <h2 className="text-lg font-semibold ml-3">Professional Dashboard</h2>
            </div>

            <div className="font-medium flex border border-gray-300 py-4 bg-white rounded-md px-3 mt-3 cursor-pointer">
              <InsightsIcon style={{ fontSize: "24px", fill: "#1a8e44" }} />
              <h2 className="text-lg font-semibold ml-3">View Insights</h2>
            </div>
            <Link to="/dashboard/page/adCenter" className=" hover:bg-gray-200 cursor-pointer transition-all duration-300 w-full">
              <div className="font-medium flex border border-gray-300 py-4 bg-white rounded-md px-3 mt-3 cursor-pointer">
                <AdsClickIcon style={{ fontSize: "24px", fill: "#1a8e44" }} />
                <h2 className="text-lg font-semibold ml-3">Ad Center</h2>
              </div>
            </Link>
            <div className="font-medium flex border border-gray-300 py-4 bg-white rounded-md px-3 mt-3 cursor-pointer">
              <PostAddIcon style={{ fontSize: "24px", fill: "#1a8e44" }} />
              <h2 className="text-lg font-semibold ml-3">Create New Post</h2>
            </div>
            <div className="font-medium flex border border-gray-300 py-4 bg-white rounded-md px-3 mt-3 cursor-pointer">
              <RocketIcon style={{ fontSize: "24px", fill: "#1a8e44" }} />
              <h2 className="text-lg font-semibold ml-3">Boost Page</h2>
            </div>
            <div className="font-medium flex border border-gray-300 py-4 bg-white rounded-md px-3 mt-3 cursor-pointer">
              <SettingsIcon style={{ fontSize: "24px", fill: "#1a8e44" }} />
              <h2 className="text-lg font-semibold ml-3">Settings</h2>
            </div>
          </div>
        )}


      </div>
      <div className="w-8/12">
        <PagePreview />
      </div>
    </div>
  );
};

export default ViewPage;
