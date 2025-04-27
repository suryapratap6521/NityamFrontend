import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Typography } from "@mui/material";
import { faPersonCirclePlus } from "@fortawesome/free-solid-svg-icons";

const AddServiceCard = ({ onClick }) => {
  return (
    <div 
      onClick={onClick} 
      className="flex flex-col items-center justify-center bg-white shadow-lg rounded-lg overflow-hidden p-6 transition-transform transform hover:scale-105 cursor-pointer"
    >
      <div className="flex items-center justify-center w-30 h-20 bg-blue-100 rounded-full mb-4">
        <FontAwesomeIcon icon={faPersonCirclePlus} className="text-blue-500 text-5xl" />
      </div>
      <Typography variant="h5" className="font-semibold text-gray-800">
        Add Service
      </Typography>
    </div>
  );
};

export default AddServiceCard;
