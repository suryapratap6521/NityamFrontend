import { fontFamilies } from "../../../../../variable";

const HomeServiceStyle = {
  outerBox: {
    width: "100%",
    padding: "1rem 0",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    // height: "100vh",
  },
  largeText: {
    fontWeight: "600",
    color: "#695ea8",
    textAlign: 'center',
    fontSize: {
      xl: "3.2rem",
      lg: "3rem",
      md: "2.8rem",
      sm: "2.3rem",
      xs: "2rem",
    },
    lineHeight: {
      xl: "3.2rem",
      lg: "3rem",
      md: "2.8rem",
      sm: "2.3rem",
      xs: "2rem",
    },
    fontFamily: fontFamilies.secondary, // Example font family
    "&.MuiTypography-root": {
      fontWeight: "600",
      fontSize: {
        xl: "3.2rem",
        lg: "3rem",
        md: "2.8rem",
        sm: "2.3rem",
        xs: "2rem",
      },
    },
  },
  largeText3: {
    fontWeight: "600",
    color: "#695ea8",
    fontSize: {
      xl: "2.6rem",
      lg: "2.3rem",
      md: "2.1rem",
      sm: "1.9rem",
      xs: "1.5rem",
    },
    lineHeight: {
      xl: "2.6rem",
      lg: "2.3rem",
      md: "2.1rem",
      sm: "1.9rem",
      xs: "1.5rem",
    },
    fontFamily: fontFamilies.secondary, // Example font family
    fontWeight: "600",
    "&.MuiTypography-root": {
      fontWeight: "600",
      fontSize: {
        xl: "2.6rem",
        lg: "2.3rem",
        md: "2.1rem",
        sm: "1.9rem",
        xs: "1.5rem",
      },
    },
  },
  gradientText: {
    backgroundImage: "linear-gradient(133.88deg, #2faa90 18.32%, #695ea8 100%)", // ✅ correct
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text", // for Firefox
    fontWeight: 600,
    fontFamily: "Roboto, Arial, sans-serif",
    color: "transparent", // fallback
  },
  //   greenText: {
  //     color: "green",
  //     fontWeight: "600",
  //     fontFamily: "Roboto, Arial, sans-serif", // Example font family
  //   },
  headingBox: {
    marginBottom: "1rem",
  },
  gridMain: {
    width: "100%",
    padding: "2rem 0",
    display: "flex",
    justifyContent: "flex-end",
    // gap:"2rem",
    // background:"yellow",
    alignItems: "center",
  },
  grifLeft: {
    paddingLeft: "1.5rem",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    gap: "2rem",
  },
  largeText2: {
    // fontWeight: "600",
    textAlign: "left",
    color: "#695ea8",
    fontSize: {
      xl: "2.6rem",
      lg: "2.3rem",
      md: "2.1rem",
      sm: "1.9rem",
      xs: "1.5rem",
    },
    lineHeight: {
      xl: "2.6rem",
      lg: "2.3rem",
      md: "2.1rem",
      sm: "1.9rem",
      xs: "1.5rem",
    },
    // fontFamily: fontFamilies.secondary, // Example font family
    fontWeight: "600",
    "&.MuiTypography-root": {
      fontWeight: "600",
      fontSize: {
        xl: "2.6rem",
        lg: "2.3rem",
        md: "2.1rem",
        sm: "1.9rem",
        xs: "1.5rem",
      },
    },
  },
  gridLeft: {
    paddingLeft: "2rem"
  },
  changingText: {
    fontSize: {
      xl: "3rem",
      lg: "2.3rem",
      md: "2.5rem",
      sm: "2.3rem",
      xs: "2rem",
    },
    width: {
      xl: "70%",
      lg: "70%",
      md: "70%",
      sm: "70%",
      xs: "70%",
    },
    fontFamily: fontFamilies.secondary,
    fontWeight: "650",
    color: "green",
    position: "relative",
    display: "inline-block",
    paddingBottom: "10px", // Adjust padding as needed
    "&::after": {
      content: '""',
      position: "absolute",
      left: 0,
      bottom: 0,
      height: "2px", // Adjust underline thickness as needed
      width: "100%",
      backgroundColor: "#000", // Adjust underline color as needed
    },
  },
  changingTextBox: {
    padding: "1rem 0",
  },
  btnBox: { padding: "1rem 0" },
  mainLeft: {
    width: "100%",
    padding: "2rem 0",
  },
  mainRight: {
    width: "100%",
    // backgroundColor:"red"
  },
  swiperContainer: {
    width: "100%",
    position: "relative",
    // padding: "1rem",
    // height: "2 0rem",
  },
  swiper: {
    width: "100%",
    // position: "relative",
  },
  swiperSlide: {
    width: "100%",
  },
  imageBox: {
    width: "100%",
    height: { xl: "24rem", lg: "18rem", md: "18rem", sm: "18rem", xs: "!6rem" },
  },
  swiperImg: {
    height: "100%",
    width: "100%",
  },
  btnBoxRel: {
    position: "absolute",
    right: "8rem",
    top: "50%",
    transform: "translate(50%, -50%)",
    zIndex: "100",
    padding: "0.3rem",
    background: "green",
    borderRadius: "50%",
    border: "3px solid #fff",
  },
};

export default HomeServiceStyle;
