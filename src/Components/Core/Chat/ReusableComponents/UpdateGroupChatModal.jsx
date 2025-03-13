import React, { useState } from 'react'; // Import useState
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { useSelector, useDispatch } from "react-redux";
import { setSelectedChat } from "../../../../slices/chatSlice";
import axios from "axios";
import UserBadgeItem from "./UserBadgeItem";
import UserCard from "./UserCard"; // Import UserListItem
import { toast } from "react-hot-toast";
import { chatEndpoints } from "../../../../services/apis";
import { Box, Button, Typography, Modal, IconButton, FormControl, TextField, Input } from '@mui/material'; // Add missing imports
import CloseIcon from '@mui/icons-material/Close';
import Loader from "../../../Common/Loader";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    display: "flex",
    flexDirection: "column",
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    borderRadius: "10px",
    // border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
    const { token } = useSelector((state) => state.auth);
    const { user } = useSelector((state) => state.profile);
    const { selectedChat } = useSelector((state) => state.chat);
    const [groupChatName, setGroupChatName] = useState("");
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [renameloading, setRenameLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch();
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    console.log(selectedChat, "update");
    const handleSearch = async (query) => {
        setSearch(query);
        if (!query) {
            return;
        }
        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const { data } = await axios.get( // Use axios.get for search
                `http://localhost:8080/api/v1/auth/search?search=${search}`,
                config
            );
            setLoading(false);
            setSearchResult(data);
        } catch (error) {
            toast.error("Failed to Load the Search Results");
            setLoading(false);
        }
    };

    const handleRename = async () => {
        if (!groupChatName) return;
        try {
            setRenameLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const { data } = await axios.post(
                chatEndpoints.RENAME,
                {
                    chatId: selectedChat._id,
                    name: groupChatName,
                },
                config
            );
            console.log(data);
            setSelectedChat(data);
            toast.success("Group renamed successfully");
            setFetchAgain(!fetchAgain);
            setRenameLoading(false);
        } catch (error) {
            toast.error("Error in changing the name of the groupchat");
            setRenameLoading(false);
        }
        setGroupChatName("");
    };

    const handleAddUser = async (user1) => {
        if (selectedChat.users.find((u) => u._id === user1._id)) {
            toast.error("User Already in group!");
            return;
        }
        if (selectedChat.groupAdmin._id !== user._id) {
            toast.error("Only admins can add someone!");
            return;
        }
        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const { data } = await axios.post(
                chatEndpoints.ADD_TO_GROUP,
                {
                    chatId: selectedChat._id,
                    userId: user1._id,
                },
                config
            );
            dispatch(setSelectedChat(data));
            setFetchAgain(!fetchAgain);
            toast.success("User Added successfully")
            setLoading(false);
        } catch (error) {
            toast.error("Error in Adding the user to the group");
            setLoading(false);
        }
        setGroupChatName("");
    };

    const handleRemove = async (user1) => {
        if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
            toast.error("Only admins can remove someone!");
            return;
        }
        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const { data } = await axios.post(
                chatEndpoints.REMOVE_FROM_GROUP,
                {
                    chatId: selectedChat._id,
                    userId: user1._id,
                },
                config
            );

            user1._id === user._id ? dispatch(setSelectedChat()) : dispatch(setSelectedChat(data));
            setFetchAgain(!fetchAgain);
            fetchMessages();
            toast.success("User successfully removed from group");
            setLoading(false);
        } catch (error) {
            toast.error("error in removing from the group");
            setLoading(false);
        }
        setGroupChatName("");
    };

    return (
        <>
            <IconButton onClick={handleOpen}><RemoveRedEyeIcon /></IconButton>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <CloseIcon onClick={handleClose} style={{ position: 'absolute', top: '10px', right: '10px', cursor: 'pointer' }} />
                    <Typography id="modal-modal-title" display="flex" justifyContent="center" variant="h6" component="h2">
                        {selectedChat.chatName}
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        <Box width="100%" display="flex" flexWrap="wrap" pb={3}>
                            {selectedChat.users.map((u) => (
                                <UserBadgeItem
                                    key={u._id}
                                    user={u}
                                    admin={selectedChat.groupAdmin}
                                    handleFunction={() => handleRemove(u)}
                                />
                            ))}
                        </Box>
                    </Typography>
                    <FormControl d="flex">
                        <TextField
                            placeholder="Chat Name"
                            marginBottom={3}
                            value={groupChatName}
                            onChange={(e) => setGroupChatName(e.target.value)}
                        />
                        <Button
                            variant="contained"
                            color="success"
                            marginLeft={1}
                            disabled={!groupChatName} // Disable button if groupChatName is empty
                            isLoading={renameloading}
                            onClick={handleRename}
                        >
                            Update
                        </Button>
                    </FormControl>
                    <FormControl>
                        <Input
                            placeholder="Add User to group"
                            mb={1}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                    </FormControl>
                    {loading ? (
                        <Loader />
                    ) : (
                        searchResult?.map((user) => (
                            <UserCard
                                key={user._id}
                                user={user}
                                onClick={() => handleAddUser(user)}
                            />
                        ))
                    )}
                    <Button onClick={() => handleRemove(user)} variant="contained" color="error">
                        Leave Group
                    </Button>
                </Box>
            </Modal>
        </>
    );
}

export default UpdateGroupChatModal;
