import React, { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Avatar from '@mui/material/Avatar';
import { Button, Badge, Tooltip, MenuItem } from '@mui/material';
import logo from '../../assests/full_logo.png';
import { Link, useNavigate } from 'react-router-dom';
import { FiLogOut } from "react-icons/fi";
import { CgProfile } from "react-icons/cg";
import { useDispatch, useSelector } from 'react-redux';
import SideDrawer from '../Core/Chat/SideDrawer';
import { setSelectedChat, setNotification } from '../../slices/chatSlice';
import { getSender } from "../../config/chatlogics";
import Confirmationmodal from './Confirmationmodal';
import { useLocation } from "react-router-dom";
import { logout } from '../../../src/services/operations/authApi';

// Import the socket instance
import socket from '../../config/socket';

const settings = [
  { title: 'Profile', path: '/dashboard/myprofile', icon: <CgProfile /> },
  { title: 'Logout', icon: <FiLogOut /> }
];

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { notification } = useSelector((state) => state.chat);
  const location = useLocation();
  const pathname = location.pathname;

  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  // Handle socket notifications
  useEffect(() => {
    if (token && user) {
      console.log(token);
      console.log(user);
      socket.emit("setup", { _id: user._id });

      // Listen for new notifications
      socket.on("newNotification", (data) => {
        console.log("New notification received:", data);
        dispatch(setNotification([...notification, data]));
      });


      return () => {
        socket.off("newNotification");
      };
    }
  }, [token, user, dispatch]);  // Remove notification from dependency array

  const handleOpenNavMenu = (event) => setAnchorElNav(event.currentTarget);
  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
  const handleCloseNavMenu = () => setAnchorElNav(null);
  const handleCloseUserMenu = () => setAnchorElUser(null);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => setConfirmationModal(true);
  const confirmLogout = () => {
    dispatch(logout(navigate));
    setConfirmationModal(false);
    handleCloseUserMenu();
  };
  const cancelLogout = () => setConfirmationModal(false);

  return (
    <>
      <AppBar position="fixed" sx={{ backgroundColor: '#F5F5F5', boxShadow: 'none', borderBottom: '2px solid rgb(229 231 235)' }}>
        <Container>
          <Toolbar disableGutters>
            <Typography
              variant="h6"
              noWrap
              component={Link}
              to="/"
              sx={{ mr: 4, display: { xs: 'none', md: 'flex' } }}
            >
              <img src={logo} style={{ width: "20rem", height: "3rem" }} alt="logo" />
            </Typography>
            <Typography
              variant="h5"
              noWrap
              component={Link}
              to="/"
              sx={{ mr: 2, display: { xs: 'flex', md: 'none' }, flexGrow: 1 }}
            >
              <img src={logo} style={{ width: "11rem", height: "2rem" }} alt="logo" />
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
              {!token && <Button component={Link} to="/business" sx={{ color: "black" }}> Business</Button>}
              {token && pathname === '/dashboard/chat' && <SideDrawer />}
            </Box>

            {token && (
              <IconButton
                style={{ marginRight: "20px" }}
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
              >
                <Badge badgeContent={notification.length} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            )}

            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
            >
              {notification.length === 0 && <MenuItem>No New Messages</MenuItem>}
              {console.log(notification, "this is notification")}
              {notification && notification.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    dispatch(setSelectedChat(notif.chat));
                    dispatch(setNotification(notification.filter((n) => n !== notif)));
                    handleClose();
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New Message in ${notif.chat.chatName}`
                    : `New Message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </Menu>

            {!token ? (
              <Button
                component={Link}
                to="/login"
                sx={{ display: { xs: 'block', md: 'block' } }}
                variant="contained"
                color="success"
              >
                Login
              </Button>
            ) : (
              <Box sx={{ flexGrow: 0, border: '1.5px solid #00000042', borderRadius: '50px', padding: '4px 20px 4px 4px' }}>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt="User" src={user?.image} sx={{ width: '34px', height: '34px', marginRight: '10px' }} />
                    <p className='text-sm text-gray-800'>{user.firstName} {user.lastName}</p>
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {settings.map((setting) => (
                    <MenuItem
                      key={setting.title}
                      onClick={() => {
                        if (setting.title === "Logout") {
                          handleLogout();
                        } else {
                          navigate(setting.path);
                          handleCloseUserMenu();
                        }
                      }}
                      sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                    >
                      {setting.icon}
                      <Typography textAlign="center">{setting.title}</Typography>
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
      <main style={{ marginTop: '64px' }}>
        {/* Your main content goes here */}
      </main>
    </>
  );
}

export default Navbar;
