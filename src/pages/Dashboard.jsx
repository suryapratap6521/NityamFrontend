import React, { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../Components/Common/Loader';
import CreatePostSection from '../Components/Common/CreatePostSection';
import Posts from '../Components/Core/Post/Posts';
import Advertisements from '../Components/Core/Dashboard/Advertisement';
import { getServices } from '../services/operations/serviceApi';
import { fetchEventsByUser } from '../services/operations/eventApi';
import { Link } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { token } = useSelector(state => state.auth);
  const { loading: profileLoading } = useSelector(state => state.auth);
  const { loading: authLoading } = useSelector(state => state.profile);
  const { user } = useSelector(state => state.profile);
  // serviceData and eventData are assumed to be stored in Redux slices
  const serviceData = useSelector(state => state.service.serviceData || {});
  const eventData = useSelector(state => state.event.userEvent || []);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if (!profileLoading && !authLoading) {
      // Fetch services and events only when user/profile data is ready
      getServices(token, dispatch);
      fetchEventsByUser(token, dispatch);
    }
  }, [token, dispatch, profileLoading, authLoading]);

  if (profileLoading || authLoading) {
    return <Loader />;
  }

  return (
    <div className="bg-white">
      <div className="w-full flex justify-between">
        {/* Left Sidebar: Services & Events Previews */}
        {!isSmallScreen && (
          <div className="w-3/12 bg-white p-4 hidden lg:flex flex-col items-center">
            {/* SERVICES PREVIEW */}
            <div className="bg-[#fafafa] w-full px-4 py-4 rounded-lg border-2 border-gray-200 max-w-[350px]">
              <div className="flex w-full items-center justify-between">
                <h1 className='text-lg font-semibold text-gray-600'>Services</h1>
                <Link to="/dashboard/services">
                  <span className="text-sm font-normal text-[#4A00E0]">View All</span>
                </Link>
              </div>
              {serviceData &&
                serviceData.allUsers &&
                serviceData.allUsers.slice(0, 5).map(users => (
                  users?.communityDetails?._id === user?.communityDetails?._id && (
                    <Link 
                      key={users._id} 
                      to={{
                        pathname: "/dashboard/service/view",
                        state: { highlightServiceId: users._id }
                      }}
                    >
                      <div className="w-full mt-4 flex items-center justify-between gap-2">
                        <div className="w-9 h-9">
                          <img className='bg-gray-400 w-full h-full rounded-full' src={users.image} alt="Service" />
                        </div>
                        <div className="w-10/12 flex justify-between items-center">
                          <div className="w-10/12">
                            <h2 className="text-base font-normal text-black">{users.firstName} {users.lastName}</h2>
                            <p className="text-gray-400 leading-4 text-sm">{users?.accountType?.toUpperCase()}</p>
                          </div>
                          {/* You can add an icon SVG here if desired */}
                        </div>
                      </div>
                    </Link>
                  )
                ))
              }
            </div>

            {/* EVENTS PREVIEW */}
            <div className="bg-[#fafafa] w-full px-4 py-4 rounded-lg border-2 border-gray-200 max-w-[350px] mt-4">
              <div className="flex w-full items-center justify-between">
                <h1 className='text-lg font-semibold text-gray-600'>Upcoming Events</h1>
                <Link to="/dashboard/events">
                  <span className="text-sm font-normal text-[#4A00E0]">View All</span>
                </Link>
              </div>
              {eventData.map(ad => (
                <Link 
                  key={ad._id} 
                  to={{
                    pathname: "/dashboard/event/view",
                    state: { highlightEventId: ad._id }
                  }}
                >
                  <div className="w-full mt-4 flex items-center justify-between gap-2">
                    <div className="w-9 h-9">
                      <img className='bg-gray-400 w-full h-full rounded-full object-cover' src={ad.imgPath[0]} alt="Event" />
                    </div>
                    <div className="w-10/12 flex justify-between items-center">
                      <div className="w-10/12">
                        <h2 className="text-base font-normal text-black">{ad.title}</h2>
                        <p className="text-gray-400 leading-4 text-sm">{ad.location}</p>
                      </div>
                      {/* Icon SVG can go here */}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Middle Section: Main Feed */}
        <div className="lg:w-6/12 w-full overflow-y-auto p-4 lg:mb-0 mb-14 max-h-[86vh] no-scrollbar">
          {/* Create Post Section */}
          <CreatePostSection />
          {/* Posts Feed */}
          <Posts />
        </div>

        {/* Right Sidebar: Advertisements */}
        {!isSmallScreen && (
          <div className="w-3/12 bg-white p-4 hidden lg:block">
            <Advertisements />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
