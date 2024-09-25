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
    <div style={{ backgroundImage: `url(${chat_bg})`, backgroundSize: 'cover', minHeight: '100vh', width: "100%" ,position:"fixed"}}>
      <Box display="flex" justifyContent="space-between" width="100%" height="88.2vh" p="10px">
        {user && <MyChat fetchAgain={fetchAgain} />}
        {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
      </Box>
    </div>
  );
};

export default ChatPage;
