import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setEventData } from "../slices/eventSlice";
import AddIcon from '@mui/icons-material/Add';
import { fetchEventsByUser } from "../services/operations/eventApi";
import { Link } from 'react-router-dom';
import Advertisements from '../Components/Core/Dashboard/Advertisement'
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import ExpandableText from "../Components/Common/ExpandableText"; // adjust the path as needed

// Child component for each event item
const EventItem = ({ event, onClick }) => {
  const itemRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    if (location.state?.highlightEventId === event._id && itemRef.current) {
      // Scroll item into view and apply blink effect
      itemRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
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
      onClick={() => onClick && onClick(event)}
      className="flex justify-center items-center md:items-start hover:bg-gray-200 p-3 rounded-md cursor-pointer transition-all duration-300 w-full bg-[#FAFAFA] border border-[#00000020]"
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
          <h3 className="text-xl font-semibold mt-2 mb-1">
            <ExpandableText text={event?.title} threshold={40} />
          </h3>
          <div className="flex items-center gap-1">
            <p className="text-base mb-1 text-[#8E2DE2] font-normal">
              {event?.location} | {formatDateTime(event?.startDate)}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <p className="text-xs mb-1 text-gray-600 w-10/12">
              <ExpandableText text={event?.description} threshold={100} />
            </p>
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
  const token = useSelector((state) => state.auth.token);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  // Call API only when token or dispatch changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchEventsByUser(token, dispatch);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [token, dispatch]);

  // When an event is clicked, set event data into Redux
  const handleEventClick = (event) => {
    dispatch(setEventData(event));
  };

        // Format the date as "22 Feb 2025"
        const formattedDate = date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });

        // Format the time as "12:56 PM"
        const formattedTime = date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });

        return `${formattedDate}, ${formattedTime}`;
    }


    return (
        <div className=" md:mb-0 mb-14 bg-white flex justify-around w-full">

            <div className="w-full md:w-9/12 md:py-4 md:px-16 md:pl-24 p-4 md:mt-0 mt-2 lg:mb-0 mb-14 max-h-[86vh] no-scrollbar overflow-scroll">
                <div className="w-full mb-4 flex md:flex-row flex-col justify-between md:items-end">
                    <div>
                        <h1 className="md:text-3xl text-xl text-left font-semibold mb-1 text-[#8E2DE2]">
                            Events
                        </h1>
                        <p className="text-gray-400 leading-4 text-sm">
                            Stay updated with the latest events happening around you!
                        </p>
                    </div>
                    {/* <Link to="/dashboard/event/create"
                        onClick={() => handleEventClick({})}
                        className="flex justify-center items-center hover:bg-gray-200 p-2 px-6 rounded-lg cursor-pointer transition-all duration-300 bg-[#8E2DE220] w-fit mt-1 md:mt-0">
                        <div className="flex justify-center items-center">

                            <h3 className="md:text-base text-sm font-medium text-center text-[#8E2DE2] ">Add New Event</h3>
                            <AddIcon style={{ fontSize: "24px", fill: "#8E2DE2" }} />



                        </div>
                    </Link> */}
                </div>
                <div className="grid md:grid-cols-2 grid-cols-1 mt-10 items-center gap-3">

                    {eventData && eventData.length !== 0 &&
                        eventData.map((event, index) => (
                            <Link to="/dashboard/event/view"
                                onClick={() => handleEventClick(event)}
                                className="flex justify-center items-center md:items-start hover:bg-gray-200 p- rounded-md cursor-pointer transition-all duration-300 w-full bg-[#FAFAFA] border border-[#00000020]">
                                <div className="flex flex-col justify-center w-full">
                                    <div className="w-full h-[250px]">
                                        <img src={event.imgPath[0]} alt="Post Media" class="w-full h-full rounded-md m-auto object-cover cursor-pointer" />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="text-xl font-semibold mt-2 mb-1">{event.title}</h3>
                                        <div className="flex items-center gap-1"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M21.45 11.227H20.06C19.8783 9.33656 19.0445 7.56824 17.7016 6.22534C16.3587 4.88245 14.5904 4.04866 12.7 3.86699V2.47699C12.7 2.27808 12.621 2.08731 12.4803 1.94666C12.3397 1.80601 12.1489 1.72699 11.95 1.72699C11.7511 1.72699 11.5603 1.80601 11.4197 1.94666C11.279 2.08731 11.2 2.27808 11.2 2.47699V3.86699C9.31784 4.05774 7.56021 4.89576 6.22707 6.23801C4.89393 7.58027 4.06792 9.34357 3.89 11.227H2.5C2.40151 11.227 2.30398 11.2464 2.21299 11.2841C2.12199 11.3218 2.03931 11.377 1.96967 11.4467C1.90003 11.5163 1.84478 11.599 1.80709 11.69C1.7694 11.781 1.75 11.8785 1.75 11.977C1.75 12.0755 1.7694 12.173 1.80709 12.264C1.84478 12.355 1.90003 12.4377 1.96967 12.5073C2.03931 12.577 2.12199 12.6322 2.21299 12.6699C2.30398 12.7076 2.40151 12.727 2.5 12.727H3.89C4.07167 14.6174 4.90546 16.3857 6.24835 17.7286C7.59125 19.0715 9.35957 19.9053 11.25 20.087V21.477C11.25 21.6759 11.329 21.8667 11.4697 22.0073C11.6103 22.148 11.8011 22.227 12 22.227C12.1989 22.227 12.3897 22.148 12.5303 22.0073C12.671 21.8667 12.75 21.6759 12.75 21.477V20.087C14.6397 19.9035 16.407 19.0691 17.7496 17.7265C19.0921 16.384 19.9265 14.6167 20.11 12.727H21.5C21.5985 12.727 21.696 12.7076 21.787 12.6699C21.878 12.6322 21.9607 12.577 22.0303 12.5073C22.1 12.4377 22.1552 12.355 22.1929 12.264C22.2306 12.173 22.25 12.0755 22.25 11.977C22.25 11.8785 22.2306 11.781 22.1929 11.69C22.1552 11.599 22.1 11.5163 22.0303 11.4467C21.9607 11.377 21.878 11.3218 21.787 11.2841C21.696 11.2464 21.5985 11.227 21.5 11.227H21.45ZM11.95 18.617C10.6367 18.617 9.35296 18.2276 8.26101 17.4979C7.16907 16.7683 6.31801 15.7313 5.81544 14.518C5.31287 13.3047 5.18138 11.9696 5.43759 10.6816C5.69379 9.39356 6.32619 8.21042 7.25481 7.2818C8.18343 6.35318 9.36657 5.72078 10.6546 5.46458C11.9426 5.20837 13.2777 5.33986 14.491 5.84243C15.7043 6.345 16.7413 7.19606 17.471 8.288C18.2006 9.37995 18.59 10.6637 18.59 11.977C18.59 13.7389 17.8908 15.4289 16.6458 16.6757C15.4008 17.9225 13.712 18.6243 11.95 18.627V18.617Z" fill="#8E2DE2" />
                                            <path d="M16.4799 11.987C16.4799 12.8854 16.2134 13.7635 15.7141 14.5103C15.2148 15.2571 14.5051 15.839 13.675 16.1824C12.8448 16.5257 11.9315 16.615 11.0505 16.439C10.1696 16.263 9.36063 15.8296 8.7261 15.1937C8.09157 14.5578 7.65997 13.7479 7.48592 12.8666C7.31188 11.9852 7.40321 11.0721 7.74837 10.2427C8.09352 9.41328 8.67698 8.70492 9.4249 8.20726C10.1728 7.70961 11.0516 7.44502 11.9499 7.447C12.5456 7.447 13.1355 7.5645 13.6858 7.79278C14.236 8.02106 14.7359 8.35563 15.1566 8.77734C15.5774 9.19905 15.9109 9.69962 16.138 10.2504C16.365 10.8011 16.4812 11.3913 16.4799 11.987Z" fill="#8E2DE2" />
                                        </svg>
                                            <p className="text-base mb-1 text-[#8E2DE2] font-normal">{event.location} | {formatDateTime(event.startDate)}</p></div>
                                        <div className="flex items-center gap-1">
                                            <p className="text-xs mb-1 text-gray-600 w-10/12">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Restatis igitur vos; Putabam equidem satis, inquit, me dixisse. Sed ea mala virtuti magnitudine obruebantur.</p>
                                            <button className="m-0 p-3 rounded-full bg-gradient"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M14.0142 17L14.0082 19.003C14.0072 19.473 14.0062 19.708 13.8592 19.854C13.7122 20 13.4772 20 13.0052 20H9.99523C6.21523 20 4.32523 20 3.15023 18.828C2.34023 18.022 2.08923 16.877 2.01023 15.011C1.99523 14.641 1.98723 14.455 2.05623 14.332C2.12623 14.209 2.40123 14.055 2.95323 13.746C3.26416 13.5727 3.52317 13.3194 3.70347 13.0125C3.88378 12.7055 3.97884 12.356 3.97884 12C3.97884 11.644 3.88378 11.2945 3.70347 10.9875C3.52317 10.6806 3.26416 10.4273 2.95323 10.254C2.40123 9.946 2.12523 9.791 2.05623 9.668C1.98723 9.545 1.99523 9.36 2.01123 8.989C2.08923 7.123 2.34123 5.979 3.15023 5.172C4.32423 4 6.21423 4 9.99523 4H13.5052C13.5709 3.99987 13.6359 4.01267 13.6966 4.03768C13.7574 4.06268 13.8126 4.0994 13.8591 4.14574C13.9056 4.19208 13.9425 4.24712 13.9678 4.30774C13.993 4.36835 14.0061 4.43334 14.0062 4.499L14.0142 7C14.0142 7.552 14.4632 8 15.0162 8V10C14.4632 10 14.0142 10.448 14.0142 11V13C14.0142 13.552 14.4632 14 15.0162 14V16C14.4632 16 14.0142 16.448 14.0142 17Z" fill="white" />
                                                <path opacity="0.5" d="M15.0166 16C15.5696 16 16.0186 16.448 16.0186 17V18.976C16.0186 19.458 16.0186 19.699 16.1736 19.846C16.3276 19.994 16.5636 19.984 17.0366 19.964C18.8996 19.885 20.0436 19.633 20.8506 18.828C21.6596 18.022 21.9106 16.876 21.9896 15.01C22.0046 14.64 22.0126 14.455 21.9436 14.332C21.8746 14.208 21.5986 14.054 21.0466 13.746C20.7357 13.5727 20.4767 13.3194 20.2964 13.0125C20.1161 12.7055 20.021 12.356 20.021 12C20.021 11.644 20.1161 11.2945 20.2964 10.9875C20.4767 10.6806 20.7357 10.4273 21.0466 10.254C21.5986 9.945 21.8746 9.79101 21.9436 9.668C22.0136 9.544 22.0046 9.359 21.9896 8.98901C21.9106 7.123 21.6596 5.978 20.8496 5.171C19.9726 4.296 18.6956 4.075 16.5276 4.019C16.4613 4.0174 16.3954 4.02908 16.3337 4.05334C16.272 4.0776 16.2158 4.11395 16.1684 4.16026C16.121 4.20657 16.0833 4.2619 16.0575 4.323C16.0318 4.38409 16.0186 4.44972 16.0186 4.516V7C16.0186 7.552 15.5696 8 15.0166 8V10C15.1481 9.99974 15.2783 10.0254 15.3999 10.0756C15.5215 10.1257 15.6319 10.1993 15.725 10.2922C15.8181 10.3851 15.8919 10.4954 15.9423 10.6169C15.9927 10.7383 16.0186 10.8685 16.0186 11V13C16.0186 13.552 15.5696 14 15.0166 14V16Z" fill="white" />
                                            </svg>

                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </Link>
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
<<<<<<< HEAD
        <div className="grid md:grid-cols-2 grid-cols-1 mt-10 items-center gap-3">
          {eventData && eventData.length !== 0 &&
            eventData.map((event) => (
              <EventItem key={event._id} event={event} onClick={handleEventClick} />
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
=======
    );
>>>>>>> Risabh_github_newest
};

export default Events;
