import React, { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import { getServices } from "../../../services/operations/serviceApi";
import { useDispatch, useSelector } from "react-redux";
import VerifiedIcon from "@mui/icons-material/Verified";
import AddServiceCard from "./AddServiceCard";
import CreateService from "./CreateService"; // Modal component
import { Link } from "react-router-dom";

const Services = () => {
  const dispatch = useDispatch();
  const [services, setServices] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const handleGetAllServices = async () => {
      try {
        const response = await getServices(token, dispatch);
        console.log(response,"-->");
        setAllUsers(response.data.allUsers);
        setServices(response.data.userMadeServices);
      } catch (error) {
        console.error(error);
      }
    };

    handleGetAllServices();
  }, [token, dispatch]);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);
  console.log(services);
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {/* Updated AddServiceCard without Link */}
        <AddServiceCard onClick={handleOpenModal} />

        {/* Render list of service providers (allUsers) */}
        {allUsers.map(
          (users) =>
            users?.communityDetails?._id === user?.communityDetails?._id &&
            user?.profession &&
            user?._id !== users?.id && (
              <div key={users._id} className="bg-white shadow-lg rounded-lg overflow-hidden">
                <img
                  className="w-full h-32 sm:h-48 object-cover"
                  src={users.image}
                  alt="Profile"
                />
                <div className="p-4">
                  <h1 className="text-lg font-semibold text-gray-800 flex items-center">
                    <b>{users?.profession?.toUpperCase()}</b>
                  </h1>
                  <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                    {users.firstName} {users.lastName}
                    <VerifiedIcon className="text-blue-500 ml-2" />
                  </h2>
                  <p className="text-gray-600">Phone: {users.phoneNumber}</p>
                  <p className="text-gray-600">
                    Community: {users?.communityDetails?.communityName}
                  </p>
                  <p className="text-gray-600">City: {users?.city}</p>
                  <p className="text-gray-600">Charge: ₹{users?.hourlyCharge}</p>
                  <div className="flex justify-end mt-4">
                    <button className="flex items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                      <span className="h-5 w-5 mr-2">
                        {/* Replace ChatIcon if needed */}
                      </span>
                      Chat
                    </button>
                  </div>
                </div>
              </div>
            )
        )}

        {/* Render list of services created by users */}
        {services.map(
          (service) =>
            service?.createdBy?.communityDetails?._id === user?.communityDetails?._id && (
              <div key={service._id} className="bg-white shadow-lg rounded-lg overflow-hidden">
                {service.image ? (
                  <img
                    className="w-full h-32 sm:h-48 object-cover"
                    src={service.image}
                    alt="Service"
                  />
                ) : (
                  <img
                    className="w-full h-32 sm:h-48 object-cover"
                    src={`https://api.dicebear.com/5.x/initials/svg?seed=${service.firstName} ${service.lastName}`}
                    alt="Service"
                  />
                )}
                <div className="p-4">
                  <h1 className="text-lg font-semibold text-gray-800 flex items-center">
                    <b>{service?.profession?.toUpperCase() || "N/A"}</b>
                  </h1>
                  <h2 className="text-lg font-semibold text-gray-800">
                    {service.firstName} {service.lastName}
                  </h2>
                  <p className="text-gray-600">Phone: {service.phoneNumber}</p>
                  <p className="text-gray-600">
                    Community: {service?.createdBy?.communityDetails?.communityName}
                  </p>
                  <p className="text-gray-600">City: {service.createdBy.city}</p>
                  <p className="text-gray-600">Charge: ₹{service.price} per day</p>
                  <p className="text-gray-600">Address: {service.address}</p>
                  <div className="flex justify-around mt-16 ml-8">
                    <Typography variant="body2" className="text-gray-500 m-4">
                      <span>created by: </span>
                      <span className="text-black">
                        <b>
                          {service.createdBy.firstName} {service.createdBy.lastName}
                        </b>
                      </span>
                    </Typography>
                  </div>
                </div>
              </div>
            )
        )}
      </div>

      {/* CreateService Modal */}
      <CreateService open={openModal} onClose={handleCloseModal} />
    </div>
  );
};

export default Services;
