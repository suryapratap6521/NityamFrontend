import React, { useEffect, useState } from "react";
import {
  Menu,
  MenuItem,
  IconButton,
  Badge,
  Box,
  Avatar,
  Typography,
  Button,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import {
  fetchNotifications,
  markNotificationAsRead,
} from "../../services/operations/notificationApi";
import { setSelectedChat } from "../../slices/chatSlice";

const NotificationDropdown = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { notifications, unreadCount } = useSelector(
    (state) => state.notification
  );
  const { token } = useSelector((state) => state.auth);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    if (token) {
      dispatch(fetchNotifications(token));
      const interval = setInterval(() => {
        dispatch(fetchNotifications(token));
      }, 60000); // Refresh every minute
      return () => clearInterval(interval);
    }
  }, [token, dispatch]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = async (notification) => {
    // Mark as read
    if (!notification.read) {
      await dispatch(markNotificationAsRead(notification._id, token));
    }

    // Handle navigation
    if (notification.type === "chat") {
      navigate(`/dashboard/chat/${notification.chat._id}`);
      dispatch(setSelectedChat(notification.chat));
    } else if (notification.post) {
      navigate(`/dashboard/post/${notification.post._id}`);
    }

    handleClose();
  };

  const getNotificationPreview = (notification) => {
    switch (notification.type) {
      case "chat":
        return `Message: ${notification.message.substring(0, 30)}...`;
      case "post":
        return `New post: ${notification.post?.title?.substring(0, 30)}...`;
      case "poll":
        return `New poll: ${notification.post?.title?.substring(0, 30)}...`;
      case "event":
        return `New event: ${notification.post?.title?.substring(0, 30)}...`;
      default:
        return notification.message;
    }
  };

  return (
    <>
      <IconButton onClick={handleClick} color="inherit">
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        sx={{
          maxHeight: "60vh",
          width: "400px",
          "& .MuiPaper-root": { width: "400px" },
        }}
      >
        <Box px={2} py={1} borderBottom={1} borderColor="divider">
          <Typography variant="h6">Notifications</Typography>
        </Box>

        {notifications.length === 0 ? (
          <MenuItem disabled>No new notifications</MenuItem>
        ) : (
          notifications.map((notification) => (
            <MenuItem
              key={notification._id}
              onClick={() => handleNotificationClick(notification)}
              sx={{
                backgroundColor: !notification.read ? "#f5f6fa" : "inherit",
                "&:hover": { backgroundColor: "#f0f2f5" },
                py: 1.5,
                px: 2,
                borderBottom: "1px solid #f0f0f0",
              }}
            >
              <Box display="flex" gap={2} width="100%">
                <Avatar src={notification.sender?.image} sx={{ width: 40, height: 40 }}>
                  {notification.type === "chat" ? "💬" : "📢"}
                </Avatar>
                <Box flexGrow={1}>
                  <Typography variant="subtitle2" color="text.primary">
                    {notification.sender?.firstName}{" "}
                    {notification.sender?.lastName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {getNotificationPreview(notification)}
                  </Typography>
                  <Typography variant="caption" color="text.disabled" display="block">
                    {formatDistanceToNow(new Date(notification.createdAt), {
                      addSuffix: true,
                    })}
                  </Typography>
                </Box>
              </Box>
            </MenuItem>
          ))
        )}
      </Menu>
    </>
  );
};

export default NotificationDropdown;