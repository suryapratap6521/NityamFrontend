import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchChats } from "../../../services/operations/chatApi";
import {
  setSelectedChat,
} from "../../../slices/chatSlice";
import { Box, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Loader from "../../Common/Loader";
import { getSender, getSenderFull } from "../../../config/chatlogics";
import GroupChatModal from "./ReusableComponents/GroupChatModal";
import SideDrawer from "./SideDrawer";

const MyChat = ({ fetchAgain }) => {
  const dispatch = useDispatch();
  const { loading, selectedChat, chats } = useSelector((state) => state.chat);
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchChats(token, dispatch);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [fetchAgain]);

  return (
    <div
      className={`rounded-lg overflow-hidden bg-[#FAFAFA] border border-[#00000020] p-4 lg:w-4/12 w-full lg:max-h-[72vh] lg:h-[72vh] max-h-[82vh] h-[82vh] ${!selectedChat ? 'block' : 'lg:block hidden'}`}
    >
      <div className="flex justify-between items-center mt-3 mb-5 w-full">
        <h1 className="md:text-3xl text-xl text-left font-semibold mb-1 text-[#8E2DE2]">
          Chats
        </h1>
        <GroupChatModal>
          <div className="flex justify-center items-center hover:bg-gray-200 p-2 px-6 rounded-lg cursor-pointer transition-all duration-300 bg-[#8E2DE220] w-fit mt-1 md:mt-0">
            <h3 className="md:text-base text-sm font-medium text-center text-[#8E2DE2] ">
              New Group Chat
            </h3>
            <AddIcon style={{ fontSize: "24px", fill: "#8E2DE2" }} />
          </div>
        </GroupChatModal>
      </div>
      <SideDrawer />
      <div className="flex flex-col w-full rounded-lg">
        {loading ? (
          <Loader />
        ) : chats.length === 0 ? (
          <Typography>No chats found</Typography>
        ) : (
          <div className="overflow-y-scroll space-y-2 mt-2">
            {chats.map((chat, index1) => {
              const otherUser = getSenderFull(user, chat.users);
              return (
                <button
                  key={chat._id}
                  onClick={() => dispatch(setSelectedChat(chat))}
                  className={`w-full gap-4 px-3 py-2 rounded-lg flex items-center ${selectedChat && selectedChat._id === chat._id ? 'bg-[#8E2DE220] text-[#8E2DE2]' : 'bg-transparent text-gray-800'}`}
                >
                  {chat.isGroupChat ? (
                    <div className="flex relative overflow-visible">
                      {chat.users.slice(0, 3).map((user, index) => (
                        <div
                          key={index}
                          className={`relative group ${index === 0 ? '' : 'ml-[-10px]'}`}
                          style={{ zIndex: 10 - index }}
                        >
                          <img
                            src={user.image || "/default-avatar.png"}
                            referrerPolicy="no-referrer"
                            alt={user.firstName}
                            className="w-8 h-8 rounded-full"
                          />
                          <div className={`absolute ${index1 === 0 ? 'bottom-[-100px]' : 'bottom-full'} mb-1 left-1/2 translate-x-0 scale-0 group-hover:scale-100 transition-transform bg-white text-gray-700 text-xs px-2 py-1 rounded whitespace-nowrap z-50 flex w-max shadow-md`}>
                            <div>
                              <img
                                src={user.image || "/default-avatar.png"}
                                referrerPolicy="no-referrer"
                                alt={user.firstName}
                                className="w-[80px] h-[80px] rounded-full"
                              />
                            </div>
                            <div className="ml-2 flex flex-col items-baseline my-auto">
                              <p className="text-sm font-semibold">{user.firstName} {user.lastName}</p>
                              <p className="text-sm">{user.email}</p>
                              <p className="text-sm italic">{user.community}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="relative group" style={{ zIndex: 10 }}>
                      <img
                        src={otherUser.image || "/default-avatar.png"}
                        referrerPolicy="no-referrer"
                        alt={otherUser.firstName}
                        className="mr-2"
                        style={{ width: '32px', height: '32px', borderRadius: '50%' }}
                      />
                      <div className={`absolute ${index1 === 0 ? 'bottom-[-100px]' : 'bottom-full'} mb-1 left-1/2 translate-x-0 scale-0 group-hover:scale-100 transition-transform bg-white text-gray-700 text-xs px-2 py-1 rounded whitespace-nowrap z-50 flex w-max shadow-md`}>
                        <div>
                          <img
                            src={otherUser.image || "/default-avatar.png"}
                            referrerPolicy="no-referrer"
                            alt={otherUser.firstName}
                            className="w-[80px] h-[80px] rounded-full"
                          />
                        </div>
                        <div className="ml-2 flex flex-col items-baseline my-auto">
                          <p className="text-sm font-semibold">{otherUser.firstName} {otherUser.lastName}</p>
                          <p className="text-sm">{otherUser.email}</p>
                          <p className="text-sm italic">{otherUser.community}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="flex flex-col flex-1 overflow-hidden">
                    <h6 className="text-lg font-semibold text-gray-800 truncate">
                      {chat.isGroupChat ? chat.chatName : getSender(user, chat.users)}
                    </h6>
                    {chat.latestMessage && (
                      <p className="text-sm text-gray-600 flex items-center gap-1 truncate">
                        <span className="font-bold">{chat.latestMessage.sender.firstName}:</span>
                        {chat.latestMessage.content.length > 50
                          ? chat.latestMessage.content.substring(0, 51) + '...'
                          : chat.latestMessage.content}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyChat;
