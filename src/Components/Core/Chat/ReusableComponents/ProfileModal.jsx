import React from 'react';
import { Button, IconButton, Modal, Typography, Box } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { useState } from 'react';

const ProfileModal = ({ user, children }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      {children ? (
        <span onClick={handleOpen}>{children}</span>
      ) : (
        <IconButton onClick={handleOpen} sx={{ position: 'relative', top: 0, right: 0 }}>
          <RemoveRedEyeIcon />
        </IconButton>
      )}
      <Modal open={open} onClose={handleClose} aria-labelledby="modal-title" aria-describedby="modal-description">
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          borderRadius: 4,
          p: 4,
          textAlign: 'center', // Center-align content
        }}>
          <Typography variant="h4" fontFamily="Work sans">
            {user.firstName + " " + user.lastName}
          </Typography>
          <IconButton sx={{ position: 'absolute', top: 0, right: 0 }} onClick={handleClose}>
            <CloseIcon />
          </IconButton>
          <Box display="flex" flexDirection="column" alignItems="center" justifyContent="space-between" mt={2}>
            <img src={user.image} alt={user.firstName} style={{ borderRadius: '50%', width: '150px', height: '150px' }} />
            <Typography variant="h5" fontFamily="Work sans">
              Email: {user.email}
            </Typography>
          </Box>
          <Box mt={2}>
            <Button variant="contained" onClick={handleClose}>Close</Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default ProfileModal;
