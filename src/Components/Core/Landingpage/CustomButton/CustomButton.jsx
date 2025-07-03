import React from "react";
import Button from "@mui/material/Button";

const CustomButton = ({ title, onClick }) => {
  const styles = {
    btn: {
      color: "#F4F4F4",
      backgroundImage: "linear-gradient(133.88deg, #f36f27 18.32%, #695ea8 100%)",
      boxShadow: "none",
      borderRadius: "10px",
      overflow: "hidden",
      position: "relative",
      transition: "color 0.3s ease-in, background-color 0.3s ease-in",
      "&::before": {
        content: '""',
        position: "absolute",
        top: 0,
        left: "-100%",
        width: "100%",
        height: "100%",
        backgroundColor: "#fff",
        transition: "left 0.3s ease-in",
        zIndex: 0,
        // border:"2px solid red",
        boxShadow: "none"
      },
      "&:hover::before": {
        left: 0,
      },
      "&:hover": {
        color: "#1A8E45",
        backgroundColor: "#1A8E45", // Ensure the background remains green on hover
        border: "2px solid #1A8E45",
      },
      "&:hover .button-content": {
        position: "relative",
        zIndex: 1,
      },
      "&:active": {
        boxShadow: "none", // Remove shadow on active state
        backgroundColor: "#1A8E45", // Prevent blue background on click

      },
      "&:focus": {
        backgroundColor: "#1A8E45", // Prevent blue background on focus
        boxShadow: "none", // Remove shadow on focus state
        // border:"2px solid red",
      },
    },
  };

  return (
    <Button variant="contained" sx={styles.btn} onClick={onClick}>
      <span className="button-content">{title}</span>
    </Button>
  );
};

export default CustomButton;
