import { keyframes } from "@mui/system";
import benefitsBgImg1 from "../../../../../assests/Images/benefitsBgImg1.jpg";
import { fontFamilies } from "../../../../../variable";

const moveUp = keyframes`
  0% {
    transform: translateY(0rem);
  }
  10% {
    transform: translateY(0rem);
  }
  20% {
    transform: translateY(-2.3rem);
  }
  30% {
    transform: translateY(-2.3rem);
  }
  40% {
    transform: translateY(-4.6rem);
  }
  50% {
    transform: translateY(-4.6rem);
  }
  60% {
    transform: translateY(-6.9rem);
  }
  70% {
    transform: translateY(-6.9rem);
  }
  80% {
    transform: translateY(-9.2rem);
  }
  90% {
    transform: translateY(-9.2rem);
  }
  100% {
    transform: translateY(0);
  }
`;

const HomeBenefitStyle = {
  outerBox: {
    width: "100%",
    margin: "4rem 0",
    display: "flex",
    justifyContent: "center",
  },
  mainGrid: {
    width: "90%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: "2rem",
    gap: { xl: "2rem", lg: "2rem", md: "2rem", sm: "2rem", xs: "3rem" },
  },
  largeText: {
    fontWeight: "600",
    color: "#695ea8",
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
  gradientText: {
    backgroundImage: "linear-gradient(133.88deg, #f36f27 18.32%, #695ea8 100%)", // ✅ correct
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text", // for Firefox
    fontWeight: 600,
    fontFamily: "Roboto, Arial, sans-serif",
    color: "transparent", // fallback
  },
  greenText: {
    color: "#695ea8",
    fontWeight: "600",
    fontFamily: "Roboto, Arial, sans-serif", // Example font family
  },
  //   card: {
  //     width: "100%",
  //     height: "18rem",
  //     background: "red",
  //     boxShadow: "5px 5px 7px rgba(0,0,0,0.4)",
  //     position: "relative",
  //     overflow: "hidden",
  //     transition: "transform 0.3s ease-in-out",
  //     "&:hover": {
  //       transform: "scale(1.05)",
  //     },
  //   },
  //   container: {
  //     position: "relative",
  //     width: "100%", // Adjust as needed
  //     height: "18rem", // Adjust as needed
  //     backgroundImage: `url(${benefitsBgImg1})`, // Replace with your image URL
  //     backgroundSize: "cover",
  //     backgroundPosition: "center",
  //     display: "flex",
  //     alignItems: "center",
  //     justifyContent: "center",
  //     textAlign: "center",
  //     color: "#fff", // Text color
  //     overflow: "hidden",
  //   },
  //   overlay: {
  //     position: "absolute",
  //     top: 0,
  //     left: 0,
  //     width: "100%",
  //     height: "100%",
  //     backgroundColor: "rgba(0, 0, 0, 0.5)", // Black overlay with 50% opacity
  //   },
  //   content: {
  //     position: "relative",
  //     width: "100%",
  //     zIndex: 1,
  //     padding: "20px", // Adjust as needed
  //     display: "flex",
  //     flexDirection: "column",
  //     alignItems: "center",
  //     justifyContent: "center",
  //     gap: "1.5rem",
  //   },
  //   cardTitle1: {
  //     color: "#fff",
  //     fontWeight: "500",
  //     fontSize: "1.5rem",
  //   },
  //   cardText: {
  //     color: "#fff",
  //     fontSize: "0.9rem",
  //   },
  //   hoverBox: {
  //     width: "100%",
  //     height: "100%",
  //     position: "absolute",
  //     top: "0",
  //     left: "0",
  //     backgroundColor: "rgba(0, 0, 0, 0.5)",
  //     opacity: 0,
  //     transition: "opacity 0.3s ease-in-out",
  //     zIndex: 2,
  //   },
  //   ".hover-trigger:hover + .container .hover-content": {
  //     visibility: "visible",
  //     opacity: 1,
  //     transition: "opacity 0.3s ease-in-out",
  //   },
  card: {
    width: "100%",
    height: "22rem",
    position: "relative",
    overflow: "hidden",
    cursor: "pointer",
    padding: "1.5rem 0",
    boxShadow: "2px 2px 11px 1px rgba(0, 0, 0, 0.3)",
    transition: "transform 0.4s ease-in",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1.5rem",
    "&:hover": {
      transform: "scale(1.05)",
      "& .overlay": {
        opacity: 1,
        filter: "brightness(50%)",
      },
      "& .card-content": {
        opacity: 1,
      },
    },
  },
  image: {
    width: "50%",
    height: "10rem",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundImage: `url(${benefitsBgImg1})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    opacity: 0,
    transition: "opacity 0.3s ease-in-out, filter 0.3s ease-in-out",
  },
  content: {
    position: "absolute", // Change from relative to absolute
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: 2, // Ensure it's above the overlay
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "1.5rem",
    transition: "opacity 0.3s ease-in-out",
    opacity: 0,
    color: "#fff",
    textAlign: "center", // Center the text
  },
  card1Title: {
    color: "#000",
    fontWeight: "500",
    fontSize: "1.5rem",
  },
  card1Des: {
    color: "#000",
    fontSize: "0.9rem",
    textAlign: "center",
  },
  cardTitle: {
    color: "#fff",
    fontWeight: "500",
    fontSize: "1.5rem",
  },
  cardText: {
    color: "#fff",
    fontSize: "0.9rem",
  },
  button: {
    color: "#F4F4F4",
    backgroundColor: "#1A8E45",
    boxShadow: "none",
    borderRadius: "10px",
    transition: "color 0.3s ease-in, background-color 0.3s ease-in",
    "&:hover": {
      color: "#1A8E45",
      backgroundColor: "#fff",
      boxShadow: "none",
      border: "1px solid #1A8E45",
      borderRadius: "10px",
    },
  },
};

export default HomeBenefitStyle;
