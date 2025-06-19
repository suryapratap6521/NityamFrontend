import React from 'react'
import ScrollableFeed from "react-scrollable-feed";
import { Tooltip, Avatar } from '@mui/material'
import { isSameSender, isLastMessage, isSameSenderMargin, isSameUser } from "../../../../config/chatlogics";
import { useSelector } from "react-redux";
const ScrollableChat = ({ messages }) => {

  const { user } = useSelector((state) => state.profile);
  console.log("User Info:", user);
  function formatDateTime(dateTimeString) {
    const date = new Date(dateTimeString);
    const now = new Date();

    // Convert to local time
    const options = { hour: '2-digit', minute: '2-digit', hour12: true };
    let time = date.toLocaleTimeString('en-US', options).replace(':', ' ');

    // Ensure leading zero for hour
    time = time.replace(/^(\d) /, '0$1 ');

    // Check if it's the same date
    if (date.toDateString() === now.toDateString()) {
      return time; // Only return time if the date is the same
    } else {
      const day = date.getDate();
      const month = date.toLocaleString('en-US', { month: 'short' });
      return `${day} ${month} ${time}`;
    }
  }
  return (

    <>
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
              backgroundColor: `${m.sender._id === user._id ? "#E0E0E060" : "#695ea820"
                }`,
              marginLeft: isSameSenderMargin(messages, m, i, user._id),
              marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
              borderRadius: "8px",
              padding: "10px 15px",
              maxWidth: "75%",
              wordWrap: 'break-word',
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
              display: 'inline-block'
            }}
          >
            {m.content}
          </span>
        </div>
        {messages.length > 1 && i != messages.length - 1 ? (<>
          {/* <p class="text-sm text-gray-600 dddd ">{(messages[i].sender._id != messages[i - 1].sender._id && i != 0) ? m.createdAt : null}</p> */}
          <p class={`text-sm text-gray-600 mt-1 ${m.sender._id == user._id ? 'text-right' : 'text-left'}`}>{(messages[i].sender._id != messages[i + 1].sender._id && i != 0) ? formatDateTime(m.createdAt) : null}</p>
        </>) : (<>
          <p class={`text-sm text-gray-600 mt-1 ${m.sender._id == user._id ? 'text-right' : 'text-left'}`}>{formatDateTime(m.createdAt)}</p>
        </>)}

      </>
      ))}
    </>
  )
}

export default ScrollableChat
