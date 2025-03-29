import React from 'react'
import Services from "../Components/Core/Services/Services";
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import AddIcon from '@mui/icons-material/Add';
import { Link } from 'react-router-dom';
import Advertisements from '../Components/Core/Dashboard/Advertisement'

const ServicePage = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <div className="md:mb-0 mb-14 bg-white flex justify-around w-full">

      <div className="w-full md:w-9/12 md:py-4 md:px-16 md:pl-24 p-4 md:mt-0 mt-2 max-h-[86vh] no-scrollbar overflow-scroll">
        <div className="w-full mb-4 flex md:flex-row flex-col justify-between md:items-end">
          <div>
            <h1 className="md:text-3xl text-xl text-left font-semibold mb-1 text-[#8E2DE2]">
              Services
            </h1>
            <p className="text-gray-400 leading-4 text-sm">
              Explore a range of professional services designed to meet your needs. </p></div>
          <Link to="/dashboard/addservice"

            className="flex justify-center items-center hover:bg-gray-200 p-2 px-6 rounded-lg cursor-pointer transition-all duration-300 bg-[#8E2DE220] w-fit mt-1 md:mt-0">
            <div className="flex justify-center items-center">

              <h3 className="md:text-base text-sm font-medium text-center text-[#8E2DE2] ">Add New Service</h3>
              <AddIcon style={{ fontSize: "24px", fill: "#8E2DE2" }} />

            </div>
          </Link>
        </div>

        <Services />
      </div>
      {!isSmallScreen && (
        <div className="w-3/12 bg-white p-4 hidden md:block">
          <Advertisements />
        </div>
      )}
    </div>
  )
}

export default ServicePage