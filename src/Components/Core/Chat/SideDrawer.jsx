import React, { useState, useEffect } from "react";
import {
  Box, Tooltip, TextField, Modal, Typography, Grid,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { toast } from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import CloseIcon from "@mui/icons-material/Close";
import Loader from "../../Common/Loader";
import { accessChat } from "../../../services/operations/chatApi";
import { setChats } from "../../../slices/chatSlice";
import UserCard from "./ReusableComponents/UserCard";

const SideDrawer = () => {
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const [open, setOpen] = useState(false);
  const { token } = useSelector((state) => state.auth);
  const { chats } = useSelector((state) => state.chat);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Debounced search function
  useEffect(() => {
    if (!search) {
      setSearchResult([]);
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      handleSearch();
    }, 90); // Wait 2 seconds before making the API call

    return () => clearTimeout(delayDebounceFn); // Cleanup timeout on every re-render
  }, [search]); // Runs whenever `search` changes

  const handleSearch = async () => {
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.get(
        `https://nityambackend.onrender.com/api/v1/auth/search?search=${search}`,
        config
      );
      setSearchResult(data);
      console.log(data);
      setOpen(true);
    } catch (error) {
      console.error("Error searching:", error);
      toast.error("An error occurred while searching.");
    } finally {
      setLoading(false);
    }
  };

  const handleChat = async (userId) => {
    try {
      await accessChat(userId, dispatch, token, chats);
      setOpen(false);
    } catch (error) {
      console.error("Error accessing chat:", error);
      toast.error("An error occurred while accessing the chat.");
    }
  };

  return (
    <Box>
      <Tooltip title="Search Users to chat" arrow placement="bottom-end">
        <TextField
          sx={{
            backgroundColor: "#D5F5E3",
            padding: "5px",
            borderRadius: "20px",
            width: { xs: "100%", md: "300px" },
          }}
          placeholder="Search Users..."
          variant="standard"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ color: "black" }} />,
            disableUnderline: true,
          }}
        />
      </Tooltip>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: 400 },
            bgcolor: "white",
            border: "2px solid #000",
            boxShadow: 24,
            borderRadius: "10px",
            p: 4,
          }}
        >
          <CloseIcon
            onClick={handleClose}
            style={{ position: "absolute", top: "10px", right: "10px", cursor: "pointer" }}
          />
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            sx={{ marginBottom: "20px" }}
          >
            Search Results
          </Typography>
          <Grid container spacing={2}>
            {loading ? (
              <Loader />
            ) : searchResult.length > 0 ? (
              searchResult.map((user) => (
                <UserCard key={user._id} user={user} onClick={handleChat} />
              ))
            ) : (
              <Typography>No results found</Typography>
            )}
          </Grid>
        </Box>
      </Modal>
    </Box>
  );
};

export default SideDrawer;
