import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography
} from "@mui/material";

const ShareModal = ({ open, onClose, onConfirm }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Share Post to Chat</DialogTitle>
      <DialogContent>
        <Typography variant="body2">
          Are you sure you want to share this post to chat?
          You will be redirected to the chat screen.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onConfirm} variant="contained" color="primary">
          Share Now
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ShareModal;
