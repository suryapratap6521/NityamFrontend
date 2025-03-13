import React from "react";
import { useSelector } from "react-redux";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import LanguageIcon from "@mui/icons-material/Language";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import MyLocationIcon from '@mui/icons-material/MyLocation';

const PagePreview = () => {
  const pageData = useSelector((state) => state.page.pageData || {});

  return (
    <div className="container bg-[#fafafa] border border-gray-300 items-start rounded-lg flex flex-column mx-auto p-6">
      <div className="relative w-full">
        <div
          className="w-full h-[180px] rounded-xl bg-gradient"

        ></div>
        <div className="absolute border-white rounded-full bg-white top-[60px] left-6">
          {pageData.profilePic ? (
            <img
              src={pageData.profilePic}
              alt="Profile"
              className="w-[150px] h-[150px] rounded-full object-cover border-6 border-white"
            />
          ) : pageData.businessProfilePicture ? (
            <img
              src={pageData.businessProfilePicture}
              alt="Profile"
              className="w-[150px] h-[150px] rounded-full object-cover border-6 border-white"
            />
          ) : (
            <AccountCircleIcon style={{ fontSize: "150px", fill: "#949494" }} />
          )}

        </div>
      </div>
      <div className="mt-[54px] w-full p-6 pt-0">
        <div className="flex items-center gap-3">
          <h3 className="text-3xl">{pageData.businessName || "Business Name"}</h3>
          <h6 className="text-xs mt-1 bg-[#4A00E0] text-[#fff] w-fit px-4 py-1 rounded-lg text-center">
            {pageData.businessCategory || "Business Type"}
          </h6>
        </div>
        <p className="text-sm mt-2 text-[#5a5a5a] w-fit pb-3 border-b border-[#dedede] ">
          {pageData.businessDescription || "Your Business Bio..."}
        </p>
        <div className="flex gap-2">
          <div className="w-5/12">
            <div className="flex items-center gap-2 mt-4 w-full">
              <LanguageIcon style={{ fontSize: "24px", fill: "#4A00E0" }} />
              <p className="text-xl font-medium text-black w-fit">
                {pageData.businessUrl || "Website URL"}
              </p>
            </div>
            <div className="flex items-center gap-2 mt-4 w-full">
              <LocalPhoneIcon style={{ fontSize: "24px", fill: "#4A00E0" }} />
              <p className="text-xl font-medium text-black w-fit">
                {pageData.businessPhoneNumber || "Phone Number"}
              </p>
            </div>
          </div>
          <div className="w-6/12">
            <div className="flex items-center gap-2 mt-4 w-full">
              <AlternateEmailIcon style={{ fontSize: "24px", fill: "#4A00E0" }} />
              <p className="text-xl font-medium text-black w-fit">
                {pageData.businessEmail || "Email Address"}
              </p>
            </div>
            <div className="flex items-center gap-2 mt-4 w-full">
              <MyLocationIcon style={{ fontSize: "24px", fill: "#4A00E0" }} />
              <p className="text-xl font-medium text-black w-fit">
                {pageData.businessAddress || "Your Business Address..."} {pageData.businessCity
                  ? `${pageData.businessCity}, ${pageData.businessPostCode || ""}`
                  : ""}
              </p>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PagePreview;
