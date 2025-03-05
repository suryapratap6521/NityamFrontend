import React from 'react';
import { useSelector } from 'react-redux';
import { Box } from '@mui/material';
import SingleChat from "./ReusableComponents/SingleChat";

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
    const { selectedChat } = useSelector((state) => state.chat);

    return (
        <Box
            display={{ xs: selectedChat ? "flex" : "none", md: "flex" }}
            flexDirection="column"
            padding={3}
            backgroundColor="white"
            width={{ xs: '100%', md: '68%' }}
            borderRadius="10px"
            border="1px solid #ccc"
            boxShadow="0px 2px 4px rgba(0, 0, 0, 0.1)"
            marginTop={{ xs: '20px', md: 0 }}
        >
            <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        </Box>
    );
};

export default ChatBox;
