import React, { useState } from "react";
import HeaderStyle from "./HeaderStyle";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import headerLogoImage from "../../assets/Images/headerLogoImage.png";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import AddIcCallOutlinedIcon from "@mui/icons-material/AddIcCallOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { Link } from "react-router-dom";
import { useMediaQuery } from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useTheme } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import RightDrawer from "../RightFitDrawer/RightFitDrawer";
// import { textColors } from "../../Variable/variable";
import TextField from "@mui/material/TextField";

const Header = () => {
  const styles = HeaderStyle;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElProducts, setAnchorElProducts] = useState(null);
  const [showSearch, setShowSearch] = useState(false);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProductsMenuOpen = (event) => {
    setAnchorElProducts(event.currentTarget);
  };

  const handleProductsMenuClose = () => {
    setAnchorElProducts(null);
  };

  const handleSearchClick = () => {
    setShowSearch(!showSearch);
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="fixed" sx={styles.appbar}>
          <Toolbar sx={styles.toolbar}>
            <Box sx={styles.box1}>
              <img src={headerLogoImage} style={styles.logoImage} />
            </Box>
            {!isMobile && (
              <>
                <Box sx={styles.box2}>
                  <Box>
                    <Link
                      style={{
                        textDecoration: "none",
                        border: "none",
                        outline: "none",
                        color: "inherit",
                      }}
                      to="/"
                    >
                      <Typography sx={styles.headerLinkText}>Home</Typography>
                    </Link>
                  </Box>
                  <Box sx={styles.flexLink}>
                    <Typography sx={styles.headerLinkText}>About Us</Typography>
                  </Box>

                  <Box>
                    <Typography sx={styles.headerLinkText}>Contact</Typography>
                  </Box>

                  <Box sx={styles.flexLink}>
                    <Typography sx={styles.headerLinkText}>Business</Typography>
                  </Box>
                  <Box>
                    <Typography sx={styles.headerLinkText}>Services</Typography>
                  </Box>
                </Box>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: "1rem" }}
                >
                  <Box sx={styles.box3}>
                    <Typography className="loginText" sx={{ color: "#1A8E45" }}>
                      Login
                    </Typography>
                  </Box>
                  <Box sx={styles.box4}>
                    <Typography className="loginText" sx={{ color: "#fff" }}>
                      Sign Up
                    </Typography>
                  </Box>
                </Box>
              </>
            )}
            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="end"
                sx={{ ml: 2 }}
              >
                {/* <MenuIcon /> */}
                <RightDrawer />
              </IconButton>
            )}
          </Toolbar>
        </AppBar>
      </Box>
      {/* Add this Box to create space below the fixed AppBar */}
      <Box sx={{ mt: 8 }}>
        {/* Your main content goes here */}
      </Box>
    </>
  );
};

export default Header;
