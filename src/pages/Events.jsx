import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setEventData } from "../slices/eventSlice";
import { fetchEventsByUser, fetchEventById } from "../services/operations/eventApi";
import { useLocation, Link } from "react-router-dom";
import Advertisements from "../Components/Core/Dashboard/Advertisement";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import ExpandableText from "../Components/Common/ExpandableText"; // adjust path as needed
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CloseIcon from "@mui/icons-material/Close";
import { Modal, Box, IconButton, Typography } from "@mui/material";
import DEFAULT_EVENT_IMAGE from "../assests/events.jpg";

// Utility functions to format date/time
const formatEventDate = (isoString) => {
  const date = new Date(isoString);
  return {
    day: date.getDate(),
    shortMonth: date.toLocaleString("default", { month: "short" }),
  };
};

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

// Modal style for the image carousel
const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "95%", sm: "90%", md: 800 },
  height: { xs: "80%", sm: "80%", md: "80%" },
  bgcolor: "background.paper",
  borderRadius: "8px",
  boxShadow: 24,
  p: { xs: 1, sm: 2, md: 3 },
  outline: "none",
  overflow: "hidden",
};


const EventItem = ({ event, onClick }) => {
  const itemRef = useRef(null);
  const location = useLocation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [openImageModal, setOpenImageModal] = useState(false);

  // If highlighted, scroll into view with blink effect
  useEffect(() => {
    if (location.state?.highlightEventId === event._id && itemRef.current) {
      itemRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      itemRef.current.classList.add("blink");
      setTimeout(() => {
        itemRef.current.classList.remove("blink");
      }, 3000);
    }
  }, [location.state, event._id]);

  const { day, shortMonth } = formatEventDate(event.startDate);
  const timeRange = formatEventTimeRange(event.startDate, event.endDate);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    event.location
  )}`;

  // Determine images array (fallback to default)
  const images =
    event?.imgPath && event.imgPath.length > 0 ? event.imgPath : [DEFAULT_EVENT_IMAGE];

  // Handlers for modal carousel navigation
  const handlePrevModal = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };
  const handleNextModal = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div
      ref={itemRef}
      className="bg-white rounded-lg shadow-md border border-gray-200 p-4 mb-6 cursor-pointer hover:bg-gray-50 transition-all duration-300"
      onClick={() => onClick && onClick(event)}
    >
      {/* Header with date and event details */}
      <div className="flex items-center">
        <div className="w-16 h-16 flex flex-col items-center justify-center bg-purple-50 rounded-lg mr-4">
          <div className="text-2xl font-bold text-purple-700">{day}</div>
          <div className="text-sm text-gray-500">{shortMonth}</div>
        </div>
        <div className="flex-1">
          <p className="font-semibold break-words">
            <ExpandableText text={event?.title} threshold={40} />
          </p>
          <p className="text-sm text-gray-600 break-words">{timeRange}</p>
          <p className="text-sm text-gray-600 break-words">{event.location}</p>
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-500 underline hover:text-blue-700"
          >
            Get Directions
          </a>
        </div>
      </div>

      {/* Description */}
      <div className="mt-4">
        <p className="text-sm text-gray-700 break-words">
          <ExpandableText text={event?.description} threshold={100} />
        </p>
      </div>

      {/* Image Carousel Section */}
      <div
        className="relative mt-4 w-full h-64 overflow-hidden rounded-lg"
        onClick={(e) => {
          e.stopPropagation();
          setOpenImageModal(true);
        }}
      >
        <img
          src={images[currentImageIndex]}
          alt="Event"
          className="w-full h-full object-cover"
        />
        {images.length > 1 && (
          <>
            <IconButton
              onClick={handlePrevModal}
              className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white bg-opacity-70 rounded-full hover:bg-opacity-90"
            >
              <ChevronLeftIcon />
            </IconButton>
            <IconButton
              onClick={handleNextModal}
              className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white bg-opacity-70 rounded-full hover:bg-opacity-90"
            >
              <ChevronRightIcon />
            </IconButton>
          </>
        )}
      </div>

      {/* Image Modal */}
      <Modal
        open={openImageModal}
        onClose={() => setOpenImageModal(false)}
        aria-labelledby="image-modal"
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Box sx={modalStyle} onClick={(e) => e.stopPropagation()}>
          <div className="relative">
          <IconButton
              onClick={() => setOpenImageModal(false)}
              className="absolute top-2 right-2 bg-white bg-opacity-70 rounded-full hover:bg-opacity-90"
            >
              <CloseIcon />
            </IconButton>
            <img
              src={images[currentImageIndex]}
              alt="Event Full"
              className="object-contain rounded-md"
            />
            {images.length > 1 && (
              <>
                <IconButton
                  onClick={handlePrevModal}
                  className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white bg-opacity-70 rounded-full hover:bg-opacity-90"
                >
                  <ChevronLeftIcon />
                </IconButton>
                <IconButton
                  onClick={handleNextModal}
                  className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white bg-opacity-70 rounded-full hover:bg-opacity-90"
                >
                  <ChevronRightIcon />
                </IconButton>
              </>
            )}
            
          </div>
        </Box>
      </Modal>
    </div>
  );
};

const Events = () => {
  const dispatch = useDispatch();
  const eventData = useSelector((state) => state.event.userEvent || []);
  const token = useSelector((state) => state.auth.token);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  // Fetch events when token or dispatch changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchEventsByUser(token, dispatch);
      } catch (error) {
        console.error(error);
      }
    };
    if (token) fetchData();
  }, [token, dispatch]);

  // When an event is clicked, store event data in Redux (or perform additional actions)
  const handleEventClick = (event) => {
    dispatch(setEventData(event));
  };

  return (
    <div className="bg-white flex justify-around w-full md:mb-0 mb-14">
      <div className="w-full md:w-9/12 md:py-4 md:px-16 md:pl-24 p-4 mt-2 lg:mb-0 mb-14 max-h-[86vh] overflow-y-auto no-scrollbar">
        <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-end">
          <div>
            <h1 className="text-3xl font-semibold text-[#8E2DE2] mb-1">
              Events
            </h1>
            <p className="text-gray-500 text-sm">
              Stay updated with the latest events happening around you!
            </p>
          </div>
          {/* Uncomment below for "Add New Event" functionality */}
          {/*
          <Link
            to="/dashboard/event/create"
            onClick={() => handleEventClick({})}
            className="flex items-center bg-purple-100 hover:bg-purple-200 px-4 py-2 rounded-lg transition-colors"
          >
            <AddIcon style={{ fontSize: "24px", fill: "#8E2DE2" }} />
            <span className="ml-2 text-[#8E2DE2] font-medium">Add New Event</span>
          </Link>
          */}
        </div>
        <div className="grid md:grid-cols-1 grid-cols-1 gap-6">
          {eventData && eventData.length ? (
            eventData.map((event) => (
              <EventItem key={event._id} event={event} onClick={handleEventClick} />
            ))
          ) : (
            <p className="text-gray-500">No events available.</p>
          )}
        </div>
      </div>
      {!isSmallScreen && (
        <div className="w-3/12 p-4 hidden md:block">
          <Advertisements />
        </div>
      )}
    </div>
  );
};

export default Events;
