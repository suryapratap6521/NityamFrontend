import React, { useState } from 'react';
import { FiTrash2 } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteProfile } from "../../../services/operations/settingsApi";
import {
  Box,
  Button,
  Typography,
  IconButton,
  Modal,
} from '@mui/material';
import { styled } from '@mui/system';

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.error.main,
  color: theme.palette.common.white,
  '&:hover': {
    backgroundColor: theme.palette.error.dark,
  },
}));

const DeleteAccount = () => {
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  async function handleDeleteAccount() {
    try {
      dispatch(deleteProfile(token, navigate));
    } catch (error) {
      console.log("ERROR MESSAGE - ", error.message);
    }
  }

  return (
    <>
      <Box
        my={3}
        display="flex"
        flexDirection="row"
        gap={2}
        p={3}
        bgcolor="error.light"
        borderRadius={2}
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          bgcolor="error.dark"
          borderRadius="50%"
          width={56}
          height={56}
        >
          <FiTrash2 style={{ color: 'white', fontSize: '24px' }} />
        </Box>
        <Box display="flex" flexDirection="column" justifyContent="center" gap={1}>
          <Typography variant="h6" color="common.white">
            Delete Account
          </Typography>
          <Typography variant="body2" color="common.white">
            Would you like to delete your account? This account may contain paid courses. Deleting your account is permanent and will remove all content associated with it.
          </Typography>
          <StyledButton onClick={handleOpen} variant="contained">
            I want to delete my account
          </StyledButton>
        </Box>
      </Box>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          width={400}
          bgcolor="background.paper"
          borderRadius={2}
          boxShadow={24}
          p={4}
        >
          <Typography id="modal-title" variant="h6" component="h2">
            Confirm Deletion
          </Typography>
          <Typography id="modal-description" sx={{ mt: 2 }}>
            Are you sure you want to delete your account? This action is permanent.
          </Typography>
          <Box mt={3} display="flex" justifyContent="space-between">
            <Button onClick={handleClose} variant="contained" color="primary">
              No, keep my account
            </Button>
            <Button onClick={handleDeleteAccount} variant="contained" color="error">
              Yes, delete my account
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default DeleteAccount;
