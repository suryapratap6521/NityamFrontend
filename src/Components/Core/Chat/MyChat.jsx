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
    <Box
      display={{ xs: selectedChat ? "none" : "flex", md: "flex" }}
      flexDirection="column"
      alignItems="center"
      p={3}
      height="80vh"
      height="85vh"
      p="10px"
      backgroundColor="white"
      width={{ xs: "100%", md: "31%" }}
      borderRadius="10px"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ xs: "24px", md: "30px" }}
        fontFamily="Work Sans"
        mt={3}
        mr={3}
        display="flex"
        width="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <GroupChatModal>
          <Button
            variant="contained"
            fontSize={{ xs: "14px", md: "17px" }}
            endIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        p={3}
        bg="#F8F8F8"
        width="100%"
        height="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowY="scroll" spacing={2}>
            {chats.map((chat) => (
              <Box
                key={chat._id}
                component={Button}
                onClick={() => dispatch(setSelectedChat(chat))}
                cursor="pointer"
                sx={{
                  backgroundColor:
                    selectedChat && selectedChat._id === chat._id
                      ? "#38B2AC"
                      : "#E8E8E8",
                  color:
                    selectedChat && selectedChat._id === chat._id
                      ? "white"
                      : "black",
                }}
                px={3}
                py={2}
                width="100%"
                borderRadius="lg"
                display="flex"
                alignItems="center"
              >
                {chat.isGroupChat ? (
                  <Box sx={{ display: "flex", position: "relative" }}>
                    {chat.users.slice(0, 4).map((user, index) => (
                      <Avatar
                        key={index}
                        src={user.image}
                        alt={user.firstName}
                        sx={{
                          position: "relative",
                          
                          zIndex: index,
                          left: index === 0 ? 0 : `${index * -15}px`,
                        }}
                      />
                    ))}
                  </Box>
                ) : (
                  <Avatar
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
                    sx={{ mr: 2 }}
                  />
                )}
                <Box>
                  <Typography variant="h6">
                    <b>
                      {!chat.isGroupChat
                        ? getSender(user, chat.users)
                        : chat.chatName}
                    </b>
                  </Typography>
                  {chat.latestMessage && (
                    <Typography variant="body1">
                      <b>
                        {chat.latestMessage.sender.firstName}:{" "}
                      </b>
                      {chat.latestMessage.content.length > 50
                        ? chat.latestMessage.content.substring(0, 51) + "..."
                        : chat.latestMessage.content}
                    </Typography>
                  )}
                </Box>
              </Box>
            ))}
          </Stack>
        ) : (
          <Loader />
        )}
      </Box>
    </Box>
  );
};

export default MyChat;
