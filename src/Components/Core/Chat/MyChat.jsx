import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchChats } from "../../../services/operations/chatApi";
import {
  setLoading,
  setSelectedChat,
  setChats,
} from "../../../slices/chatSlice";
import chat_bg from "../../../assests/chat_bg.jpg";
import { Box, Button, Typography, Stack, Avatar } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Loader from "../../Common/Loader";
import { getSender } from "../../../config/chatlogics";
import GroupChatModal from "./ReusableComponents/GroupChatModal";

const MyChat = ({ fetchAgain }) => {
  const dispatch = useDispatch();
  const { loading, selectedChat, chats } = useSelector((state) => state.chat);
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);

  console.log(chats, "------->mychat chatss");
  useEffect(() => {
    console.log("------->mychat chatss")
    const fetchData = async () => {

      try {
        await fetchChats(token, dispatch);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [token, dispatch, fetchAgain]);

  return (
    <div
      className={`rounded-lg overflow-hidden bg-[#FAFAFA] border border-[#00000020] p-4 lg:w-4/12 w-full lg:max-h-[72vh] lg:h-[72vh] max-h-[82vh] h-[82vh] ${selectedChat == '' || selectedChat == null ? 'block' : 'lg:block hidden'}`}

    >
      <div
        className="flex justify-between items-center mt-3 mb-5 w-full"

      >
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
      <div
        className="flex flex-col w-full rounded-lg"

      >
        {chats ? (
          <div class="overflow-y-scroll overflow-x-hidden space-y-2 mt-2">
            {chats.map((chat) => (
              <button
                key={chat._id}
                onClick={() => dispatch(setSelectedChat(chat))}
                class={`w-full gap-4 px-3 py-2 rounded-lg overflow-hidden flex items-center ${selectedChat && selectedChat._id === chat._id
                  ? 'bg-[#8E2DE220] text-[#8E2DE2]'
                  : 'bg-transparent text-gray-800'
                  }`}
              >
                {chat.isGroupChat ? (
                  <div class="flex relative">
                    {chat.users.slice(0, 3).map((user, index) => (
                      <img
                        key={index}
                        src={user.image}
                        alt={user.firstName}
                        class={`relative ${index === 0 ? '' : `ml-[-10px]`
                          }`}
                        style={{ width: '32px', height: '32px', borderRadius: '50%', zIndex: 10 - index }}
                      />
                    ))}
                  </div>
                ) : (
                  <img
                    src={
                      chat.latestMessage &&
                      chat.latestMessage.sender &&
                      chat.latestMessage.sender.image
                    }
                    alt={
                      chat.latestMessage &&
                      chat.latestMessage.sender &&
                      chat.latestMessage.sender.firstName
                    }
                    class="mr-2"
                    style={{ width: '32px', height: '32px', borderRadius: '50%' }}
                  />
                )}
                <div>
                  <h6 className="text-lg font-semibold text-gray-800 flex items-center">
                    {!chat.isGroupChat
                      ? getSender(user, chat.users)
                      : chat.chatName}
                  </h6>
                  {chat.latestMessage && (
                    <p class="text-sm text-gray-600 flex items-center gap-1 max-w-[64%] overflow-hidden whitespace-nowrap truncate">
                      <span class="font-bold">{chat.latestMessage.sender.firstName}</span>
                      {chat.latestMessage.content.length > 50
                        ? chat.latestMessage.content.substring(0, 51) + '...'
                        : chat.latestMessage.content}
                    </p>
                  )}
                </div>
              </button>
            ))}
          </div>
        ) : (
          <Loader />
        )}
      </div>
    </div>
  );
};

export default MyChat;
