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

      <div className="lg:w-4/12 w-full p-4">
        <div>
          <h1 className="md:text-3xl text-xl text-left font-semibold mb-1 text-[#8E2DE2]">
            Manage
          </h1>
          <p className="text-gray-400 leading-4 text-sm mb-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod</p>
        </div>
        {step === 1 && (
          <div>
            <div className="font-medium flex pl-0 py-2 bg-white rounded-md px-3 cursor-pointer hover:bg-[#8E2DE230] hover:pl-3 transition-all">
              <DashboardIcon style={{ fontSize: "24px", fill: "#8E2DE2" }} />
              <h2 className="text-lg font-normal ml-3"> Dashboard</h2>
            </div>

            <div className="font-medium flex pl-0 py-2 bg-white rounded-md px-3 mt-3 cursor-pointer hover:bg-[#8E2DE230] hover:pl-3 transition-all">
              <InsightsIcon style={{ fontSize: "24px", fill: "#8E2DE2" }} />
              <h2 className="text-lg font-normal ml-3">View Insights</h2>
            </div>
            <Link to="/dashboard/page/adCenter" className="  cursor-pointer transition-all w-full">
              <div className="font-medium flex pl-0 py-2 bg-white rounded-md px-3 mt-3 cursor-pointer hover:bg-[#8E2DE230] hover:pl-3 ">
                <AdsClickIcon style={{ fontSize: "24px", fill: "#8E2DE2" }} />
                <h2 className="text-lg font-normal ml-3">Ad Center</h2>
              </div>
            </Link>
            <Link to="/dashboard/page/create" className="  cursor-pointer transition-all w-full">
              <div className="font-medium flex pl-0 py-2 bg-white rounded-md px-3 mt-3 cursor-pointer hover:bg-[#8E2DE230] hover:pl-3 transition-all">
                <PostAddIcon style={{ fontSize: "24px", fill: "#8E2DE2" }} />
                <h2 className="text-lg font-normal ml-3">Create New Post</h2>
              </div>
            </Link>
            <div className="font-medium flex pl-0 py-2 bg-white rounded-md px-3 mt-3 cursor-pointer hover:bg-[#8E2DE230] hover:pl-3 transition-all">
              <RocketIcon style={{ fontSize: "24px", fill: "#8E2DE2" }} />
              <h2 className="text-lg font-normal ml-3">Boost Page</h2>
            </div>
            <div className="font-medium flex pl-0 py-2 bg-white rounded-md px-3 mt-3 cursor-pointer hover:bg-[#8E2DE230] hover:pl-3 transition-all">
              <SettingsIcon style={{ fontSize: "24px", fill: "#8E2DE2" }} />
              <h2 className="text-lg font-normal ml-3">Settings</h2>
            </div>
          </div>
        )}


      </div>
      <div className="w-8/12 hidden lg:block">
        <PagePreview />
      </div>
    </div>
  );
};

export default ViewPage;
