import React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from "@mui/icons-material/Home";
import ExploreIcon from "@mui/icons-material/Explore";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import ForumIcon from "@mui/icons-material/Forum";
import LoyaltyIcon from "@mui/icons-material/Loyalty";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import { Button, Stack } from "@mui/material";
import Hidden from "@mui/material/Hidden";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Link } from "react-router-dom";
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';

const Sidebar = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isMediumScreen = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg"));

  const drawerWidth = isLargeScreen ? 220 : isMediumScreen ? 200 : 60;

  const IconsArray = [
    <HomeIcon fontSize="large" color="warning" />,
    <ExploreIcon fontSize="large" color="primary" />,
    <LoyaltyIcon fontSize="large" color="error" />,
    <NotificationsActiveIcon fontSize="large" color="info" />,
    <ForumIcon fontSize="large" color="success" />,
    <GroupAddIcon fontSize="large" color="secondary" />,
    <AddCircleOutlineOutlinedIcon fontSize="large" color="success" sx={{ marginLeft: "1rem", marginTop: "1rem", display: { xs: "block", sm: "none" } }} />
  ];
  
  const LinksArray = [
    "/dashboard",
    "/dashboard/discover",
    "/dashboard/sale",
    "/dashboard/notifications",
    "/dashboard/chat",
    "/dashboard/neighbours"
  ];

  return (
    <div style={{ display: "flex", position: "fixed" }}>
    <Box >
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          zIndex: 1,
          ...(isSmallScreen && {
            // position: 'fixed',
            bottom: 0,
            width: '100%',
            height: 'auto',
            flexDirection: 'row'
          })
        }}
        variant="permanent"
        anchor={isSmallScreen ? "bottom" : "left"}
      >
        <Toolbar />
        <List sx={{ display: isSmallScreen ? 'flex' : 'block', flexDirection: 'row', justifyContent: 'space-around', padding: 0 }}>
          {[
            "Home",
            "Discover",
            "For Sale & Free",
            "Notifications",
            "Messages",
            "Neighbours",
          ].map((text, index) => (
            <ListItem key={text} sx={{ paddingLeft: 0, padding: isSmallScreen ? '0 8px' : '8px 0' }}>
              <Link to={`${LinksArray[index]}/`} style={{ textDecoration: "none" }}>
                <ListItemButton sx={{ display: 'flex', flexDirection: isSmallScreen ? 'column' : 'row' }}>
                  <ListItemIcon>{IconsArray[index]}</ListItemIcon>
                  {!isSmallScreen && (
                    <ListItemText
                      primary={
                        <Typography color="black" fontWeight="bold">
                          {text}
                        </Typography>
                      }
                      component={Link}
                      to={LinksArray[index]}
                    />
                  )}
                </ListItemButton>
              </Link>
            </ListItem>
          ))}
          <ListItemIcon to={'/dashboard/createpost'} component={Link}>{IconsArray[IconsArray.length - 1]}</ListItemIcon>
        </List>
        <Hidden smDown>
          <Stack sx={{ display: { xs: "block" } }}>
            <Button
              variant="contained"
              style={{
                backgroundColor: "#4CAF50",
                color: "white",
                borderRadius: "8px",
                width: "150px",
                height: "40px",
                marginLeft: "1rem",
              }}
              to={'/dashboard/createpost'}
              component={Link}
            >
              <span style={{ marginRight: "10px", marginTop: "5px" }}><AddCircleOutlineOutlinedIcon fontSize="medium" /></span>
              <Typography variant="h7" component="div">
                <b>Post</b>
              </Typography>
            </Button>
          </Stack>
        </Hidden>
      </Drawer>
    </Box>
    </div>
  );
};

export default Sidebar;
