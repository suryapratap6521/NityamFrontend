import React, { useEffect, useState } from 'react';
import Sidebar from '../Dashboard/Sidebar';
import { Typography } from '@mui/material';
import { getServices } from '../../../services/operations/serviceApi';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { ChatIcon } from '@heroicons/react/outline';
import VerifiedIcon from '@mui/icons-material/Verified';
import AddServiceCard from './AddServiceCard';

const Services = () => {
  const dispatch = useDispatch();
  const [services, setServices] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const { token } = useSelector(state => state.auth);
  const { user } = useSelector(state => state.profile);
  console.log(allUsers, "--->alluers");
  console.log(user, "user");
  useEffect(() => {
    const handleGetAllServices = async () => {
      try {
        const response = await getServices(token, dispatch);
        console.log(response, "-----response of getallservice");
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <AddServiceCard />
        {allUsers.map(users => (
          users?.communityDetails?._id === user?.communityDetails?._id && (user?.profession) && (user?._id !== users?.id) && (
            <div key={users._id} className="bg-white shadow-lg rounded-lg overflow-hidden">
              <img className="w-full h-32 sm:h-48 object-cover" src={users.image} alt="Profile" />
              <div className="p-4">
                <h1 className="text-lg font-semibold text-gray-800 flex items-center">
                  <b>{users?.profession?.toUpperCase()}</b>
                </h1>
                <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                  {users.firstName} {users.lastName}
                  <VerifiedIcon className="text-blue-500 ml-2" />
                </h2>
                <p className="text-gray-600">Phone: {users.phoneNumber}</p>
                <p className="text-gray-600">Community: {users?.communityDetails?.communityName}</p>
                <p className="text-gray-600">City: {users?.city}</p>
                <p className="text-gray-600">Charge: ₹{users?.hourlyCharge}</p>
                <div className="flex justify-end mt-4">
                  <button className="flex items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    <ChatIcon className="h-5 w-5 mr-2" />
                    Chat
                  </button>
                </div>
              </div>
            </div>
          )
        ))}

        {services.map(service => (
          service?.createdBy?.communityDetails?._id === user?.communityDetails?._id && (
            <div key={service._id} className="rounded-lg overflow-hidden bg-[#FAFAFA] border border-[#00000020] p-2">
              {service.image ? (<img className="w-full h-32 sm:h-48 object-cover" src={service?.image} alt="Service" />) : <img className="w-full h-32 sm:h-48 object-cover" src={`https://api.dicebear.com/5.x/initials/svg?seed=${service.firstName} ${service.lastName}`} alt="Service" />}

              <div className="p-2">

                <h2 className="text-lg font-medium text-gray-800 flex items-center">
                  {service.firstName} {service.lastName}
                  <VerifiedIcon className="text-blue-500 ml-2 text-sm" />
                </h2>
                <h1 className="text-sm font-semibold text-[#4A00E0] flex items-center mb-1">
                  {service?.accountType?.toUpperCase()}
                </h1>
                <p className="text-gray-600 flex items-center gap-1 mb-1"><svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.4375 2.0625H6.5625C5.31986 2.0625 4.3125 3.06986 4.3125 4.3125V13.6875C4.3125 14.9301 5.31986 15.9375 6.5625 15.9375H11.4375C12.6801 15.9375 13.6875 14.9301 13.6875 13.6875V4.3125C13.6875 3.06986 12.6801 2.0625 11.4375 2.0625Z" stroke="black" stroke-opacity="0.7" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M8.25 13.3125H9.75" stroke="black" stroke-opacity="0.7" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                  {service.phoneNumber}</p>
                <p className="text-gray-600 flex items-center gap-1 mb-1"><svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3.9375 5.90625C3.9375 5.38411 4.14492 4.88335 4.51413 4.51413C4.88335 4.14492 5.38411 3.9375 5.90625 3.9375C6.42839 3.9375 6.92915 4.14492 7.29837 4.51413C7.66758 4.88335 7.875 5.38411 7.875 5.90625C7.875 6.42839 7.66758 6.92915 7.29837 7.29837C6.92915 7.66758 6.42839 7.875 5.90625 7.875C5.38411 7.875 4.88335 7.66758 4.51413 7.29837C4.14492 6.92915 3.9375 6.42839 3.9375 5.90625ZM5.90625 2.8125C5.08574 2.8125 4.29883 3.13845 3.71864 3.71864C3.13845 4.29883 2.8125 5.08574 2.8125 5.90625C2.8125 6.72676 3.13845 7.51367 3.71864 8.09386C4.29883 8.67405 5.08574 9 5.90625 9C6.72676 9 7.51367 8.67405 8.09386 8.09386C8.67405 7.51367 9 6.72676 9 5.90625C9 5.08574 8.67405 4.29883 8.09386 3.71864C7.51367 3.13845 6.72676 2.8125 5.90625 2.8125ZM11.8125 6.75C11.8125 6.45163 11.931 6.16548 12.142 5.95451C12.353 5.74353 12.6391 5.625 12.9375 5.625C13.2359 5.625 13.522 5.74353 13.733 5.95451C13.944 6.16548 14.0625 6.45163 14.0625 6.75C14.0625 7.04837 13.944 7.33452 13.733 7.54549C13.522 7.75647 13.2359 7.875 12.9375 7.875C12.6391 7.875 12.353 7.75647 12.142 7.54549C11.931 7.33452 11.8125 7.04837 11.8125 6.75ZM12.9375 4.5C12.3408 4.5 11.7685 4.73705 11.3465 5.15901C10.9246 5.58097 10.6875 6.15326 10.6875 6.75C10.6875 7.34674 10.9246 7.91903 11.3465 8.34099C11.7685 8.76295 12.3408 9 12.9375 9C13.5342 9 14.1065 8.76295 14.5285 8.34099C14.9504 7.91903 15.1875 7.34674 15.1875 6.75C15.1875 6.15326 14.9504 5.58097 14.5285 5.15901C14.1065 4.73705 13.5342 4.5 12.9375 4.5ZM1.125 11.8125C1.125 11.3649 1.30279 10.9357 1.61926 10.6193C1.93572 10.3028 2.36495 10.125 2.8125 10.125H9C9.44755 10.125 9.87678 10.3028 10.1932 10.6193C10.5097 10.9357 10.6875 11.3649 10.6875 11.8125V11.9396C10.6862 11.9921 10.6824 12.0445 10.6762 12.0966C10.665 12.1939 10.6442 12.3261 10.6031 12.4824C10.4945 12.8948 10.3034 13.2807 10.0412 13.617C9.38306 14.4619 8.145 15.1875 5.90625 15.1875C3.6675 15.1875 2.43 14.4619 1.77131 13.617C1.50894 13.2808 1.31758 12.8948 1.20881 12.4824C1.16614 12.3169 1.13866 12.1478 1.12669 11.9773L1.12556 11.9396V11.9267L1.125 11.9222V11.8125ZM2.25 11.9126V11.9194C2.25 11.9291 2.25169 11.9468 2.25506 11.9723C2.26069 12.0229 2.2725 12.1016 2.29781 12.1995C2.34844 12.3952 2.45137 12.6596 2.65837 12.9257C3.05494 13.4342 3.92625 14.0625 5.90625 14.0625C7.88625 14.0625 8.75813 13.4342 9.15413 12.9262C9.32191 12.7108 9.44436 12.4635 9.51412 12.1995C9.5381 12.1077 9.55428 12.0139 9.5625 11.9194L9.56306 11.9126V11.8125C9.56306 11.6633 9.5038 11.5202 9.39831 11.4148C9.29282 11.3093 9.14975 11.25 9.00056 11.25H2.8125C2.66332 11.25 2.52024 11.3093 2.41475 11.4148C2.30926 11.5202 2.25 11.6633 2.25 11.8125V11.9126ZM10.9558 13.7768C11.4789 13.9545 12.1298 14.0625 12.9375 14.0625C14.7381 14.0625 15.7613 13.5264 16.3198 12.8672C16.5915 12.5466 16.7304 12.2214 16.8008 11.9717C16.8386 11.8378 16.8629 11.7004 16.8733 11.5616L16.8739 11.5414L16.8744 11.529V11.5076C16.8745 11.3261 16.8388 11.1463 16.7694 10.9786C16.7 10.8108 16.5982 10.6584 16.4698 10.53C16.3415 10.4016 16.1891 10.2997 16.0214 10.2303C15.8537 10.1608 15.6739 10.125 15.4924 10.125H10.8861C11.1673 10.4394 11.3715 10.8242 11.4683 11.25H15.4924C15.633 11.25 15.7466 11.3619 15.75 11.5009L15.7478 11.5256C15.741 11.5731 15.7312 11.62 15.7185 11.6662C15.6836 11.79 15.6116 11.9633 15.4614 12.1404C15.1762 12.4774 14.5119 12.9375 12.9375 12.9375C12.2822 12.9375 11.7849 12.8576 11.4069 12.7406C11.3072 13.1059 11.1552 13.4549 10.9558 13.7768Z" fill="black" fill-opacity="0.8" />
                </svg>
                  {service?.communityDetails?.communityName}</p>
                <p className="text-gray-600 flex items-center gap-1 mb-1"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 2C6.69 2 4 4.69 4 8C4 10.02 5.17 11.71 6.53 12.89C6.96 13.26 7.71 13.85 8.38 14.72C9.12 15.69 9.79 16.73 10 17.43C10.21 16.73 10.88 15.69 11.62 14.72C12.29 13.85 13.04 13.26 13.47 12.89C14.83 11.71 16 10.02 16 8C16 4.69 13.31 2 10 2ZM10 4.56C10.4517 4.56 10.8991 4.64898 11.3164 4.82185C11.7338 4.99473 12.113 5.24812 12.4324 5.56755C12.7519 5.88699 13.0053 6.26621 13.1781 6.68357C13.351 7.10093 13.44 7.54825 13.44 8C13.44 8.45175 13.351 8.89907 13.1781 9.31643C13.0053 9.73379 12.7519 10.113 12.4324 10.4324C12.113 10.7519 11.7338 11.0053 11.3164 11.1781C10.8991 11.351 10.4517 11.44 10 11.44C9.08766 11.44 8.21268 11.0776 7.56755 10.4324C6.92243 9.78732 6.56 8.91234 6.56 8C6.56 7.08766 6.92243 6.21268 7.56755 5.56755C8.21268 4.92243 9.08766 4.56 10 4.56Z" fill="black" fill-opacity="0.6" />
                </svg>
                  {service?.city}</p>
                <div className="text-gray-600 flex items-center gap-1 justify-between w-full">
                  <p className="text-black text-3xl font-normal">₹{service?.hourlyCharge}</p>

                  <button className="flex items-center bg-gradient text-white p-4 rounded-full m-0">
                    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g clip-path="url(#clip0_58_793)">
                        <path d="M8.5 0C3.81331 0 0 3.81331 0 8.5V16.4688C0 16.762 0.238 17 0.53125 17H8.5C13.1867 17 17 13.1867 17 8.5C17 3.81331 13.1867 0 8.5 0ZM9.03125 10.625H4.78125C4.488 10.625 4.25 10.387 4.25 10.0938C4.25 9.8005 4.488 9.5625 4.78125 9.5625H9.03125C9.3245 9.5625 9.5625 9.8005 9.5625 10.0938C9.5625 10.387 9.3245 10.625 9.03125 10.625ZM12.2188 7.4375H4.78125C4.488 7.4375 4.25 7.1995 4.25 6.90625C4.25 6.613 4.488 6.375 4.78125 6.375H12.2188C12.512 6.375 12.75 6.613 12.75 6.90625C12.75 7.1995 12.512 7.4375 12.2188 7.4375Z" fill="white" />
                      </g>
                      <defs>
                        <clipPath id="clip0_58_793">
                          <rect width="17" height="17" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>


                  </button>

                </div>
              </div>
            </div>
          )
        ))}
      </div>
    </div>

  );
};

export default Services;
