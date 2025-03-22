import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Avatar } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faChartBar, faCalendarAlt } from "@fortawesome/free-solid-svg-icons";

export default function CreatePostSection() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.profile);

  // Single function for navigation
  const handleNavigate = () => {
    // Entire container is clickable, so any click leads to /dashboard/createpost
    navigate("/dashboard/createpost");
  };

  return (
    // Entire container is clickable
    <div
      className="bg-white p-4 rounded-lg shadow mb-4 cursor-pointer hover:bg-gray-50 transition-colors"
      onClick={handleNavigate}
    >
      {/* Top Row: Avatar + "Start a post" prompt */}
      <div className="flex items-center">
        <Avatar
          src={user?.image}
          alt="User Avatar"
          sx={{ width: 48, height: 48 }}
          className="mr-3"
        />
        <div className="flex-1 border border-gray-300 rounded-full px-3 py-2">
          <span className="text-gray-500">Start a post</span>
        </div>
      </div>

      {/* Bottom Row: Photo / Poll / Event */}
      <div className="mt-3 flex justify-around">
        <div className="flex items-center gap-2 text-gray-500">
          <FontAwesomeIcon icon={faCamera} className="text-purple-500" />
          <span>Photo</span>
        </div>
        <div className="flex items-center gap-2 text-gray-500">
          <FontAwesomeIcon icon={faChartBar} className="text-green-500" />
          <span>Poll</span>
        </div>
        <div className="flex items-center gap-2 text-gray-500">
          <FontAwesomeIcon icon={faCalendarAlt} className="text-blue-500" />
          <span>Event</span>
        </div>
      </div>
    </div>
  );
}
