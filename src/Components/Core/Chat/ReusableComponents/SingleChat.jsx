import React,{useState,useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedChat } from "../../../../slices/chatSlice";
import { Box, Typography, IconButton,FormControl,TextField } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ProfileModal from "./ProfileModal";
import { getSender, getSenderFull } from "../../../../config/chatlogics";
import UpdateGroupChatModal from "./UpdateGroupChatModal";
import Loader from "../../../Common/Loader";
import { chatEndpoints } from "../../../../services/apis";
import axios from "axios";
import { toast } from "react-hot-toast";
import  "../styles.css";
import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client";
import Lottie from "react-lottie";
import animationData from "../../../../animations/typing.json";
import { setNotification } from "../../../../slices/chatSlice";
const ENDPOINT = "http://localhost:8080";
var socket,selectedChatCompare; 



const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const dispatch = useDispatch();
  const { selectedChat,notification } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.profile);
  const {token}=useSelector((state)=>state.auth);
  const [messages,setMessages]=useState([]);
  const [loading,setLoading]=useState(false);
  const [newMessage,setNewMessage]=useState();
  const [socketConnected,setSocketConnected]=useState(false);
  const [typing,setTyping]=useState(false);
  const [istyping,setIsTyping]=useState(false);


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

  const fetchMessages=async()=>{
    if(!selectedChat){
        return;
    }
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        setLoading(true);

        const {data}=await axios.get(`http://localhost:8080/api/v1/message/${selectedChat._id}`,config);
        setMessages(data.messages);
        setLoading(false);
        socket.emit("join chat",selectedChat._id);

    } catch (error) {
        console.log(error);
        toast.error("Error in fetching the message");
    }
  }


  
  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
        socket.emit("stop typing",selectedChat._id)
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
    socket.emit("setup",user);
    socket.on("connected",()=>setSocketConnected(true))
    socket.on("typing",()=>setIsTyping(true));
    socket.on("stop typing",()=>setIsTyping(false))
  }, [])


  useEffect(() => {
    fetchMessages();
    selectedChatCompare=selectedChat;
  }, [selectedChat])


  console.log(notification,"------------>")
  useEffect(() => {
    socket.on("message recieved",(newMessageRecieved)=>{
        if(
            !selectedChatCompare || 
            selectedChatCompare._id !== newMessageRecieved.chat._id
        ){
            if(!notification.includes(newMessageRecieved)){
                dispatch(setNotification([newMessageRecieved,...notification]));
                
            }
        }
        else{
            setMessages([...messages,newMessageRecieved]);
        }
    })
  })
 

  const typingHandler=(e)=>{
    setNewMessage(e.target.value);

    if(!socketConnected) return;

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
          >
            <Box display="flex">
              <IconButton
                display={{ xs: "flex", md: "none" }}
                onClick={handleBackButtonClick}
              >
                <ArrowBackIcon />
              </IconButton>
              <Typography variant="h4" fontFamily="Work sans">
                {!selectedChat.isGroupChat
                  ? getSender(user, selectedChat.users)
                  : selectedChat.chatName.toUpperCase()}
              </Typography>
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
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="flex-end"
            p={3}
            backgroundColor="#E8E8E8"
            width="100%"
            height="73vh"
            borderRadius="10px"
            overflowY="hidden"
          >
            {loading ? (<Loader />):(<div  className="messages">
                <ScrollableChat messages={messages}></ScrollableChat>
            </div>)}
            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
            {istyping ? (
                <div>
                  <Lottie
                    options={defaultOptions}
                    // height={50}
                    width={70}

                    style={{ marginBottom: 15,borderRadius:"10px", marginLeft: 0 }}
                  />
                </div>
              ) : (
                <></>
              )}
            <TextField variant="filled" placeholder="Enter a message..." onChange={typingHandler} value={newMessage} />
            </FormControl>
          </Box>
         
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          height="100%"
        >
          <Typography variant="h4" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Typography>
        </Box>
      )}
    </div>
  );
};

export default SingleChat;
