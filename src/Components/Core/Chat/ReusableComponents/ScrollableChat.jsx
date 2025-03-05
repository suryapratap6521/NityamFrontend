import React from 'react'
import ScrollableFeed from "react-scrollable-feed";
import { Tooltip,Avatar } from '@mui/material'
import { isSameSender,isLastMessage,isSameSenderMargin,isSameUser } from "../../../../config/chatlogics";
import { useSelector } from "react-redux";
const ScrollableChat = ({messages}) => {

    const {user}=useSelector((state)=>state.profile);
   
  return (
    
    <ScrollableFeed>
        {messages && messages.map((m,i)=>(
            <div style={{display:"flex"}} key={m._id}>
                {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <Tooltip label={m.sender.firstName + " "+m.sender.lastName} placement="bottom-start" hasArrow>
                <Avatar
                  mt="7px"
                  mr={1}
                  size="medium"
                  cursor="pointer"
                  name={m.sender.firstName + " "+m.sender.lastName }
                  src={m.sender.image}
                />
              </Tooltip>
            )}
            <span
              style={{
                backgroundColor: `${
                  m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                }`,
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
              }}
            >
              {m.content}
            </span>
            </div>
        ))}
    </ScrollableFeed>
  )
}

export default ScrollableChat
