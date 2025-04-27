import React from 'react';
import { useSelector } from 'react-redux';
import { Box } from '@mui/material';
import SingleChat from "./ReusableComponents/SingleChat";

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
    const { selectedChat } = useSelector((state) => state.chat);


    return (
        <div className={`flex flex-col  rounded-lg overflow-hidden bg-[#FAFAFA] border border-[#00000020] p-4 lg:w-7/12 w-full lg:max-h-[72vh] lg:h-[72vh] max-h-[80vh] h-[80vh]  ${selectedChat == '' || selectedChat == null ? 'lg:block hidden' : 'block'}`}

        >
            <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        </div>
    );
};

export default ChatBox;
