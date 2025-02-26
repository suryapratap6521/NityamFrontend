import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faCompass, faPlusCircle, faPeopleCarryBox, faComments, faUsers } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import SideBarPost from '../../Core/Post/SideBarPost'; // Import your post modal

const Sidebar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="md:w-48 w-full md:h-screen h-20 bg-white md:text-gray-900 flex md:flex-col flex-row md:items-start items-center p-4 shadow-lg fixed md:relative bottom-0 md:bottom-auto justify-around md:justify-start z-30">
        
        <Link to="/dashboard" className="flex items-center md:items-start md:mb-10 hover:bg-gray-200 p-2 rounded-lg cursor-pointer transition-all duration-300 w-full">
          <FontAwesomeIcon icon={faHome} className="text-3xl md:text-gray-900 text-gray-500" />
          <span className="text-sm font-semibold mt-1 ml-3 hidden md:inline">Home</span>
        </Link>

        <Link to="/discover" className="flex items-center md:items-start md:mb-10 hover:bg-gray-200 p-2 rounded-lg cursor-pointer transition-all duration-300 w-full">
          <FontAwesomeIcon icon={faCompass} className="text-3xl md:text-gray-900 text-gray-500" />
          <span className="text-sm font-semibold mt-1 ml-3 hidden md:inline">Events</span>
        </Link>

        {/* Open Post Modal instead of navigating */}
        <button 
          onClick={() => setIsModalOpen(true)} 
          className="flex items-center md:items-start md:mb-10 hover:bg-gray-200 p-2 rounded-lg cursor-pointer transition-all duration-300 w-full"
        >
          <FontAwesomeIcon icon={faPlusCircle} className="text-3xl md:text-gray-900 text-gray-500" />
          <span className="text-sm font-semibold mt-1 ml-3 hidden md:inline">Post</span>
        </button>

        <Link to="/dashboard/services" className="flex items-center md:items-start md:mb-10 hover:bg-gray-200 p-2 rounded-lg cursor-pointer transition-all duration-300 w-full">
          <FontAwesomeIcon icon={faPeopleCarryBox} className="text-3xl md:text-gray-900 text-gray-500" />
          <span className="text-sm font-semibold mt-1 ml-3 hidden md:inline">Services</span>
        </Link>

        <Link to="/dashboard/chat" className="flex items-center md:items-start md:mb-10 hover:bg-gray-200 p-2 rounded-lg cursor-pointer transition-all duration-300 w-full">
          <FontAwesomeIcon icon={faComments} className="text-3xl md:text-gray-900 text-gray-500" />
          <span className="text-sm font-semibold mt-1 ml-3 hidden md:inline">Chat</span>
        </Link>

        <Link to="/dashboard/page" className="flex items-center md:items-start md:mb-10 hover:bg-gray-200 p-2 rounded-lg cursor-pointer transition-all duration-300 w-full">
          <FontAwesomeIcon icon={faUsers} className="text-3xl md:text-gray-900 text-gray-500" />
          <span className="text-sm font-semibold mt-1 ml-3 hidden md:inline">Page</span>
        </Link>
      </div>

      {/* Render the Modal if isModalOpen is true */}
      {isModalOpen && <SideBarPost closeModal={() => setIsModalOpen(false)} />}
    </>
  );
}

export default Sidebar;
