import React from 'react'
import ScrollableFeed from "react-scrollable-feed";
import { Tooltip, Avatar } from '@mui/material'
import { isSameSender, isLastMessage, isSameSenderMargin, isSameUser } from "../../../../config/chatlogics";
import { useSelector } from "react-redux";
const ScrollableChat = ({ messages }) => {

  const { user } = useSelector((state) => state.profile);
  console.log("User Info:", messages.length);
  return (

    <ScrollableFeed>
      {messages && messages.map((m, i) => (<>
        <div style={{ display: "flex", alignItems: 'center' }} key={m._id}>
          {(isSameSender(messages, m, i, user._id) ||
            isLastMessage(messages, i, user._id)) && (
              <Tooltip label={m.sender.firstName + " " + m.sender.lastName} placement="bottom-start" hasArrow>
                <Avatar
                  mt="7px"
                  mr={1}
                  size="medium"
                  cursor="pointer"
                  name={m.sender.firstName + " " + m.sender.lastName}
                  src={m.sender.image}
                />
              </Tooltip>
            )}
          <span
            style={{
              backgroundColor: `${m.sender._id === user._id ? "#E0E0E060" : "#8E2DE220"
                }`,
              marginLeft: isSameSenderMargin(messages, m, i, user._id),
              marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
              borderRadius: "8px",
              padding: "10px 15px",
              maxWidth: "75%",
            }}
          >
            {m.content}
          </span>
        </div>
        {messages.length > 1 ? (<>
          <p class="text-sm text-gray-600 ">{(messages[i].sender._id != messages[i - 1].sender._id && i != 0) ? m.createdAt : null}</p>
        </>) : (<>
          <p class="text-sm text-gray-600 ">  {m.createdAt}</p>
        </>)}

      </>
      ))}
    </ScrollableFeed>
  )
}

export default ScrollableChat
