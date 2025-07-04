import React, { useState } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Button,
  Badge,
  Tooltip,
  MenuItem,
  Avatar,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiLogOut } from "react-icons/fi";
import { CgProfile } from "react-icons/cg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

import logo from "../../assests/full_logo.png";
import { logout } from "../../services/operations/authApi";
import { setSelectedChat, setNotification } from "../../slices/chatSlice";
import { getSender } from "../../config/chatlogics";
import Confirmationmodal from "./Confirmationmodal";
import SideDrawer from "../Core/Chat/SideDrawer";
import SideBarPost from "../Core/Post/SideBarPost";

const settings = [
  { title: "Profile", path: "/dashboard/myprofile", icon: <CgProfile /> },
  { title: "Logout", icon: <FiLogOut /> },
];

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { notification } = useSelector((state) => state.chat);

  const [anchorElUser, setAnchorElUser] = useState(null);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
  const handleCloseUserMenu = () => setAnchorElUser(null);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const handleLogout = () => setConfirmationModal(true);
  const confirmLogout = () => {
    dispatch(logout(navigate));
    setConfirmationModal(false);
    handleCloseUserMenu();
  };
  const cancelLogout = () => setConfirmationModal(false);

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: "#F5F5F5",
          boxShadow: "none",
          borderBottom: "2px solid rgb(229 231 235)",
        }}
      >
        <Container>
          <Toolbar disableGutters>
            <Typography
              variant="h6"
              noWrap
              component={Link}
              to="/"
              sx={{ mr: 4, display: { xs: "none", md: "flex" } }}
            >
              <img src={logo} style={{ width: "20rem", height: "3rem" }} alt="logo" />
            </Typography>

            <Typography
              variant="h5"
              noWrap
              component={Link}
              to="/"
              sx={{ mr: 2, display: { xs: "flex", md: "none" }, flexGrow: 1 }}
            >
              <img src={logo} style={{ width: "11rem", height: "2rem" }} alt="logo" />
            </Typography>

            <Box   sx={{
    display: "flex",
    justifyContent: "flex-end", // This moves children to the right
    alignItems: "center",
    flexGrow: 1,
  }}>
              {token && location.pathname === "/dashboard/chat" && <SideDrawer />}

              {token && (
                <IconButton
                  onClick={handleOpenModal}
                  sx={{
                    backgroundColor: "green",
                    color: "white",
                   
                    "&:hover": { backgroundColor: "darkgreen" },
                    borderRadius: "50%",
                    width: 40,
                    height: 40,
                  }}
                >
                  <FontAwesomeIcon icon={faPlus} />
                </IconButton>
              )}
              {openModal && <SideBarPost closeModal={handleCloseModal} />}
              


              {token && (
                <IconButton style={{ marginRight: "20px" }} onClick={handleClick}>
                  <Badge badgeContent={notification.length} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              )}
            </Box>

         {token && (
  <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
    {notification.length === 0 ? (
      <MenuItem>No New Messages</MenuItem>
    ) : (
      notification
        .reduce((acc, msg) => {
          const existing = acc.find(n => n.chat._id === msg.chat._id);
          if (existing) {
            existing.count += 1;
            existing.latestMessage = msg;
          } else {
            acc.push({ ...msg, count: 1, latestMessage: msg });
          }
          return acc;
        }, [])
        .map((notif) => {
          const sender = notif.chat.isGroupChat
            ? notif.chat.chatName
            : getSender(user, notif.chat.users);
          const latest = notif.latestMessage?.content?.slice(0, 30) || "New message";

          return (
            <MenuItem
              key={notif.chat._id}
              onClick={() => {
                dispatch(setSelectedChat(notif.chat));
                dispatch(setNotification(notification.filter((n) => n.chat._id !== notif.chat._id)));
                handleClose();
              }}
              sx={{ gap: 2 }}
            >
              <Avatar
                src={
                  notif.chat.isGroupChat
                    ? "/group-avatar.png"
                    : notif.chat.users.find((u) => u._id !== user._id)?.image || "/default-avatar.png"
                }
                alt={sender}
              />
              <Box>
                <Typography fontWeight={600} fontSize={14}>
                  {sender}
                </Typography>
                <Typography fontSize={13} color="gray">
                  {latest}
                </Typography>
              </Box>
              <Badge color="error" badgeContent={notif.count} sx={{ ml: "auto" }} />
            </MenuItem>
          );
        })
    )}
  </Menu>
)}

            {!token ? (
              <Button component={Link} to="/login" variant="contained" color="success">
                Login
              </Button>
            ) : (
              <Box
                sx={{
                  flexGrow: 0,
                  borderRadius: "50px"
                }}
              >
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar
                      alt="User"
                      src={user?.image || ""}
                      sx={{ width: "34px", height: "34px", marginRight: "10px" }}
                    />
                    
                  </IconButton>
                </Tooltip>
                <Menu
                  anchorEl={anchorElUser}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {settings.map((setting) => (
                    <MenuItem
                      key={setting.title}
                      onClick={() => {
                        if (setting.title === "Logout") handleLogout();
                        else navigate(setting.path);
                        handleCloseUserMenu();
                      }}
                      sx={{ display: "flex", alignItems: "center", gap: 1 }}
                    >
                      {setting.icon}
                      <Typography>{setting.title}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
                {confirmationModal && (
                  <Confirmationmodal
                    modalData={{
                      text1: "Are you sure you want to logout?",
                      btn1text: "Logout",
                      btn2text: "Cancel",
                      btn1handle: confirmLogout,
                      btn2handle: cancelLogout,
                    }}
                    handleClose={cancelLogout}
                  />
                )}
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>
      <main style={{ marginTop: "64px" }}></main>
    </>
  );
}

export default Navbar;
