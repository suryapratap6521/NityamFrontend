import { SliderMark } from "@mui/material";
// import mpbg from "../../assets/Images/mapbg.png";
const HomeContactStyle = {
  hcgridcontainer: {

    height: "100%",
    width: "90%",
    margin: "4rem auto",
    background: "#fff",
    display: "flex",
    justifyContent: {
      xl: "center",
      lg: "center",
      md: "center",
      sm: "center",
      xs: "center",
    },
    gap:{xl:"1rem",lg:"1rem",md:"1rem",sm:"2rem",xs:"2rem"}
  },
  hcl: {
    height: "100%",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    // justifyContent:"space-between",
    alignItems: "flex-start",
  },
  tangibleheadingone: {
    color: "#000",
    fontWeight: "550",
    fontSize: {
      xl: "3rem",
      lg: "2.7rem",
      md: "2.5rem",
      sm: "2.3rem",
      xs: "2rem",
    },
    textAlign: "left",
  },
  tangibleheadingtwo: {
    textAlign: "left",
    color: "transparent",
    fontWeight: "550",
    fontSize: {
      xl: "3rem",
      lg: "2.7rem",
      md: "2.5rem",
      sm: "2.3rem",
      xs: "2rem",
    },
    lineHeight: {
      xl: "3rem",
      lg: "2.7rem",
      md: "2.5rem",
      sm: "2.3rem",
      xs: "2rem",
    },
    // backgroundImage: `linear-gradient(90deg, #9BFFD9 40%, #523DFC 100%)`,
    background: "linear-gradient(90deg, #F9ED25 0%, #1E8D44 100%)",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
  },
  hclupperrow: {
    width: "100%",
    padding: "0px 0",
  },
  hcllowerrow: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-evenly",
    height: "50%",
    margin: "15px 0px",
  },
  hcllowerrowr: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    // height: "25px",
    width: "100%",
    margin: "5px 0",
  },
  hcllowerrowiconbox: {
    height: "100%",
    width: "30px",
  },
  hcllowerrowiconboximg: {
    height: "100%",
    width: "100%",
    objectFit: "contain",
  },
  hcllowerrowtext: {
    fontSize: { md: "1rem", xs: "0.9rem" },
    color: "#000",
  },
  hcr: {
    // height: "100%",
  
    width: "100%",
    background: "#fff",
    backgroundBlendMode: "luminosity, normal",
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.4)",
    backdropFilter: " blur(50px)",
    border: "2px solid #000",
    borderRadius: "24px",
    padding: "20px 30px",
    color: "#000",
  },
  inptfield: {
    color:"#000",
    width: "100%",
    "& .MuiInputLabel-root": {
      color: "#000",
      borderBottomColor: "#000",
    },
    "& .MuiInput-underline:before": {
      // color:"#fff",
      borderBottomColor:  "#000",
    },
    "& .MuiInput-underline:after": {
      color:  "#000",
      borderBottomColor:  "#000",
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "rgba(0,0,0,0.9)",
      fontWeight:"550"
    },
    "& .MuiInput-underline:focused": {
      color:  "#000",
      borderBottomColor:  "#000",
    },
    "& .MuiInput-underline::hover": {
      color:  "#000",
      borderBottomColor:  "#000",
    },
    "&:hover .MuiInput-underline:before": {
      borderBottomColor:  "#000",
    },
    "& .MuiInputBase-input": {
      color:  "#000",
    },
    input: {
      "&:-webkit-autofill": {
        WebkitBoxShadow: ` 0 0 0 1000px transparent inset`,
        transition: "background-color 5000s ease-in-out 0s !important",
        backgroundColor: `transparent ! important`,
        "-webkit-text-fill-color": "#fff !important",
      },
    },
  },
  inputrow: {
    minHeight: "30px",
    margin: "20px 0",
  },
  erortxt: {
    color: "rgba(255,0,0,0.5)",
  },
};

export default HomeContactStyle;
