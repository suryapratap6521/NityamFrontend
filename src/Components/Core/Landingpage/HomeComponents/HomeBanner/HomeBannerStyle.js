import { fontFamilies } from "../../../../../variable";
// import bannerImage1 from "../../../assets/Images/bannerImage1.png";
// import bannerImage2 from "../../../assets/Images/bannerImage.png";
// import bannerImage3 from "../../../assets/Images/bannerImage3.png";
import { createTheme } from "@mui/material/styles";

const theme = createTheme();

const HomeBannerStyle = {
  box1: {
    marginTop: "0rem",
    paddingTop: "7rem",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    background:
      "linear-gradient(133.88deg, #FEFEFE 18.32%, rgba(10, 211, 23, 0.33) 100%)",
  },
  bannerGrid: {
    width: "90%",
    // padding: {xl:"1rem 5rem 3rem 5rem"},
    display: "flex",
    padding: "0 0 3rem 0",
    justifyContent: "center",
    gap: "2rem",
    position: "relative",
    // gap:"1rem",
    // background:"red"
  },
  animatedBox: {
    position: "absolute",
    top: "-3rem",
    right: 0,
    zIndex: 10, // Ensure it appears above other content
    width: "auto",
    // background:"red"
    // height: "12em",
  },
  mainGridLeft: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    gap: "2rem",
    width: "100%",
    // background:"Red"
  },
  largeText: {
    fontWeight: "600",
    fontSize: {
      xl: "3.2rem",
      lg: "3rem",
      md: "2.8rem",
      sm: "2.1rem",
      xs: "2rem",
    },
    lineHeight: {
      xl: "3.2rem",
      lg: "3rem",
      md: "2.8rem",
      sm: "2.3rem",
      xs: "2rem",
    },
    fontFamily: fontFamilies.secondary,
    "&.MuiTypography-root": {
      fontWeight: "600",
    },
    // color: "black",
  },
  gradientText: {
    background: "linear-gradient(90deg, #F9ED25 0%, #1E8D44 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    fontWeight: "600",
    color: "transparent",
    fontFamily: fontFamilies.secondary,
  },
  // paraText: {
  //   color: "#4E4E4E",
  //   fontSize: "0.9rem",
  //   fontWeight: "400",
  // },
  greenText: {
    color: "green",
    fontWeight: "600",
    fontFamily: fontFamilies.secondary,
  },
  greenTextLarge: {
    fontSize: {
      xl: "3.2rem",
      lg: "3rem",
      md: "2.8rem",
      sm: "2.1rem",
      xs: "2rem",
    },
    lineHeight: {
      xl: "3.2rem",
      lg: "3rem",
      md: "2.8rem",
      sm: "2.3rem",
      xs: "2rem",
    },
    color: "green",
    // fontWeight: "bold",

    fontWeight: "600 !important",
    fontFamily: fontFamilies.secondary,
    "&.MuiTypography-root": {
      fontWeight: "600",
    },
  },
  rotatingTextBox: {
    width: "100%",
    textAlign: "center",
    marginBottom: { xl: "0", lg: "0", md: "0", sm: "2rem", xs: "2rem" },
    justifyContent: "flex-start",
  },
  inputBox: {
    width: { xl: "70%", lg: "70%", md: "70%", sm: "70%", xs: "95%" },
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "initial",
    padding: "0.1rem 0.1rem 0.1rem 0.5rem",
    backgroundColor: "#fff",
    borderRadius: "10%",
    /* Component 1 */
    border: "0.948806px solid #282828",
    boxShadow: " 0px 1.09234px 1.09234px rgba(0, 0, 0, 0.25)",
    borderRadius: "38.5347px",
    zIndex: "1000",
  },

  searchBtn: {
    borderRadius: "38.5347px",
    backgroundColor: "#2250F0",

    // padding:""
    // width:"4rem"
  },
  inptField: {
    "& .MuiInput-underline:before": {
      borderBottom: "none !important", // Remove default underline
      paddingLeft: {
        xl: "1rem",
        lg: "1rem",
        md: "1rem",
        sm: "1rem",
        xs: "0.5rem",
      },
    },
    "& .MuiInputBase-input": {
      padding: "5px 16px", // Adjust input text padding
      borderBottom: "none !important",
      paddingLeft: {
        xl: "1rem",
        lg: "1rem",
        md: "1rem",
        sm: "1rem",
        xs: "0.5rem",
      },
      minWidth: {
        xl: "100%",
        lg: "100%",
        md: "fit-content",
        sm: "100%",
        xs: "100%",
      },
    },
    "& .MuiInput-underline:after": {
      borderBottom: "none !important", // Remove the focus underline
    },
  },
  searchBtn: {
    borderRadius: "38.5347px",
    backgroundColor: "#2250F0",
    color: "#ffffff",
    "&:hover": {
      backgroundColor: "#1a3fb8",
    },
  },
  imageRow: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    // background: "red",
    width: "100%",
    position: "relative",
  },
  arrowBox: {
    position: "absolute",
    right: "-1rem",
    top: "40%",
  },
  imageTopBox1: {
    width: "100%",
    height: "14rem",

  },
  imageTopBox2: {
    width: "100%",
    height: "14rem",
  },
  imageTop: {
    height: "100%",
    width: "100%",
    objectFit:"cover",
    objectPosition:"center",
    objectRepeat:"no-repeat",
    borderRadius: "1rem",
  },
  imageBottomBox: {
    width: "100%",
    height: "7rem",
    // background:"Red",
    marginTop: "0.4rem",
  },
  imageBottom: {
    height: "100%",
    width: "100%",
    objectFit: "cover",
    objectPosition: "center",
    objectRepeat: "no-repeat",
    borderRadius: "1rem",
  },
};

export default HomeBannerStyle;
