import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setEventData } from "../slices/eventSlice";
import AddIcon from '@mui/icons-material/Add';
import { fetchEventsByUser } from "../services/operations/eventApi";
import { Link, useLocation } from 'react-router-dom';
import Advertisements from '../Components/Core/Dashboard/Advertisement';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

// Child component for each event item
const EventItem = ({ event }) => {
  const itemRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    if (location.state?.highlightEventId === event._id && itemRef.current) {
      // Scroll item into view
      itemRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      // Apply blink effect
      itemRef.current.classList.add("blink");
      setTimeout(() => {
        itemRef.current.classList.remove("blink");
      }, 3000);
    }
  }, [location.state, event._id]);

  // Utility: format date/time
  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    const formattedDate = date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
    const formattedTime = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    return `${formattedDate}, ${formattedTime}`;
  };

  return (
    <Link
      to={{
        pathname: "/dashboard/event/view",
        state: { highlightEventId: event._id }
      }}
      className="flex justify-center items-center md:items-start hover:bg-gray-200 p- rounded-md cursor-pointer transition-all duration-300 w-full bg-[#FAFAFA] border border-[#00000020]"
    >
      <div ref={itemRef} className="flex flex-col justify-center w-full">
        <div className="w-full h-[250px]">
          <img 
            src={event?.imgPath[0]} 
            alt="Event" 
            className="w-full h-full rounded-md m-auto object-cover cursor-pointer" 
          />
        </div>
        <div className="p-4">
          <h3 className="text-xl font-semibold mt-2 mb-1">{event?.title}</h3>
          <div className="flex items-center gap-1">
            {/* Example Icon SVG */}
            <p className="text-base mb-1 text-[#8E2DE2] font-normal">
              {event?.location} | {formatDateTime(event?.startDate)}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <p className="text-xs mb-1 text-gray-600 w-10/12">{event?.description}</p>
            <button className="m-0 p-3 rounded-full bg-gradient">
              {/* Button Icon SVG */}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

const Events = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();
  const eventData = useSelector((state) => state.event.userEvent || []);
  const loading = useSelector((state) => state.event.loading || false);
  const token = useSelector((state) => state.auth.token);
  const { user } = useSelector((state) => state.profile);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!loading) {
          await fetchEventsByUser(token, dispatch);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [token, dispatch, loading]);

  // When an event is clicked, you could also set event data into Redux (if needed)
  const handleEventClick = (event) => {
    dispatch(setEventData(event));
  };

  return (
    <div className="md:mb-0 mb-14 bg-white flex justify-around w-full">
      <div className="w-full md:w-9/12 md:py-4 md:px-16 md:pl-24 p-4 md:mt-0 mt-2 lg:mb-0 mb-14 max-h-[86vh] no-scrollbar overflow-scroll">
        <div className="w-full mb-4 flex md:flex-row flex-col justify-between md:items-end">
          <div>
            <h1 className="md:text-3xl text-xl text-left font-semibold mb-1 text-[#8E2DE2]">
              Events
            </h1>
            <p className="text-gray-400 leading-4 text-sm">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
            </p>
          </div>
          {/* Optionally add an “Add New Event” link here */}
        </div>
        <div className="grid md:grid-cols-2 grid-cols-1 mt-10 items-center gap-3">
          {eventData && eventData.length !== 0 &&
            eventData.map((event) => (
              <EventItem key={event._id} event={event} onClick={() => handleEventClick(event)} />
            ))
          }
        </div>
      </div>
      {!isSmallScreen && (
        <div className="w-3/12 bg-white p-4 hidden md:block">
          <Advertisements />
        </div>
      )}
    </div>
  );
};

export default Events;
