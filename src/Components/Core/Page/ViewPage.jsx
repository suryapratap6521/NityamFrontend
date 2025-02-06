import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPageData } from "../../../slices/pageSlice";
import PagePreview from "./ReusesableComponents/PagePreview";
import { fetchPageDetails } from "../../../services/operations/pageApi";
import { Link } from "react-router-dom";
import DashboardIcon from '@mui/icons-material/Dashboard';
import InsightsIcon from '@mui/icons-material/Insights';
import AdsClickIcon from '@mui/icons-material/AdsClick';
import PostAddIcon from '@mui/icons-material/PostAdd';
import RocketIcon from '@mui/icons-material/Rocket';
import SettingsIcon from '@mui/icons-material/Settings';

const ViewPage = () => {
  const [step, setStep] = useState(1);
  const pageId = "678611ced44199055cb22c60";  // Assuming this is fixed
  const dispatch = useDispatch();
  const pageData = useSelector((state) => state.page.pageData || {});
  const token = useSelector((state) => state.auth.token);
  const hasFetched = useRef(false);  // Prevent duplicate API calls

  useEffect(() => {
    if (!token || hasFetched.current) return; // Ensure token exists & avoid double calls
    hasFetched.current = true; // Mark as fetched to avoid re-fetching
    fetchPageDetails(pageId, token, dispatch);
  }, [token, dispatch]); // Only dependent on token changes

  const handleNext = () => setStep((prev) => Math.min(prev + 1, 3));
  const handleBack = () => setStep((prev) => Math.max(prev - 1, 1));

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
