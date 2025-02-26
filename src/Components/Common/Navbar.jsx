import * as React from 'react';
import { useState } from "react";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Avatar from '@mui/material/Avatar';
import { Button, Badge } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import { MenuItem } from '@mui/material';
import logo from '../../../src/assests/full_logo.png';
import { Link } from 'react-router-dom';
import { logout } from '../../../src/services/operations/authApi';
import { useNavigate } from 'react-router-dom';
import { FiLogOut } from "react-icons/fi";
import { CgProfile } from "react-icons/cg";
import { useDispatch, useSelector } from 'react-redux';
import SideDrawer from '../Core/Chat/SideDrawer';
import NotificationBadge from "react-notification-badge";
import Effect from "@mui/material/Badge";
import { setSelectedChat, setNotification } from '../../slices/chatSlice';
import { getSender } from "../../config/chatlogics";
import Confirmationmodal from './Confirmationmodal';
import { useLocation } from "react-router-dom";

import { fetchNotifications,markNotificationAsRead} from '../../services/operations/notificationApi';
import { setNotifications, markAsRead } from '../../slices/notificationSlice';
import NotificationDropdown from './NotificationDropdown';
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
  // access query parameters
  const pathname = location.pathname;


  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [confirmationModal, setConfirmationModal] = useState(false);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  // Handling notification menu
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    setConfirmationModal(true);
  };

  const confirmLogout = () => {
    dispatch(logout(navigate));
    setConfirmationModal(false);
    handleCloseUserMenu(); // Close the user menu after logout
  };

  const cancelLogout = () => {
    setConfirmationModal(false);
  };
 

  return (
    <>
      <AppBar position="fixed" sx={{ backgroundColor: 'transparent', backdropFilter: 'blur(100px)' }}>
        <Container>
          <Toolbar disableGutters>
            <Typography
              variant="h6"
              noWrap
              component={Link}
              to="/"
              sx={{
                mr: 4,
                display: { xs: 'none', md: 'flex' },
              }}
            >
              <img src={logo} style={{ width: "20rem", height: "3rem" }} alt="logo" />
            </Typography>
            
            <Typography
              variant="h5"
              noWrap
              component={Link}
              to="/"
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
              }}
            >
              <img src={logo} style={{ width: "11rem", height: "2rem" }} alt="logo" />
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
            {token ? (<span></span>):(<Button component={Link} to="/business" sx={{color:"black"}}> Business</Button>)}
             {token && (pathname ==='/dashboard/chat') && (<SideDrawer />)}
             
            </Box>

            {token && 
            <NotificationDropdown/>
  } 

            {!token &&
              <Button
                component={Link}
                to="/login"
                sx={{ display: { xs: 'block', md: 'block' } }}
                variant='contained'
                color='success'
              >
                Login
              </Button>
            }
            {token &&
              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt="Remy Sharp" src={user?.image} />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
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
                      text2: "",
                      btn1text: "Logout",
                      btn2text: "Cancel",
                      btn1handle: confirmLogout,
                      btn2handle: cancelLogout,
                    }}
                    handleClose={cancelLogout}
                  />
                )}
              </Box>
            }
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
