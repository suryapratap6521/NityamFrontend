import React from 'react';
import { useSelector } from 'react-redux';
import Loader from '../Components/Common/Loader';
import Sidebar from '../Components/Core/Dashboard/Sidebar';
import Posts from '../Components/Core/Post/Posts';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const Dashboard = () => {
  const { loading: profileLoading } = useSelector((state) => state.auth);
  const { loading: authLoading } = useSelector((state) => state.profile);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  if (profileLoading || authLoading) {
    return <Loader />;
  }

  return (
    <div className="flex h-screen md:mb-0 mb-14">
      <Sidebar/>
      <div className="flex-1 overflow-y-auto p-4">
        <Posts />
      </div>
      {!isSmallScreen && (
        <div className="w-96 bg-white p-4 shadow-lg hidden md:block">
          <h2 className="text-xl font-bold mb-4">Advertisements</h2>
          {/* Ads*/}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
