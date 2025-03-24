import React, { useState } from 'react';
import MyChat from '../Components/Core/Chat/MyChat';
import chat_bg from "../assests/chat_bg.jpg";
import ChatBox from '../Components/Core/Chat/ChatBox';
import { Box } from "@mui/material";
import { useSelector } from "react-redux";

const ChatPage = () => {
  const [fetchAgain, setFetchAgain] = useState(false);
  const { user } = useSelector((state) => state.profile);
  console.log(user)

  return (
    <div className=" md:mb-0 mb-14 bg-white flex justify-around w-full lg:flex-row flex-col p-4">

      <MyChat fetchAgain={fetchAgain} />
      <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />

    </div>
  );
};

export default ChatPage;
