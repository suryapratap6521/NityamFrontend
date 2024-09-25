// import { colors } from "@mui/material";
// import { fontFamilies, textColors } from "../../Variable/variable";

import { varColors } from "../../variable";

const HeaderStyle = {
  appbar: {
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    boxShadow: "none",
    height: "6rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "none",
    boxShadow: "2px solid rgba(0,0,0,0.5)",
    // marginBottom: "2rem",
    backdropFilter: "blur(10px)",
    zIndex: 1000,
    // marginBottom:"100rem"
  },
  toolbar: {
    height: "100%",
    width: "90%",
    // backgroundColor: "red",
    boxShadow: "2px solid rgba(0,0,0,0.5)",
    padding: "1rem 0",
    display: "flex",
    alignItems: "center",
    justifyContent: {
      xl: "center",
      lg: "space-between",
      md: "space-between",
      sm: "space-between",
      xs: "space-between",
    },
    gap: { xl: "10rem", lg: "", md: "", sm: "", xs: "" },
  },
  box1: {
    height: "100%",
    width: { lg: "20%", md: "25%", sm: "25%", xs: "25%" },
    // background:"yellow",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  logoImage: {
    height: "100%",
    width: "100%",
    objectFit: "contain",
    objectRepeat: "no-repeat",
    objectPosition: "center",
  },
  box2: {
    // width: "50%",
    height: "100%",
    // backgroundColor: "red",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: { xl: "2.5rem", lg: "2rem", md: "1rem" },
  },
  downkeyicon: {
    color: "#000",
    // fontSize:"1rem"
  },
  flexLink: {
    display: "flex",
    alignItems: "center",
  },
  box3: {
    // width: "20%",
    // height: "100%",
    padding: "0.7rem 2rem",
    border: "1.5px solid #1A8E45",
    // background: "yellow",
    display: "flex",
    gap: "1rem",
    borderRadius: "20px",
    alignItems: "center",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#1A8E45", // Change this to your desired hover background color
      ".loginText": {
        color: "#fff", // Change this to your desired hover text color
      },
    },
  },
  loginText: {
    color: "#1A8E45",
  },
  signUpText: {
    color: "#fff",
  },
  box4: {
    padding: "0.7rem 2rem",
    border: "1.5px solid #fff",
    background: "#1A8E45",
    display: "flex",
    gap: "1rem",
    borderRadius: "20px",
    alignItems: "center",
    cursor: "pointer",
    // "&:hover": {
    //   backgroundColor: "#fff", // Change this to your desired hover background color
    //   ".loginText": {
    //     color: "#1A8E45", // Change this to your desired hover text color
    //     border: "1.5px solid #1A8E45",
    //     borderRadius: "20px",
    //     // padding: "0.7rem 2rem",
    //   },
    // },
  },
  blueCallIcon: {
    height: "50px",
    width: "50px",
    backgroundColor: "#0055FF",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  headerLinkText: {
    color: "#0A0A0A",
    // fontFamily: fontFamilies.headerFontFamily,
    fontWeight: "500",
    cursor: "pointer",
  },
  callNowText: {
    // color: textColors.lightGray,
    fontSize: "0.9rem",
  },
  callText: {
    // color: textColors.darkText,
  },
  box4Left: {
    height: "100%", // corrected from heigth to height
    width: "100%",
  },
  searchIcon: {
    color: "#000",
    fontSize: "2rem",
    cursor: "pointer",
  },
  menubody: {
    backgroundColor: "#fff",
    padding: "0",
    margin: "0",
    // color: textColors.darkText,
    // backdropFilter: "blur(50px)",
    // boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
    // background:
    //   "linear-gradient(0deg, rgba(128, 128, 128, 0.2), rgba(128, 128, 128, 0.2)), rgba(0, 0, 0, 0.2)",
    // backgroundBlendMode: "luminosity, normal",
  },
};

export default HeaderStyle;
