import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Avatar, Box, Paper, Typography, Stack } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faChartBar, faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import SideBarPost from "../Core/Post/SideBarPost"; // adjust path accordingly

export default function CreatePostSection() {
  const { user } = useSelector((state) => state.profile);
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <>
      <Paper
        elevation={3}
        sx={{
          p: 2,
          mb: 2,
          borderRadius: 2,
          cursor: "pointer",
          transition: "background-color 0.3s ease",
          "&:hover": { bgcolor: "grey.100" },
        }}
        onClick={handleOpenModal}
      >
        {/* Top Row: Avatar and Post prompt */}
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar
            src={user?.image}
            alt="User Avatar"
            sx={{ width: 48, height: 48 }}
          />
          <Box
            sx={{
              flexGrow: 1,
              border: "1px solid",
              borderColor: "grey.300",
              borderRadius: "50px",
              px: 2,
              py: 1,
            }}
          >
            <Typography color="text.secondary">Start a post</Typography>
          </Box>
        </Stack>
        {/* Bottom Row: Options for Photo, Poll, and Event */}
        <Stack direction="row" justifyContent="space-around" alignItems="center" mt={2}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <FontAwesomeIcon icon={faCamera} style={{ color: "#9c27b0", fontSize: 20 }} />
            <Typography variant="body2">Photo</Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1}>
            <FontAwesomeIcon icon={faChartBar} style={{ color: "#4caf50", fontSize: 20 }} />
            <Typography variant="body2">Poll</Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1}>
            <FontAwesomeIcon icon={faCalendarAlt} style={{ color: "#2196f3", fontSize: 20 }} />
            <Typography variant="body2">Event</Typography>
          </Stack>
        </Stack>
      </Paper>

      {/* Conditionally render the SideBarPost modal */}
      {openModal && <SideBarPost closeModal={handleCloseModal} />}
    </>
  );
}
