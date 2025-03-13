import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedChat } from "../../../../slices/chatSlice";
import { Box, Typography, IconButton, FormControl, TextField } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import ProfileModal from "./ProfileModal";
import { getSender, getSenderFull } from "../../../../config/chatlogics";
import UpdateGroupChatModal from "./UpdateGroupChatModal";
import Loader from "../../../Common/Loader";
import { chatEndpoints } from "../../../../services/apis";
import axios from "axios";
import { toast } from "react-hot-toast";
import "../styles.css";
import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client";
import Lottie from "react-lottie";
import animationData from "../../../../animations/typing.json";
import { setNotification } from "../../../../slices/chatSlice";
const ENDPOINT = "https://nityambackend.onrender.com";
var socket, selectedChatCompare;



const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const dispatch = useDispatch();
  const { selectedChat, notification } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState();
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);


  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };


  const handleBackButtonClick = () => {
    dispatch(setSelectedChat(""));
  };

  const fetchMessages = async () => {
    if (!selectedChat) {
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      setLoading(true);

      const { data } = await axios.get(`https://nityambackend.onrender.com/api/v1/message/${selectedChat._id}`, config);
      setMessages(data.messages);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);

    } catch (error) {
      console.log(error);
      toast.error("Error in fetching the message");
    }
  }



  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id)
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };
        const { data } = await axios.post(
          chatEndpoints.CREATE_MESSAGE,
          {
            content: newMessage,
            chatId: selectedChat,
          },
          config
        );
        setNewMessage(""); // Move this line here
        socket.emit("new Message", data.message);
        setMessages([...messages, data.message]); // Update messages state
      } catch (error) {
        console.log(error);
        toast.error("Error in sending the messages");
      }
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true))
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false))
  }, [])


  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat])


  console.log(notification, "------------>")
  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          dispatch(setNotification([newMessageRecieved, ...notification]));

        }
      }
      else {
        setMessages([...messages, newMessageRecieved]);
      }
    })
  })


  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  }



  return (
    <div>
      {selectedChat ? (
        <>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            px={2}
            maxHeight={80}
          >
            <Box display="flex">
              <IconButton
                display={{ xs: "flex", md: "none" }}
                onClick={handleBackButtonClick}
              >
                <CloseIcon />
              </IconButton>
              {selectedChat.isGroupChat ? (
                <div class="flex relative items-center mr-1">
                  {selectedChat.users.slice(0, 4).map((user, index) => (
                    <img
                      key={index}
                      src={user.image}
                      alt={user.firstName}
                      class={`relative ${index === 0 ? '' : `ml-[-10px]`
                        }`}
                      style={{ width: '40px', height: '40px', borderRadius: '50%', zIndex: 10 - index }}
                    />
                  ))}
                </div>
              ) : (
                <img
                  src={
                    selectedChat.latestMessage &&
                    selectedChat.latestMessage.sender &&
                    selectedChat.latestMessage.sender.image
                  }
                  alt={
                    selectedChat.latestMessage &&
                    selectedChat.latestMessage.sender &&
                    selectedChat.latestMessage.sender.firstName
                  }
                  class="mr-2"
                  style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                />
              )}
              <div className="flex flex-col">
                <h6 className="text-lg font-semibold text-gray-800 flex items-center">
                  {!selectedChat.isGroupChat
                    ? getSender(user, selectedChat.users)
                    : selectedChat.chatName.toUpperCase()}
                </h6>
                <p class="text-sm text-gray-600 "> {selectedChat.isGroupChat ? `${selectedChat.users.length} Members` : null}</p>
              </div>
            </Box>
            {!selectedChat.isGroupChat && (
              <ProfileModal user={getSenderFull(user, selectedChat.users)} />
            )}
            {selectedChat.isGroupChat && (
              <UpdateGroupChatModal
                fetchAgain={fetchAgain}
                setFetchAgain={setFetchAgain}
                fetchMessages={fetchMessages}
              />
            )}
          </Box>
          <div
            className="flex flex-col justify-end p-3 w-full lg:h-[60vh] h-[72vh]"

          >
            {loading ? (<Loader />) : (<div className="messages">
              <ScrollableChat messages={messages}></ScrollableChat>
            </div>)}
            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
              {istyping ? (
                <div>
                  <Lottie
                    options={defaultOptions}
                    // height={50}
                    width={70}

                    style={{ marginBottom: 15, borderRadius: "10px", marginLeft: 0 }}
                  />
                </div>
              ) : (
                <></>
              )}

              <div className="w-full flex items-center justify-between">
                <div className="w-10/12 flex items-center border border-gray-300 rounded-full bg-white p-3 gap-2">
                  <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_48_574)">
                      <path d="M25.9064 20.4061L24.3963 16.0113C25.1242 14.5233 25.5088 12.8685 25.5114 11.2034C25.5159 8.30821 24.3958 5.57074 22.3573 3.49531C20.3184 1.41948 17.6015 0.25095 14.707 0.205095C11.7056 0.157665 8.88439 1.29933 6.76341 3.42026C4.71824 5.46537 3.58389 8.1615 3.54799 11.0426C1.53228 12.5603 0.342526 14.9264 0.346436 17.4538C0.348315 18.6365 0.61451 19.8121 1.11892 20.8752L0.0787682 23.9022C-0.100033 24.4225 0.0305768 24.9875 0.419663 25.3766C0.693475 25.6505 1.05448 25.7963 1.42574 25.7963C1.58194 25.7963 1.73997 25.7705 1.8941 25.7175L4.92112 24.6773C5.98422 25.1818 7.15986 25.4479 8.34255 25.4498H8.35515C10.9201 25.4497 13.3043 24.2293 14.8164 22.1642C16.39 22.1227 17.9469 21.7418 19.3544 21.0533L23.7492 22.5634C23.9282 22.6252 24.1163 22.6568 24.3057 22.657C24.7469 22.657 25.1759 22.4837 25.5013 22.1582C25.9636 21.6959 26.1188 21.0245 25.9064 20.4061ZM8.35504 23.9022H8.34494C7.29813 23.9006 6.25859 23.6426 5.33889 23.156C5.24536 23.1065 5.14267 23.0767 5.03718 23.0685C4.93169 23.0603 4.82563 23.0738 4.72556 23.1082L1.62165 24.1747L2.68821 21.0709C2.72259 20.9708 2.73609 20.8647 2.72786 20.7592C2.71963 20.6537 2.68986 20.5511 2.64038 20.4575C2.15379 19.5378 1.89572 18.4983 1.8941 17.4514C1.89151 15.7676 2.54653 14.1716 3.69201 12.9765C4.06616 15.2574 5.15324 17.3592 6.83826 19.0143C8.51084 20.6571 10.6133 21.7031 12.8818 22.045C11.684 23.2257 10.0693 23.9022 8.35504 23.9022ZM24.4069 21.0639C24.3629 21.1079 24.3107 21.1199 24.252 21.0997L19.5472 19.483C19.4471 19.4486 19.3411 19.4351 19.2356 19.4434C19.1301 19.4516 19.0274 19.4814 18.9339 19.5309C17.5906 20.2415 16.0726 20.6184 14.544 20.6207H14.5294C9.40744 20.6207 5.1767 16.46 5.09555 11.3393C5.05467 8.76036 6.03566 6.33663 7.85774 4.51454C9.67983 2.69246 12.104 1.71183 14.6825 1.75245C19.8082 1.83375 23.9718 6.07231 23.9638 11.201C23.9614 12.7296 23.5846 14.2476 22.874 15.5908C22.8245 15.6843 22.7948 15.787 22.7865 15.8925C22.7783 15.998 22.7918 16.1041 22.8262 16.2041L24.4428 20.9089C24.463 20.9678 24.4509 21.02 24.4069 21.0639Z" fill="black" />
                      <path d="M19.139 7.08459H9.91912C9.49174 7.08459 9.14531 7.43108 9.14531 7.8584C9.14531 8.28577 9.49179 8.6322 9.91912 8.6322H19.139C19.5663 8.6322 19.9128 8.28572 19.9128 7.8584C19.9128 7.43108 19.5663 7.08459 19.139 7.08459ZM19.139 10.2671H9.91912C9.49174 10.2671 9.14531 10.6136 9.14531 11.0409C9.14531 11.4682 9.49179 11.8147 9.91912 11.8147H19.139C19.5663 11.8147 19.9128 11.4682 19.9128 11.0409C19.9128 10.6136 19.5663 10.2671 19.139 10.2671ZM15.59 13.4495H9.91907C9.49169 13.4495 9.14526 13.796 9.14526 14.2233C9.14526 14.6507 9.49174 14.9971 9.91907 14.9971H15.5899C16.0173 14.9971 16.3637 14.6506 16.3637 14.2233C16.3637 13.796 16.0173 13.4495 15.59 13.4495Z" fill="black" />
                    </g>
                    <defs>
                      <clipPath id="clip0_48_574">
                        <rect width="26" height="26" fill="white" />
                      </clipPath>
                    </defs>

                  </svg>
                  <input type='text' placeholder="Say Something..." onChange={typingHandler} value={newMessage} className="w-10/12 bg-none" />
                </div>

                <button onclick={sendMessage} className="m-0 1/12 p-3 rounded-full bg-gradient"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M1.3049 3.54199C1.21905 3.19965 1.23324 2.83987 1.3458 2.50536C1.45836 2.17085 1.66456 1.87567 1.9399 1.65487C2.21524 1.43407 2.54816 1.29693 2.89913 1.25973C3.25011 1.22252 3.60438 1.28682 3.9199 1.44499L21.7299 10.35C22.0365 10.503 22.2945 10.7384 22.4748 11.0299C22.6551 11.3214 22.7506 11.6573 22.7506 12C22.7506 12.3427 22.6551 12.6786 22.4748 12.9701C22.2945 13.2615 22.0365 13.497 21.7299 13.65L3.9199 22.555C3.60438 22.7132 3.25011 22.7775 2.89913 22.7403C2.54816 22.7031 2.21524 22.5659 1.9399 22.3451C1.66456 22.1243 1.45836 21.8291 1.3458 21.4946C1.23324 21.1601 1.21905 20.8003 1.3049 20.458L3.1699 13L13.9999 12L3.1699 11L1.3049 3.54199Z" fill="white" />
                </svg>
                </button>
              </div>

            </FormControl>
          </div>

        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          height="100%"
        >
          <h1 className="md:text-xl text-lg text-left font-medium mb-1 text-gray-400">
            Click on a user to start chatting
          </h1>
        </Box>
      )}
    </div>
  );
};

export default SingleChat;
