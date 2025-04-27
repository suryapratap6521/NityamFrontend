
import React from "react";
import { useSelector } from "react-redux";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import LanguageIcon from "@mui/icons-material/Language";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import Slider from "react-slick";

// Ensure slick styles are imported
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const AdPreview = () => {
  const pageData = useSelector((state) => state.page.pageData || {});
  const adData = useSelector((state) => state.ad.adData || {});
  console.log(adData)
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true, // Enable navigation arrows
    autoplay: false,
    autoplaySpeed: 3000,
  };

  return (
    <div className="container bg-[#fafafa] border border-gray-300 items-start  rounded-md flex flex-column mx-auto p-6">
      {/* <div className="flex w-full">
        <div className="border-white rounded-full bg-white">
          {pageData.profilePic ? (
            <img
              src={pageData.profilePic}
              alt="Profile"
              className="w-[50px] h-[50px] rounded-full object-cover border-4 border-white"
            />
          ) : pageData.businessProfilePicture ? (
            <img
              src={pageData.businessProfilePicture}
              alt="Profile"
              className="w-[50px] h-[50px] rounded-full object-cover border-4 border-white"
            />
          ) : (
            <AccountCircleIcon style={{ fontSize: "50px", fill: "#949494" }} />
          )}

        </div>
        <div className="ml-2">
          <h3 className="text-lg">{pageData.businessName || "Page Name"}</h3>
          <div className="flex items-center gap-1">
            <LanguageIcon style={{ fontSize: "16px", fill: "#797979" }} />
            <p className="text-sm text-[#5a5a5a] w-fit">
              Sponsered
            </p>
          </div>
        </div>
      </div> */}
      <div className="mt-5 w-full max-w-64">
        {adData.images && adData.images.length > 1 && (
          <div className="mt-2">
            <Slider {...settings} className="w-[100%] mx-auto">
              {adData.images.map((img, index) => (
                <div key={index} className="flex justify-center">
                  <img
                    src={img.url}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-[250px] object-cover rounded" // Adjust the image styling
                  />
                </div>
              ))}
            </Slider>
          </div>
        )}

        {adData.images && adData.images.length == 1 && (
          <div className="mt-2">
            {adData.images.map((img, index) => (
              <div key={index} className="flex justify-center">
                <img
                  src={img.url}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-56 rounded-md object-cover " // Adjust the image styling
                />
              </div>
            ))}
          </div>
        )}

        {!adData.images && (
          <div className="mt-2 w-full h-56 rounded-md bg-gray-300 flex justify-center items-center">
            <p className="text-2xl mt-2 text-[#5a5a5a] w-fit">
              Ad Banner
            </p>
          </div>
        )}

      </div>
      <p className={`text-xl font-normal text-[${adData.title == '' ? '#5a5a5a' : '#000000'}] w-fit mt-3`}>
        {adData.title || "Your Ad title..."}
      </p>
      <p className={`text-sm font-normal text-gray-400 w-fit my-2`}>
        {adData.description || "Description..."}
      </p>

      <button className="w-fit mt-2 p-2 text-[#4A00E0] text-sm px-8 rounded-md bg-[#4A00E020]">
        {adData.type || "Button Label"}
      </button>
    </div>
  );
};

export default AdPreview;
