import { fontFamilies, varColors } from "../../variable";

const FooterStyle = {
  footerBox: {
    backgroundColor: '#1f1b36',
    padding: "5rem 0 1rem 0",
    position: "relative",
  },
  footerContainer: {
    width: "95%",
    padding: "1rem 0",
    margin: "2rem auto",
    display: "flex",
    justifyContent: "space-between",
    gap: { xl: "", lg: "", md: "", sm: "1rem", xs: "2rem" },
  },
  footerCol1: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    gap: "1.7rem",
    //   backgroundColor:"red"
  },
  footerCol: {
    width: "100%",
    display: "flex",
    alignItems: "flex-start",
    flexDirection: "column",
    gap: "1rem",
    // backgroundColor:"red"
  },
  footerLogoBox: {
    width: "100%",
    height: "3rem",

  },
  footerLogoImage: {

    height: "66px",
    objectPosition: "center",
    objectRepeat: "no-repeat",
    margin: "auto"
  },
  footerIconRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.3rem",
  },
  footerIconBox: {
    height: "35px",
    width: "35px",
    cursor: "pointer",
  },
  footerIcon: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: "center",
    objectRepeat: "no-repeat",
  },
  footerHeading: {
    fontFamily: fontFamilies.primary,
    color: varColors.lightGrayText,
    fontSize: { xl: "1.8rem", lg: "1.8rem", md: "1.7rem", sm: "1.6rem", xs: "1.5rem" },
    // textAlign:"left"
  },

  footerContentCol: {
    width: "100%",
    display: "flex",
    alignItems: "flex-start",
    flexDirection: "column",
    gap: "0.3rem",
  },
  footerContentRow: {
    display: "flex",
    // alignItems:"center",
    justifyContent: "flex-start",
    gap: "0.3rem",
  },
  arrow: {
    color: varColors.lightGrayText,
  },
  footerLinkText: {
    fontSize: { xl: "1rem", lg: "1rem", md: "1rem", sm: "0.9rem", xs: "0.9rem" },
    color: varColors.lightGrayText,
    cursor: "pointer",
    transition: "0.3s ease-in",
    "&:hover": {
      color: "#fff",
    },
  },
  linkBoldText: {
    color: "#fff",
    fontSize: "1rem",
    fontWeight: "600",
  },
  footerSecondContainer: {
    width: "75%",
    padding: "2rem 0 1rem 0",
    margin: "0rem auto",
    display: "flex",
    justifyContent: "space-between",
    borderTop: "1px solid white",
    // backgroundColor:"red"
  },
  secondRowCol1: {
    display: "flex",
    gap: "0.2rem",
    alignItems: "center",
  },
  secondRowCol2: {
    display: "flex",
    gap: "0.2rem",
    alignItems: "center",
    justifyContent: "flex-end",
  },

  footerBoldText: {
    fontSize: { xl: "0.9rem", lg: "0.9rem", md: "0.9rem", sm: "0.8rem", xs: "0.8rem" },
    fontFamily: fontFamilies.primary,
    fontWeight: "550",
    color: "#fff",
  },
};

export default FooterStyle;
