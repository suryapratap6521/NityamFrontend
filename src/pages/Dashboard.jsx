import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../Components/Common/Loader";
import CreatePostSection from "../Components/Common/CreatePostSection";
import Posts from "../Components/Core/Post/Posts";
import Advertisements from "../Components/Core/Dashboard/Advertisement";
import { getServices, getServiceById } from "../services/operations/serviceApi";
import { fetchEventsByUser, fetchEventById } from "../services/operations/eventApi";
import { Link } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Modal, Box, Typography, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import EVENT_IMAGE from "../assests/events.jpg";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Button } from "@mui/material";
import {location} from 'react-router-dom';
/** 
 * Utility function to parse date/time 
 */




const formatEventDate = (isoString) => {
  const date = new Date(isoString);
  const day = date.getDate();
  const shortMonth = date.toLocaleString("default", { month: "short" });
  return { day, shortMonth };
};

/**
 * Utility function to parse time range
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

// Updated modal style (larger modal for images)
const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "95%", sm: "90%", md: 800 },
  height: { xs: "80vh", sm: "80vh", md: "80vh" },
  bgcolor: "background.paper",
  borderRadius: "8px",
  boxShadow: 24,
  p: { xs: 1, sm: 2, md: 3 },
  outline: "none",
  overflow: "hidden",
};

const Dashboard = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { loading: profileLoading } = useSelector((state) => state.auth);
  const { loading: authLoading } = useSelector((state) => state.profile);
  const { user } = useSelector((state) => state.profile);
  console.log(user, "==================?")
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [allUsers, setAllUsers] = useState([]);
  const [userMadeServices, setUserMadeServices] = useState([]);
  const [eventData, setEventData] = useState([]);

  // Modal state
  const [openEventModal, setOpenEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [openServiceModal, setOpenServiceModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  // Fetch services and events
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

  // Handlers to open modals and fetch details
  const handleOpenEventModal = async (eventId) => {
    try {
      const eventDetails = await fetchEventById(eventId, token, dispatch);
      // Expecting response structure: { success: true, event: { ... } }
      setSelectedEvent(eventDetails.data.event);
      setOpenEventModal(true);
    } catch (error) {
      console.error("Error fetching event details:", error);
    }
  };

  const handleOpenServiceModal = async (serviceId) => {
    try {
      const serviceDetails = await getServiceById(serviceId, token, dispatch);
      // Expecting response structure: { success: true, service: { ... } }
      setSelectedService(serviceDetails.data.service);
      setOpenServiceModal(true);
    } catch (error) {
      console.error("Error fetching service details:", error);
    }
  };

  const handleCloseEventModal = () => {
    setOpenEventModal(false);
    setSelectedEvent(null);
  };

  const handleCloseServiceModal = () => {
    setOpenServiceModal(false);
    setSelectedService(null);
  };

  if (profileLoading || authLoading) {
    return <Loader />;
  }

  return (
    <div className="bg-white md:mt-[138px] mt-[60px]">
      <div className="w-full flex justify-between">
        {/* LEFT SIDEBAR: Services & Events Previews */}
        {!isSmallScreen && (
          <div className="w-3/12 bg-white p-4 hidden lg:flex flex-col items-center max-h-[84.5vh] no-scrollbar overflow-y-auto">
            <div className="bg-[#fafafa] w-full px-4 py-4 rounded-lg border border-gray-200 max-w-[350px] overflow-scroll">
              <div className="flex w-full items-center justify-between">
                <h1 className="text-lg font-semibold text-gray-600">Services</h1>
                <Link to="/dashboard/services">
                  <span className="text-sm font-normal text-[#4A00E0]">View All</span>
                </Link>
              </div>
              {allUsers &&
                allUsers.slice(0, 5).map((users) =>
                  users?.communityDetails?._id === user?.communityDetails?._id &&
                  users?.id === user?.id &&
                  user?.profession && (
                    <div
                      key={users._id}
                      className="w-full mt-4 flex items-center gap-2 cursor-pointer"
                      onClick={() => handleOpenServiceModal(users._id)}
                    >
                      <div className="w-9 h-9">
                        <img
                          className="w-full h-full rounded-full object-cover"
                          src={users.image}
                          alt="Service"
                        />
                      </div>
                      <div className="flex-1">
                        <h2 className="text-base font-normal text-black truncate">
                          {users.firstName} {users.lastName}
                        </h2>
                        <p className="text-gray-400 text-sm truncate">
                          {users?.profession?.toUpperCase()}
                        </p>
                        <p className="text-gray-400 text-sm truncate">
                          {users?.hourlyCharge}
                        </p>
                      </div>
                    </div>
                  )
                )}
              {userMadeServices &&
                userMadeServices.slice(0, 5).map((svc) =>
                  svc.createdBy?.communityDetails?._id === user?.communityDetails?._id && (
                    <div
                      key={svc._id}
                      className="w-full mt-4 flex items-center gap-2 cursor-pointer"
                      onClick={() => handleOpenServiceModal(svc._id)}
                    >
                      <div className="w-9 h-9">
                        {svc.image ? (
                          <img
                            className="w-full h-full rounded-full object-cover"
                            src={svc.image}
                            alt="Service"
                          />
                        ) : (
                          <img
                            className="w-full h-full rounded-full object-cover"
                            src={`https://api.dicebear.com/5.x/initials/svg?seed=${svc.firstName} ${svc.lastName}`}
                            alt="Service"
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        <h2 className="text-base font-normal text-black truncate">
                          {svc.firstName} {svc.lastName}
                        </h2>
                        <p className="text-gray-400 text-sm truncate">
                          {svc?.profession?.toUpperCase()}
                        </p>
                        <p className="text-gray-400 text-sm truncate">
                          {svc?.price}
                        </p>
                      </div>
                    </div>
                  )
                )}
            </div>

            <div className="bg-[#fafafa] w-full px-4 py-4 rounded-lg border border-gray-200 max-w-[350px] mt-4 overflow-scroll">
              <div className="flex w-full items-center justify-between">
                <h1 className="text-lg font-semibold text-gray-600">Upcoming Events</h1>
                <Link to="/dashboard/events">
                  <span className="text-sm font-normal text-[#4A00E0]">View All</span>
                </Link>
              </div>
              {eventData.map((ad) => {
                const { day, shortMonth } = formatEventDate(ad.startDate);
                const timeRange = formatEventTimeRange(ad.startDate, ad.endDate);
                return (
                  <div
                    key={ad._id}
                    className="flex items-center p-2 mt-4 border-b last:border-b-0 cursor-pointer"
                    onClick={() => handleOpenEventModal(ad._id)}
                  >
                    <div className="w-14 text-center">
                      <div className="text-2xl font-bold text-purple-700 leading-tight">
                        {day}
                      </div>
                      <div className="text-sm text-gray-500 -mt-1">{shortMonth}</div>
                    </div>
                    <div className="ml-3 flex flex-col flex-grow">
                      <p className="font-semibold text-gray-800 text-sm md:text-base truncate">
                        {ad?.title.length > 30 ? ad.title.substring(0, 10) + "..." : ad.title}
                      </p>
                      <p className="text-xs md:text-sm text-gray-600 truncate">{timeRange}</p>
                      <p className="text-xs md:text-sm text-gray-600 truncate">{ad?.location.slice(0, 10)}...</p>
                    </div>
                    <div className="w-12 h-12 ml-3 flex-shrink-0 hidden md:block">
                      {ad.imgPath?.[0] ? (
                        <img
                          src={ad.imgPath[0]}
                          alt="Event"
                          className="w-full h-full object-cover rounded"
                        />
                      ) : (
                        <img
                          src={EVENT_IMAGE}
                          alt="Default Event"
                          className="w-full h-full object-cover rounded"
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="lg:w-6/12 w-full overflow-y-auto p-4 lg:mb-0 mb-14 max-h-[84.5vh] no-scrollbar">
          <CreatePostSection />
          <Posts />
        </div>

        {!isSmallScreen && (
          <div className="w-3/12 bg-white p-4 hidden lg:block max-h-[84.5vh] no-scrollbar overflow-y-auto">
            <Advertisements />
          </div>
        )}
      </div>

      {/* Modal for Event Details – modal design matches event card */}
      <Modal
        open={openEventModal}
        onClose={handleCloseEventModal}
        aria-labelledby="event-modal-title"
        aria-describedby="event-modal-description"
      >
        <Box sx={modalStyle} onClick={(e) => e.stopPropagation()}>
          <IconButton
            onClick={handleCloseEventModal}
            sx={{ position: "absolute", top: 8, right: 8 }}
          >
            <CloseIcon />
          </IconButton>
          {selectedEvent ? (
            <Box className="h-full flex flex-col">
              {/* Upper section: Image Carousel */}
              <div className="relative flex-1 overflow-hidden">
                <img
                  src={
                    selectedEvent.imgPath && selectedEvent.imgPath.length > 0
                      ? selectedEvent.imgPath[0]
                      : EVENT_IMAGE
                  }
                  alt="Event"
                  className="w-full h-full object-contain rounded-md"
                />
                <IconButton
                  onClick={(e) => e.stopPropagation()}
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: 16,
                    transform: "translateY(-50%)",
                    bgcolor: "rgba(255,255,255,0.7)",
                  }}
                >
                  <ChevronLeftIcon />
                </IconButton>
                <IconButton
                  onClick={(e) => e.stopPropagation()}
                  sx={{
                    position: "absolute",
                    top: "50%",
                    right: 16,
                    transform: "translateY(-50%)",
                    bgcolor: "rgba(255,255,255,0.7)",
                  }}
                >
                  <ChevronRightIcon />
                </IconButton>
              </div>
              {/* Lower section: Event details */}
              <div className="p-4">
                <Typography variant="h6" sx={{ wordBreak: "break-word" }}>
                  {selectedEvent.title}
                </Typography>
                <Typography sx={{ mt: 1, wordBreak: "break-word" }}>
                  <strong>Date:</strong>{" "}
                  {new Date(selectedEvent.startDate).toLocaleDateString()} -{" "}
                  {new Date(selectedEvent.endDate).toLocaleDateString()}
                </Typography>
                <Typography sx={{ mt: 1 }}>
                  <strong>Time:</strong>{" "}
                  {formatEventTimeRange(selectedEvent.startDate, selectedEvent.endDate)}
                </Typography>
                <Typography sx={{ mt: 1, wordBreak: "break-word" }}>
                  <strong>Location:</strong> {selectedEvent.location}
                </Typography>
                <Typography sx={{ mt: 1, wordBreak: "break-word" }}>
                  <strong>Description:</strong>{" "}
                  {selectedEvent.description || "No description available."}
                </Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    selectedEvent.location
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ mt: 2 }}
                >
                  Get Directions
                </Button>
              </div>
            </Box>
          ) : (
            <Typography>Loading...</Typography>
          )}
        </Box>
      </Modal>

      {/* Modal for Service Details */}
      <Modal
        open={openServiceModal}
        onClose={handleCloseServiceModal}
        aria-labelledby="service-modal-title"
        aria-describedby="service-modal-description"
      >
        <Box sx={modalStyle}>
          <IconButton
            onClick={handleCloseServiceModal}
            sx={{ position: "absolute", top: 8, right: 8 }}
          >
            <CloseIcon />
          </IconButton>
          {selectedService ? (
            <Box>
              <Typography
                id="service-modal-title"
                variant="h6"
                component="h2"
                sx={{ wordBreak: "break-word" }}
              >
                {selectedService.firstName} {selectedService.lastName}
              </Typography>
              <Typography id="service-modal-description" sx={{ mt: 2, wordBreak: "break-word" }}>
                <strong>Profession:</strong> {selectedService.profession}
              </Typography>
              <Typography sx={{ mt: 2 }}>
                <strong>Phone:</strong> {selectedService.phoneNumber}
              </Typography>
              <Typography sx={{ mt: 2, wordBreak: "break-word" }}>
                <strong>Address:</strong> {selectedService.address}
              </Typography>
              <Typography sx={{ mt: 2 }}>
                <strong>Price:</strong> ${selectedService.price}
              </Typography>
              {selectedService.image && (
                <img
                  src={selectedService.image}
                  alt="Service"
                  className="w-full h-auto mt-2 rounded"
                />
              )}
            </Box>
          ) : (
            <Typography>Loading...</Typography>
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default Dashboard;
