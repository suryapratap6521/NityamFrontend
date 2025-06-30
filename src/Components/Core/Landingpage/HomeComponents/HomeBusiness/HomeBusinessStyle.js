import { fontFamilies } from "../../../../../variable";

const HomeBusinessStyle = {
  outerBox: {
    width: "100%",
    margin: "3rem 0",
    display: "flex",
    justifyContent: "center",
  },
  mainGrid: {
    width: "90%",
    display: "flex",
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: "2rem",
    gap: { xl: "2rem", lg: "2rem", md: "2rem", sm: "2rem", xs: "3rem" },
  },
  leftBox: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "1.5rem",
  },
  row1: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "0.3rem",
  },
  smallText: {
    color: "#505050",
    fontSize: "1rem",
  },
  largeText: {
    // fontWeight: "600",
    // fontSize: {"2.3rem",
    lineHeight: {
      xl: "3rem",
      lg: "2.4rem",
      md: "2.2rem",
      sm: "2rem",
      xs: "1.8rem",
    },
    fontSize: {
      xl: "3rem",
      lg: "2.4rem",
      md: "2.2rem",
      sm: "2rem",
      xs: "1.8rem",
    },
    fontFamily: fontFamilies.secondary,
    fontWeight: "500",
    color: "#695ea8",
  },
  gradientText: {
    background: "linear-gradient(90deg, #2faa90 0%, #695ea8 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    color: "transparent",
    display: "inline-block", // ✅ ensures proper clipping/rendering
  },
  paraText: {
    color: "#4E4E4E",
    fontSize: "0.9rem",
    fontWeight: "400",
  },
  greenText: {
    color: "#695ea8",
  },
  btn: {
    color: "#F4F4F4",
    backgroundColor: "#1A8E45",
    boxShadow: "none",
    borderRadius: "10px",
    transition: "0.3s ease-in",
    "&:hover": {
      color: "#1A8E45",
      backgroundColor: "#fff",
      boxShadow: "none",
      border: "1px solid #1A8E45",
      borderRadius: "10px",
    },
  },
  imageBox: {
    width: "100%",
    height: { xl: "29rem", lg: "25rem", md: "23rem", sm: "21rem", xs: "18rem" },
    // background: "red",
  },
  imgbox: {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    // background:"orange"
  },
  image: {
    // width:"100%",
    height: "100%",
    objectFit: "contain",
    objectPosition: "center",
    objectRepeat: "no-repeat",
  },
  btnBox: {
    padding: "1rem 0",
  },
};

export default HomeBusinessStyle;
