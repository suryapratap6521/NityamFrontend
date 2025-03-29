import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../Components/Common/Loader";
import CreatePostSection from "../Components/Common/CreatePostSection";
import Posts from "../Components/Core/Post/Posts";
import Advertisements from "../Components/Core/Dashboard/Advertisement";
import { getServices } from "../services/operations/serviceApi";
import { fetchEventsByUser } from "../services/operations/eventApi";
import { Link } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Avatar from "@mui/material/Avatar";
/** 
 * Utility function to parse date/time
 * Returns an object { day, shortMonth } 
 * e.g., "23 Mar"
 */
const formatEventDate = (isoString) => {
  const date = new Date(isoString);
  const day = date.getDate(); // e.g., 23
  const shortMonth = date.toLocaleString("default", { month: "short" }); // e.g., Mar
  return { day, shortMonth };
};

/**
 * Utility function to parse time range
 * e.g., "7:00 PM - 11:30 PM"
 */
const formatEventTimeRange = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const startTime = start.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  const endTime = end.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return `${startTime} - ${endTime}`;
};

const Dashboard = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { loading: profileLoading } = useSelector((state) => state.auth);
  const { loading: authLoading } = useSelector((state) => state.profile);
  const { user } = useSelector((state) => state.profile);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [allUsers, setAllUsers] = useState([]);
  const [userMadeServices, setUserMadeServices] = useState([]);
  const [eventData, setEventData] = useState([]);
  console.log(userMadeServices,"userMadeServices");
  // Fetch data for services and events
  useEffect(() => {
    const fetchData = async () => {
      if (!profileLoading && !authLoading) {
        try {
          const response = await getServices(token, dispatch);
          setAllUsers(response.data.allUsers);
          setUserMadeServices(response.data.userMadeServices);

          const responseEvent = await fetchEventsByUser(token, dispatch);
          setEventData(responseEvent);
        } catch (error) {
          console.error("Error fetching services or events:", error);
        }
      }
    };
    fetchData();
  }, [token, dispatch, profileLoading, authLoading]);

  // Show loader if still fetching profile/auth
  if (profileLoading || authLoading) {
    return <Loader />;
  }

  return (
    <div className="bg-white">
      <div className="w-full flex justify-between">
        {/* ========== LEFT SIDEBAR: Services & Events Previews ========== */}
        {!isSmallScreen && (
          <div className="w-3/12 bg-white p-4 hidden lg:flex flex-col items-center">
            {/* SERVICES PREVIEW */}
            <div className="bg-[#fafafa] w-full px-4 py-4 rounded-lg border-2 border-gray-200 max-w-[350px]">
              <div className="flex w-full items-center justify-between">
                <h1 className="text-lg font-semibold text-gray-600">Services</h1>
                <Link to="/dashboard/services">
                  <span className="text-sm font-normal text-[#4A00E0]">View All</span>
                </Link>
              </div>
              {/* Example mapping over your allUsers data */}
              {allUsers &&
                allUsers.slice(0, 5).map((users) => (
                  users?.communityDetails?._id === user?.communityDetails?._id &&
                  users?.id === user?.id &&
                  user?.profession && (
                    <Link
                      key={users._id}
                      to={{
                        pathname: "/dashboard/service/view",
                        state: { highlightServiceId: users._id },
                      }}
                    >
                      <div className="w-full mt-4 flex items-center justify-between gap-2">
                        <div className="w-9 h-9">
                          <img
                            className="bg-gray-400 w-full h-full rounded-full"
                            src={users.image}
                            alt="Service"
                          />
                        </div>
                        <div className="w-10/12 flex justify-between items-center">
                          <div className="w-10/12">
                            <h2 className="text-base font-normal text-black">
                              {users.firstName} {users.lastName}
                            </h2>
                            <p className="text-gray-400 leading-4 text-sm">
                              {users?.profession?.toUpperCase()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  )
                ))}

              {/* Example mapping over userMadeServices data */}
              {userMadeServices &&
                userMadeServices.slice(0, 5).map((svc) => (
                  svc.createdBy?.communityDetails?._id === user?.communityDetails?._id && (
                    <Link
                      key={svc._id}
                      to={{
                        pathname: "/dashboard/service/view",
                        state: { highlightServiceId: svc._id },
                      }}
                    >
                      <div className="w-full mt-4 flex items-center justify-between gap-2">
                        <div className="w-9 h-9">
                        {svc.image ? (
                  <img
                    className="w-full h-full rounded-full"
                    src={svc.image}
                    alt="Service"
                  />
                ) : (
                  <img
                    className="w-full h-full rounded-full"
                    src={`https://api.dicebear.com/5.x/initials/svg?seed=${svc.firstName} ${svc.lastName}`}
                    alt="Service"
                  />
                )}
                        </div>
                        <div className="w-10/12 flex justify-between items-center">
                          <div className="w-10/12">
                            <h2 className="text-base font-normal text-black">
                              {svc.firstName} {svc.lastName}
                            </h2>
                            <p className="text-gray-400 leading-4 text-sm">
                              {svc?.profession?.toUpperCase()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  )
                ))}
            </div>

            {/* EVENTS PREVIEW (Minimal List Style) */}
            <div className="bg-[#fafafa] w-full px-4 py-4 rounded-lg border-2 border-gray-200 max-w-[350px] mt-4">
              <div className="flex w-full items-center justify-between">
                <h1 className="text-lg font-semibold text-gray-600">Upcoming Events</h1>
                <Link to="/dashboard/events">
                  <span className="text-sm font-normal text-[#4A00E0]">View All</span>
                </Link>
              </div>

              {eventData.map((ad) => {
                // Parse date/time
                const { day, shortMonth } = formatEventDate(ad.startDate);
                const timeRange = formatEventTimeRange(ad.startDate, ad.endDate);

                return (
                  <Link
                    key={ad._id}
                    to={{
                      pathname: "/dashboard/event/view",
                      state: { highlightEventId: ad._id },
                    }}
                  >
                    <div className="flex items-center p-2 mt-4 border-b last:border-b-0">
                      {/* DATE BOX (e.g., "23 Mar") */}
                      <div className="w-14 text-center">
                        <div className="text-2xl font-bold text-purple-700 leading-tight">
                          {day}
                        </div>
                        <div className="text-sm text-gray-500 -mt-1">{shortMonth}</div>
                      </div>

                      {/* EVENT INFO */}
                      <div className="ml-3 flex flex-col flex-grow">
                        <h3 className="font-semibold text-gray-800 text-sm md:text-base leading-tight">
                          {ad.title}
                        </h3>
                        {/* Time range, e.g., "7:00 PM - 11:30 PM" */}
                        <p className="text-xs md:text-sm text-gray-600">
                          {timeRange}
                        </p>
                        {/* Location */}
                        <p className="text-xs md:text-sm text-gray-600">{ad.location}</p>
                      </div>

                      {/* THUMBNAIL (Optional) */}
                      <div className="w-12 h-12 ml-3 flex-shrink-0 hidden md:block">
                        {ad.imgPath?.[0] ? (
                          <img
                            src={ad.imgPath[0]}
                            alt="Event"
                            className="w-full h-full object-cover rounded"
                          />
                        ) : (
                          <div className="bg-gray-300 w-full h-full rounded" />
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* ========== MIDDLE SECTION: Main Feed ========== */}
        <div className="lg:w-6/12 w-full overflow-y-auto p-4 lg:mb-0 mb-14 max-h-[86vh] no-scrollbar">
          {/* Create Post Section */}
          <CreatePostSection />

          {/* Posts Feed */}
          <Posts />
        </div>

        {/* ========== RIGHT SIDEBAR: Advertisements ========== */}
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
