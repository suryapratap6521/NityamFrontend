// ⬇️ Top part same as yours...
import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedChat, setNotification } from "../../../../slices/chatSlice";
import { Box, Typography, IconButton, FormControl, Avatar } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import ScrollableChat from "./ScrollableChat";
import Loader from "../../../Common/Loader";
import io from "socket.io-client";
import axios from "axios";
import Lottie from "react-lottie";
import animationData from "../../../../animations/typing.json";
import useSound from 'use-sound';
import messageSound from '../../../../assests/sounds/message.mp3';
import ProfileModal from "./ProfileModal";
import UpdateGroupChatModal from "./UpdateGroupChatModal";
import { getSender, getSenderFull } from "../../../../config/chatlogics";
import { chatEndpoints } from "../../../../services/apis";

const ENDPOINT = "http://localhost:8080";
let socket;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const dispatch = useDispatch();
  const { selectedChat, notification } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const [otherUserStatus, setOtherUserStatus] = useState(null);
  const textareaRef = useRef(null);
  const [play] = useSound(messageSound);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData,
    rendererSettings: { preserveAspectRatio: "xMidYMid slice" },
  };

  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      setLoading(true);
      const { data } = await axios.get(`${ENDPOINT}/api/v1/message/${selectedChat._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(data.messages);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);

      const unseenMessages = data.messages.filter(
        (msg) => msg.sender._id !== user._id && !msg.seenBy.includes(user._id)
      );
      for (const msg of unseenMessages) {
        socket.emit("message seen", { messageId: msg._id, userId: user._id });
        await axios.post(`${ENDPOINT}/api/v1/message/seen`, { messageId: msg._id }, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const sendMessage = async (event) => {
    if ((event.key === "Enter" || event.type === 'click') && newMessage.trim()) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const { data } = await axios.post(chatEndpoints.CREATE_MESSAGE, {
          content: newMessage,
          chatId: selectedChat,
        }, {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        setNewMessage("");
        if (textareaRef.current) textareaRef.current.style.height = "auto";
        setMessages((prev) => [...prev, data.message]);
        socket.emit("new Message", data.message);
        play();
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
    socket.on("online-status-changed", ({ userId, isOnline, lastSeen }) => {
      if (selectedChat && !selectedChat.isGroupChat) {
        const receiver = getSenderFull(user, selectedChat.users);
        if (receiver._id === userId) {
          setOtherUserStatus({ lastSeen: isOnline ? "Online" : lastSeen });
        }
      }
    });
    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    if (selectedChat) {
      socket.emit("join chat", selectedChat._id);
      fetchMessages();
      if (!selectedChat.isGroupChat) {
        const receiver = getSenderFull(user, selectedChat.users);
        axios.get(`${ENDPOINT}/api/v1/profile/status/${receiver._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        }).then(res => setOtherUserStatus(res.data));
      }
    }
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (!selectedChat || selectedChat._id !== newMessageRecieved.chat._id) {
        if (!notification.find((n) => n._id === newMessageRecieved._id)) {
          dispatch(setNotification([newMessageRecieved, ...notification]));
        }
      } else {
        setMessages((prev) => [...prev, newMessageRecieved]);
        socket.emit("message delivered", {
          messageId: newMessageRecieved._id,
          userId: user._id,
        });
        axios.post(`${ENDPOINT}/api/v1/message/delivered`, { messageId: newMessageRecieved._id }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (newMessageRecieved.sender._id !== user._id) {
          socket.emit("message seen", {
            messageId: newMessageRecieved._id,
            userId: user._id,
          });
          axios.post(`${ENDPOINT}/api/v1/message/seen`, { messageId: newMessageRecieved._id }, {
            headers: { Authorization: `Bearer ${token}` },
          });
        }
      }
    });

    socket.on("message seen updated", ({ messageId, userId }) => {
      setMessages(prev => prev.map(msg =>
        msg._id === messageId && !msg.seenBy.includes(userId)
          ? { ...msg, seenBy: [...msg.seenBy, userId], status: "seen" }
          : msg
      ));
    });
    return () => {
      socket.off("message recieved");
      socket.off("message seen updated");
    };
  }, [messages, notification]);

  const typingHandler = (e) => {
    const textarea = textareaRef.current;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 72) + 'px';
    setNewMessage(e.target.value);

    if (!socketConnected) return;
    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    const lastTypingTime = new Date().getTime();
    setTimeout(() => {
      if (new Date().getTime() - lastTypingTime >= 3000 && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, 3000);
  };

  const handleBackButtonClick = () => dispatch(setSelectedChat(""));

  return selectedChat ? (
    <Box className="flex flex-col h-full">
      <Box className="sticky top-0 z-10 flex items-center gap-3 px-4 py-2 bg-white border-b shadow-sm">
        <IconButton onClick={handleBackButtonClick}><CloseIcon /></IconButton>
        {!selectedChat.isGroupChat ? (
          <>
            <Avatar
              src={getSenderFull(user, selectedChat.users)?.image}
              alt="avatar"
              sx={{ width: 40, height: 40 }}
            />
            <Box>
              <Typography variant="subtitle1" fontWeight={600}>
                {getSender(user, selectedChat.users)}
              </Typography>
              <Typography variant="body2" className="text-gray-500 text-sm">
                {otherUserStatus?.lastSeen === "Online"
                  ? "Online"
                  : otherUserStatus?.lastSeen
                    ? `Last seen at ${new Date(otherUserStatus.lastSeen).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                    : ""}
              </Typography>
            </Box>
          </>
        ) : (
          <Typography variant="h6" className="font-semibold">
            {selectedChat.chatName.toUpperCase()}
          </Typography>
        )}
        <Box className="ml-auto">
          {!selectedChat.isGroupChat ? null : (
            <UpdateGroupChatModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} fetchMessages={fetchMessages} />
          )}
        </Box>
      </Box>

      <Box className="flex flex-col justify-end w-full grow bg-gray-50 overflow-hidden">
        {loading ? <Loader /> : <ScrollableChat messages={messages} />}
        <FormControl onKeyDown={sendMessage} className="bg-white border-t p-3">
          {istyping && <Box className="ml-3 w-[60px] h-[30px]"> <Lottie options={defaultOptions} height={30} width={60} /> </Box>}
          <Box className="flex items-center gap-2">
            <textarea
              ref={textareaRef}
              placeholder="Type a message..."
              value={newMessage}
              onChange={typingHandler}
              rows={1}
              className="w-full rounded-2xl p-3 border text-sm focus:outline-none resize-none bg-gray-100"
              style={{ maxHeight: '72px' }}
            />
            <button
              onClick={sendMessage}
              className="p-3 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-md"
            >
              ➤
            </button>
          </Box>
        </FormControl>
      </Box>
    </Box>
  ) : (
    <Box className="flex items-center justify-center h-full">
      <Typography variant="h6" className="text-gray-400">
        Click on a user to start chatting
      </Typography>
    </Box>
  );
};

export default SingleChat;
