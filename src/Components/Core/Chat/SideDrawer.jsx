import React, { useState, useEffect, useCallback } from "react";
import {
  Box, Tooltip, TextField, Modal, Typography, Grid,
  Avatar, IconButton, CircularProgress
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "react-hot-toast";
import { accessChat } from "../../../services/operations/chatApi";
import { setChats } from "../../../slices/chatSlice";
import UserCard from "./ReusableComponents/UserCard";
import { useLocation } from "react-router-dom";

const SideDrawer = () => {
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const [open, setOpen] = useState(false);
  const { token } = useSelector((state) => state.auth);
  const { chats } = useSelector((state) => state.chat);
  const location = useLocation();

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setSearch("");
    setSearchResult([]);
  };

  const handleSearch = useCallback(async () => {
    if (!search.trim()) return;

    setLoading(true);
    try {
      const { data } = await axios.get(
        `http://localhost:8080/api/v1/auth/search?search=${search}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setSearchResult(data);
      setOpen(true);
    } catch (error) {
      toast.error("Failed to search users");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [search, token]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      handleSearch();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search, handleSearch]);

  const handleChat = async (userId) => {
    try {
      await accessChat(userId, dispatch, token, chats);
      handleClose();
    } catch (err) {
      toast.error("Error accessing chat.");
    }
  };

  return (
    <Box>
      <Tooltip title="Search users to chat" arrow placement="bottom-end">
        <TextField
          sx={{
            backgroundColor: "#695ea820",
            padding: "5px",
            borderRadius: "20px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            width: { xs: "100%", md: location.pathname === "/dashboard/chat" ? "100%" : "280px" },
          }}
          placeholder="Search users..."
          variant="standard"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ color: "gray", mr: 1 }} />,
            disableUnderline: true,
          }}
        />
      </Tooltip>

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: 420 },
            bgcolor: "white",
            boxShadow: 24,
            borderRadius: 3,
            p: 3,
            maxHeight: "80vh",
            overflowY: "auto",
          }}
        >
          <IconButton
            onClick={handleClose}
            sx={{ position: "absolute", top: 10, right: 10 }}
          >
            <CloseIcon />
          </IconButton>

          <Typography variant="h6" mb={2}>
            Search Results
          </Typography>

          {loading ? (
            <Box display="flex" justifyContent="center">
              <CircularProgress />
            </Box>
          ) : searchResult.length > 0 ? (
            <Grid container spacing={2}>
              {searchResult.map((user) => (
                <Grid item xs={12} key={user._id}>
                  <UserCard user={user} onClick={handleChat} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography color="textSecondary">No results found</Typography>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default SideDrawer;
