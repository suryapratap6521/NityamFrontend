import React from 'react'
import Services from "../Components/Core/Services/Services";
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Sidebar from '../Components/Core/Dashboard/Sidebar';
const ServicePage = () => {
    const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <div className="flex h-screen">
     <Sidebar />
      <div className="flex-1 overflow-y-auto p-4">
        <Services/>
      </div>
      {!isSmallScreen && (
        <div className="w-64 bg-white p-4 shadow-lg hidden md:block">
          <h2 className="text-xl font-bold mb-4">Advertisements</h2>
          {/* Ads*/}
        </div>
      )}
    </div>
  )
}

export default ServicePage


