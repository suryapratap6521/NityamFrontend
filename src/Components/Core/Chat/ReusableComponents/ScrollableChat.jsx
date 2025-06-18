// ✅ ScrollableChat.jsx - Production UI & Functional
import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Avatar, Tooltip } from '@mui/material';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import DoneIcon from '@mui/icons-material/Done';
import {
  isSameSender,
  isLastMessage,
  isSameSenderMargin,
  isSameUser
} from '../../../../config/chatlogics';

const ScrollableChat = ({ messages }) => {
  const { user } = useSelector((state) => state.profile);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderTick = (msg) => {
    if (msg.sender._id !== user._id) return null;
    if (msg.seenBy?.length > 0)
      return <DoneAllIcon fontSize="small" sx={{ color: '#25D366', ml: 1 }} />;
    if (msg.deliveredTo?.length > 0)
      return <DoneAllIcon fontSize="small" sx={{ color: 'gray', ml: 1 }} />;
    return <DoneIcon fontSize="small" sx={{ color: 'gray', ml: 1 }} />;
  };

  const sortedMessages = [...messages].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  return (
    <div className="px-3 py-2 overflow-y-auto flex flex-col gap-1 h-full">
      {sortedMessages.map((m, i) => (
        <div key={m._id} className="flex items-end gap-1">
          {(isSameSender(sortedMessages, m, i, user._id) || isLastMessage(sortedMessages, i, user._id)) && (
            <Tooltip
              title={`${m.sender.firstName} ${m.sender.lastName}`}
              arrow
              placement="bottom-start"
            >
              <Avatar
                alt={m.sender.firstName}
                src={m.sender.image}
                sx={{ width: 30, height: 30, marginRight: '6px' }}
              />
            </Tooltip>
          )}

          <div
            className={`rounded-xl px-4 py-2 text-sm shadow-sm max-w-[75%] whitespace-pre-wrap break-words
            ${m.sender._id === user._id ? 'bg-gray-200 ml-auto text-right' : 'bg-purple-100 text-left'}`}
            style={{
              marginLeft: isSameSenderMargin(sortedMessages, m, i, user._id),
              marginTop: isSameUser(sortedMessages, m, i, user._id) ? 3 : 10,
            }}
          >
            {m.content}
            <div className="text-xs text-gray-500 flex items-center justify-end mt-1">
              <span>{formatTime(m.createdAt)}</span>
              {renderTick(m)}
            </div>
          </div>
        </div>
      ))}
      <div ref={scrollRef} />
    </div>
  );
};

export default ScrollableChat;
