import React, { useEffect, useState, useRef } from 'react';
import { Typography } from '@mui/material';
import { getServices } from '../../../services/operations/serviceApi';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import VerifiedIcon from '@mui/icons-material/Verified';
// import other icons/components as needed

// Child component for a service item
const ServiceItem = ({ service }) => {
  const itemRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    if (location.state?.highlightServiceId === service._id && itemRef.current) {
      // Scroll into view
      itemRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      // Add the blink effect
      itemRef.current.classList.add("blink");
      // Remove after animation (3 seconds)
      setTimeout(() => {
        itemRef.current.classList.remove("blink");
      }, 3000);
    }
  }, [location.state, service._id]);

  return (
    <div ref={itemRef} className="rounded-lg overflow-hidden bg-[#FAFAFA] border border-[#00000020] p-4">
      <div className="w-full h-32 sm:h-48 rounded-lg">
        <img
          className="w-full h-full object-cover rounded-lg"
          src={service.image || `https://api.dicebear.com/5.x/initials/svg?seed=${service.firstName} ${service.lastName}`}
          alt="Service"
        />
      </div>
      <div className="p-2">
        <h2 className="text-lg font-medium text-gray-800 flex items-center">
          {service.firstName} {service.lastName}
          <VerifiedIcon className="text-blue-500 ml-2 text-sm" />
        </h2>
        <h1 className="text-sm font-semibold text-[#4A00E0] flex items-center mb-1">
          {service?.accountType?.toUpperCase()}
        </h1>
        <p className="text-gray-600 flex items-center gap-1 mb-1">
          {/* Phone Icon SVG */}
          {service.phoneNumber}
        </p>
        <p className="text-gray-600 flex items-center gap-1 mb-1">
          {/* Community Icon SVG */}
          {service?.communityDetails?.communityName}
        </p>
        <p className="text-gray-600 flex items-center gap-1 mb-1">
          {/* City Icon SVG */}
          {service?.city}
        </p>
        <div className="text-gray-600 flex items-center gap-1 justify-between w-full">
          <p className="text-black text-3xl font-normal">₹{service?.hourlyCharge}</p>
          <button className="flex items-center bg-gradient text-white p-4 rounded-full m-0">
            {/* Button Icon SVG */}
          </button>
        </div>
      </div>
    </div>
  );
};

const Services = () => {
  const dispatch = useDispatch();
  const [services, setServices] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const { token } = useSelector(state => state.auth);
  const { user } = useSelector(state => state.profile);

  useEffect(() => {
    const handleGetAllServices = async () => {
      try {
        const response = await getServices(token, dispatch);
        setAllUsers(response.data.allUsers);
        setServices(response.data.userMadeServices);
      } catch (error) {
        console.error(error);
      }
    };

    handleGetAllServices();
  }, [token, dispatch]);

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-5">
        {/* Render community services from allUsers */}
        {allUsers.map(users => (
          users?.communityDetails?._id === user?.communityDetails?._id && (
            <Link 
              key={users._id} 
              to={{
                pathname: "/dashboard/service/view",
                state: { highlightServiceId: users._id }
              }}
            >
              <div className="rounded-lg overflow-hidden bg-[#FAFAFA] border border-[#00000020] p-4">
                <div className="w-full h-32 sm:h-48 rounded-lg">
                  <img className="w-full h-full object-cover rounded-lg" src={users.image} alt="Profile" />
                </div>
                <div className="p-2">
                  <h2 className="text-lg font-medium text-gray-800 flex items-center">
                    {users.firstName} {users.lastName}
                    <VerifiedIcon className="text-blue-500 ml-2 text-sm" />
                  </h2>
                  <h1 className="text-sm font-semibold text-[#4A00E0] flex items-center mb-1">
                    {users?.accountType?.toUpperCase()}
                  </h1>
                  <p className="text-gray-600 flex items-center gap-1 mb-1">
                    {users.phoneNumber}
                  </p>
                  <p className="text-gray-600 flex items-center gap-1 mb-1">
                    {users?.communityDetails?.communityName}
                  </p>
                  <p className="text-gray-600 flex items-center gap-1 mb-1">
                    {users?.city}
                  </p>
                  <div className="text-gray-600 flex items-center gap-1 justify-between w-full">
                    <p className="text-black text-3xl font-normal">₹{users?.hourlyCharge}</p>
                    <button className="flex items-center bg-gradient text-white p-4 rounded-full m-0">
                      {/* Button Icon SVG */}
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          )
        ))}

        {/* Render services created by users */}
        {services.map(service => (
          service?.createdBy?.communityDetails?._id === user?.communityDetails?._id && (
            <Link 
              key={service._id} 
              to={{
                pathname: "/dashboard/service/view",
                state: { highlightServiceId: service._id }
              }}
            >
              <ServiceItem service={service} />
            </Link>
          )
        ))}
      </div>
    </div>
  );
};

export default Services;
