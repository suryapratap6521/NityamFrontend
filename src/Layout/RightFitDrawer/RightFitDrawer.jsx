import * as React from "react";
import { Grid, Box } from "@mui/material";
import { Typography } from "@mui/material";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import logoImage from "../../asssets/Images/logoImage.png";
import CloseIcon from "@mui/icons-material/Close";
import Accordion from "@mui/material/Accordion";
import AccordionActions from "@mui/material/AccordionActions";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MenuIcon from "@mui/icons-material/Menu";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { useNavigate } from "react-router-dom";
// import { textColors } from "../../Variable/variable";

export default function RightDrawer() {
  const navigate = useNavigate();
  // const handleClick = () => {
  //   navigate(route);
  // };
  const [state, setState] = React.useState({
    right: false,
  });

  const toggleDrawer = (open) => () => {
    setState({ right: open });
  };

  const handleCloseDrawer = (event) => {
    // event.stopPropagation(); // Stop event propagation
    setState({ right: false });
  };

  const style = {
    drawertoprow: {
      height: "20vh",
      width: "80%",
      margin: "5px auto",
      display: "flex",
      flexDirection:"column",
      justifyContent: "space-between",
      alignItems: "flex-start",
      // background:"yellow"
    },
    logoImage:{
      height:"100%",
      width:"200px"
    },
    drawermaingrid: {
      // height:"80vh",
      // backgroundColor:"aqua"
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      alignItems: "flex-start",
      gap: "10px",
      margin: "20px",
      marginLeft: "30px",
    },
    drawerlistitem: {
      // color: textColors.darkText,
      color: "#000",
      fontSize: "2rem",
      transition: "0.4s ease-in",
      "&:hover": {
        color: "#000",
        cursor: "pointer",
      },
    },
    accordionboxlong: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      alignItems: "flex-start",
      gap: "10px",
    },
    radiobtnbox: {
      marginLeft: "30px",
    },
    drawerlastrowtext: {
      "&.MuiTypography-root": {
        fontSize: "5rem",
      },
      "&.MuiTypography-body1": {
        fontSize: "5rem",
      },
      "&.MuiFormControlLabel-label": {
        fontSize: "5rem",
      },
      "&.css-ahj2mt-MuiTypography-root": {
        fontSize: "5rem",
      },
      "& .MuiSwitch-colorPrimary.Mui-checked": {
        color: "#9BFFD9", // Change to your desired color
      },
      "& .MuiSwitch-colorPrimary.Mui-checked + .MuiSwitch-track": {
        backgroundColor: "#523DFC", // Change to your desired background color
      },
    },
    menuicn: {
      color: "rgb(97, 93, 93)",
      fontSize: "2rem",
    },
    drawerbox: {
      width: { lg: "25vw", md: "30vw", sm: "35vw", xs: "65vw" },
      overflowX:"hidden",
      //   backdropFilter: "blur(100px)",

      minHeight: "100%",
      overflowY: "auto",
      color: "#fff",
      backdropFilter: "blur(50px)",
      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
      // background:
      //   "linear-gradient(0deg, rgba(128, 128, 128, 0.2), rgba(128, 128, 128, 0.2)), rgba(0, 0, 0, 0.2)",
      backgroundBlendMode: "luminosity, normal",
      backgroundColor: "#fff",
    },
  };

  const list = () => (
    <Box
      sx={style.drawerbox}
      role="presentation"
      onKeyDown={toggleDrawer(false)}
    >
      <Grid container sx={style.drawertoprow}>
        <Box>
          <img src={logoImage} alt="Logo" style={style.logoImage} />
        </Box>
        <Box sx={{width:"100%"}}>
          <CloseIcon
            onClick={handleCloseDrawer}
            sx={{ cursor: "pointer", fontSize: "2rem", color: "#000" }}
          />
        </Box>
      </Grid>
      <Grid sx={style.drawermaingrid}>
        <Box sx={{ ...style.drawerlistitem }}>
          <Typography
            variant="h6"
            sx={{ fontSize: "1.1rem" }}
            onClick={() => navigate("/")}
          >
            Home
          </Typography>
        </Box>
        <Box sx={{ ...style.drawerlistitem }}>
          <Typography
            variant="h6"
            sx={{ fontSize: "1.1rem" }}
            onClick={() => navigate("/about")}
          >
            About Us
          </Typography>
        </Box>
      
        <Box sx={{ ...style.drawerlistitem }}>
          <Typography
            variant="h6"
            sx={{ fontSize: "1.1rem" }}
            onClick={() => navigate("/works")}
          >
            Contact
          </Typography>
        </Box>
        <Box sx={{ ...style.drawerlistitem }}>
          <Typography
            variant="h6"
            sx={{ fontSize: "1.1rem" }}
            onClick={() => navigate("/blogs")}
          >
            Business
          </Typography>
        </Box>
        <Box sx={{ ...style.drawerlistitem }}>
          <Typography
            variant="h6"
            sx={{ fontSize: "1.1rem" }}
            onClick={() => navigate("/career")}
          >
            Services
          </Typography>
        </Box>
      
      </Grid>
     
    </Box>
  );

  return (
    <div>
      <Box>
        <Button onClick={toggleDrawer(true)}>
          <MenuIcon sx={style.menuicn} />
        </Button>
      </Box>
      <Drawer anchor="right" open={state.right} onClose={toggleDrawer(false)}>
        {list()}
      </Drawer>
    </div>
  );
}
