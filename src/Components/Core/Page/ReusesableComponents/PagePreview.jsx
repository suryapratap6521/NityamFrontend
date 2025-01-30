import React from "react";
import { useSelector } from "react-redux";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import LanguageIcon from "@mui/icons-material/Language";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";

const PagePreview = () => {
  const pageData = useSelector((state) => state.page.pageData || {});

  return (
    <div className="container bg-white items-start border-t-0 flex flex-column mx-auto p-6">
      <div className="relative w-full">
        <div
          className="w-full h-[180px] rounded-xl"
          style={{
            background:
              "linear-gradient(90deg, rgb(249, 237, 37) 0%, rgb(30, 141, 68) 100%)",
          }}
        ></div>
        <div className="absolute border-white rounded-full bg-white bottom-[-50px] left-6">
          {pageData.profilePic ? (
            <img
              src={pageData.profilePic}
              alt="Profile"
              className="w-[150px] h-[150px] rounded-full object-cover border-4 border-white"
            />
          ) : pageData.businessProfilePicture ? (
            <img
              src={pageData.businessProfilePicture}
              alt="Profile"
              className="w-[150px] h-[150px] rounded-full object-cover border-4 border-white"
            />
          ) : (
            <AccountCircleIcon style={{ fontSize: "150px", fill: "#949494" }} />
          )}

        </div>
      </div>
      <div className="mt-[54px] w-full">
        <h3 className="text-2xl">{pageData.businessName || "Business Name"}</h3>
        <h6 className="text-xs mt-1 bg-[#2dd56a5e] text-[#1a8e44] w-fit px-4 py-1 rounded-lg text-center">
          {pageData.businessCategory || "Business Type"}
        </h6>
        <p className="text-sm mt-2 text-[#5a5a5a] w-fit">
          {pageData.businessDescription || "Your Business Bio..."}
        </p>
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-[#dedede] w-full">
          <LanguageIcon style={{ fontSize: "24px", fill: "#797979" }} />
          <p className="text-base text-black w-fit">
            {pageData.businessUrl || "Website URL"}
          </p>
        </div>
        <div className="flex items-center gap-2 mt-4 w-full">
          <LocalPhoneIcon style={{ fontSize: "24px", fill: "#797979" }} />
          <p className="text-base text-black w-fit">
            {pageData.businessPhoneNumber || "Phone Number"}
          </p>
        </div>
        <div className="flex items-center gap-2 mt-4 w-full">
          <AlternateEmailIcon style={{ fontSize: "24px", fill: "#797979" }} />
          <p className="text-base text-black w-fit">
            {pageData.businessEmail || "Email Address"}
          </p>
        </div>
        <div className="flex gap-1 flex-col mt-4 pt-3 border-t border-[#dedede] w-full">
          <p className="text-sm text-[#5a5a5a] w-fit">Address</p>
          <p className="text-sm text-black w-fit">
            {pageData.businessAddress || "Your Business Address..."}
          </p>
          <p className="text-sm text-black w-fit">
            {pageData.businessCity
              ? `${pageData.businessCity}, ${pageData.businessPostCode || ""}`
              : ""}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PagePreview;
