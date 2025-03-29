
import React from 'react'
import CreateService from "../Components/Core/Services/CreateService";
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Sidebar from '../Components/Core/Dashboard/Sidebar';
const ServicePage = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <div className="flex h-screen">
      {/* <Sidebar /> */}
      <div className="flex-1 overflow-y-auto p-4">
        <CreateService />
      </div>

    </div>
  )
}

export default ServicePage


