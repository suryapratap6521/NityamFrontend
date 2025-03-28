import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../Components/Common/Loader';
import Sidebar from '../Components/Core/Dashboard/Sidebar';
import Posts from '../Components/Core/Post/Posts';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Advertisements from '../Components/Core/Dashboard/Advertisement'
import SideBarPost from '../Components/Core/Post/SideBarPost';
import { getServices } from '../services/operations/serviceApi'
import { fetchEventsByUser } from '../services/operations/eventApi'
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { token } = useSelector(state => state.auth);
  const { loading: profileLoading } = useSelector((state) => state.auth);
  const { loading: authLoading } = useSelector((state) => state.profile);
  const { user } = useSelector((state) => state.profile);
  const dispatch = useDispatch();

  const { signUpData } = useSelector((state) => state.auth);

  const eventData = useSelector((state) => state.event.userEvent || []);
  const serviceData = useSelector((state) => state.service.serviceData || []);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [services, setServices] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      if (!profileLoading && !authLoading) {
        try {
          const response = await getServices(token, dispatch);
          setServices(response.data); // Ensure response is properly awaited
          await fetchEventsByUser(token, dispatch); // Ensure this is awaited too
        } catch (error) {
          console.error("Error fetching services or events:", error);
        }
      }
    };

    fetchData();
  }, [token, dispatch, profileLoading, authLoading]);


  if (profileLoading || authLoading) {
    return <Loader />;
  }

  console.log(services);
  return (
    <div className=" bg-white">

      <div className="w-full flex justify-between">

        {!isSmallScreen && (

          <div className="w-3/12 bg-white p-4  hidden lg:flex  flex-col items-center">
            <div className="bg-[#fafafa] w-full px-4 py-4 rounded-lg border-2  border-gray-200 max-w-[350px] ">
              <div className="flex w-full items-center justify-between">
                <h1 className='text-lg font-semibold text-gray-600'>Services</h1>
                <Link to="/dashboard/services">
                  <span className="text-sm font-normal text-[#4A00E0]">View All</span>
                </Link>
              </div>
              {serviceData &&
                serviceData.allUsers &&
                serviceData.allUsers.slice(0, 5).map(users => (
                  users?.communityDetails?._id === user?.communityDetails?._id && (users?.id === user?.id) && (user?.profession) && (
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
                            <p className="text-gray-400 leading-4 text-sm">{users?.profession?.toUpperCase()}</p>
                          </div>
                          {/* You can add an icon SVG here if desired */}
                        </div>
                      </div>
                    </Link>
                  )
                ))
              }
              {services &&
                services.allUsers &&
                services?.allUsers?.map(users => (
                  (
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
                            <p className="text-gray-400 leading-4 text-sm">{users?.profession?.toUpperCase()}</p>
                          </div>
                          {/* You can add an icon SVG here if desired */}
                        </div>
                      </div>
                    </Link>
                  )
                ))
              }

            </div>

            <div className="bg-[#fafafa] w-full px-4 py-4 rounded-lg border-2  border-gray-200 max-w-[350px] mt-4 ">
              <div className="flex w-full items-center justify-between">
                <h1 className='text-lg font-semibold text-gray-600'>Upcoming Events</h1>
                <Link to="/dashboard/events">
                  <span className="text-sm font-normal text-[#4A00E0]">View All</span>
                </Link>
              </div>
              {eventData.map((ad, index) => (<>
                <div className="w-full mt-4 flex items-center justify-between gap-2">
                  <div className="w-9 h-9">
                    <img className='bg-gray-400 w-full h-full rounded-full object-cover' src={ad.imgPath[0]} />
                  </div>
                  <div className="w-10/12 flex justify-between items-center">
                    <div className="w-10/12">
                      <h2 className="text-base font-normal text-black">{ad.title} </h2>
                      <p className="text-gray-400 leading-4 text-sm ">{ad.location}</p>
                    </div>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 4C5.46957 4 4.96086 4.21071 4.58579 4.58579C4.21071 4.96086 4 5.46957 4 6V14C4 14.5304 4.21071 15.0391 4.58579 15.4142C4.96086 15.7893 5.46957 16 6 16H14C14.5304 16 15.0391 15.7893 15.4142 15.4142C15.7893 15.0391 16 14.5304 16 14V11.5C16 11.3674 16.0527 11.2402 16.1464 11.1464C16.2402 11.0527 16.3674 11 16.5 11C16.6326 11 16.7598 11.0527 16.8536 11.1464C16.9473 11.2402 17 11.3674 17 11.5V14C17 14.7956 16.6839 15.5587 16.1213 16.1213C15.5587 16.6839 14.7956 17 14 17H6C5.20435 17 4.44129 16.6839 3.87868 16.1213C3.31607 15.5587 3 14.7956 3 14V6C3 5.20435 3.31607 4.44129 3.87868 3.87868C4.44129 3.31607 5.20435 3 6 3H8.5C8.63261 3 8.75979 3.05268 8.85355 3.14645C8.94732 3.24021 9 3.36739 9 3.5C9 3.63261 8.94732 3.75979 8.85355 3.85355C8.75979 3.94732 8.63261 4 8.5 4H6ZM11 3.5C11 3.36739 11.0527 3.24021 11.1464 3.14645C11.2402 3.05268 11.3674 3 11.5 3H16.5C16.6326 3 16.7598 3.05268 16.8536 3.14645C16.9473 3.24021 17 3.36739 17 3.5V8.5C17 8.63261 16.9473 8.75979 16.8536 8.85355C16.7598 8.94732 16.6326 9 16.5 9C16.3674 9 16.2402 8.94732 16.1464 8.85355C16.0527 8.75979 16 8.63261 16 8.5V4.707L11.854 8.854C11.7601 8.94789 11.6328 9.00063 11.5 9.00063C11.3672 9.00063 11.2399 8.94789 11.146 8.854C11.0521 8.76011 10.9994 8.63278 10.9994 8.5C10.9994 8.36722 11.0521 8.23989 11.146 8.146L15.293 4H11.5C11.3674 4 11.2402 3.94732 11.1464 3.85355C11.0527 3.75979 11 3.63261 11 3.5Z" fill="black" />
                    </svg>


                  </div>
                </div>
              </>))}
            </div>
            {/* Ads*/}
          </div>
        )}
        <div className="lg:w-6/12 w-full overflow-y-auto p-4 lg:mb-0 mb-14 max-h-[86vh] no-scrollbar">
          <SideBarPost />
          <Posts />
        </div>
        {!isSmallScreen && (
          <div className="w-3/12 bg-white p-4 hidden lg:block">
            <Advertisements />
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
