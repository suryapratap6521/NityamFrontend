import React, { useState } from 'react';
import MyChat from '../Components/Core/Chat/MyChat';
import chat_bg from "../assests/chat_bg.jpg";
import ChatBox from '../Components/Core/Chat/ChatBox';
import { Box } from "@mui/material";
import { useSelector } from "react-redux";

const ChatPage = () => {
  const [fetchAgain, setFetchAgain] = useState(false);
  const { user } = useSelector((state) => state.profile);

  return (
    <div style={{}}>
      <div className="flex justify-between w-full p-2">
        {user && <MyChat fetchAgain={fetchAgain} />}
        {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
      </div>
    </div>
  );
};

export default ChatPage;
