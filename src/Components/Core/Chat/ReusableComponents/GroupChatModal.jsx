import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { toast } from "react-hot-toast";
import { setChats } from "../../../../slices/chatSlice";
import { useSelector, useDispatch } from "react-redux";
import { FormControl, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from "axios";
import Loader from "../../../Common/Loader";
import UserCard from "./UserCard";
import UserBadgeItem from "./UserBadgeItem";
import { chatEndpoints } from "../../../../services/apis";
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const GroupChatModal = ({ children }) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [groupChatName, setGroupChatName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const { chats } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
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
      const { data } = await axios.get(
        `http://localhost:8080/api/v1/auth/search?search=${search}`,
        config
      );
      console.log(data);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      console.error("Error searching:", error);
      toast.error("An error occurred while searching.");
    }
  };


  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
  };

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toast.error("User already added in the Group")
      return;
    }

    setSelectedUsers([...selectedUsers, userToAdd]);
  }


  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      toast.error("Please fill all the fields");
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.post(
        chatEndpoints.GROUP_CHAT,
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );

      dispatch(setChats([data, ...chats]));
      handleClose();
      toast.success("New Group Chat Created!");
    } catch (error) {
      toast.error("Failed to Create the Chat!");
      console.log(error);
    }
  };


  return (
    <>
      <span onClick={handleOpen}>{children}</span>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <CloseIcon onClick={handleClose} style={{ position: 'absolute', top: '10px', right: '10px', cursor: 'pointer' }} />
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Create Group Chat
          </Typography>
          <FormControl fullWidth sx={{ my: 2 }}>
            <TextField
              variant="outlined"
              label="Chat Name"
              value={groupChatName}
              onChange={(e) => setGroupChatName(e.target.value)}
            />
          </FormControl>
          <FormControl fullWidth sx={{ my: 2 }}>
            <TextField
              variant="outlined"
              label="Add Users"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </FormControl>
          <Box w="100%" display="flex" flexWrap="wrap">
            {selectedUsers.map((u) => (
              <UserBadgeItem
                key={u._id}
                user={u}
                handleFunction={() => handleDelete(u)}

              />
            ))}
          </Box>
          {/* selectedusers */}
          {/* renderusers */}
          {loading ? (<Loader />) : (searchResult
            ?.slice(0, 4)
            .map((user) => (
              <UserCard
                key={user._id}
                user={user}
                onClick={() => handleGroup(user)}
              />
            )))}
          <Button variant="contained" color="primary" sx={{ marginTop: "20px", display: "flex", alignItem: "right" }} onClick={handleSubmit}>Create Group</Button>
        </Box>
      </Modal>
    </>
  );
};

export default GroupChatModal;
