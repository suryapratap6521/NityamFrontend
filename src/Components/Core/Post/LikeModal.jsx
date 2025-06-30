import React from "react";
import { Dialog, DialogTitle, DialogContent, Avatar } from "@mui/material";

const LikesModal = ({ open, onClose, likes }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle className="text-lg font-semibold text-gray-800">
        People who liked this post
      </DialogTitle>
      <DialogContent dividers>
        {likes.length === 0 ? (
          <p className="text-gray-500 text-sm">No likes yet.</p>
        ) : (
          <div className="space-y-3">
            {likes.map((user) => (
              <div key={user._id} className="flex items-center gap-3">
                <Avatar src={user.image} alt={user.firstName} />
                <div>
                  <p className="font-medium text-gray-800">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default LikesModal;
