import React, { useEffect } from "react";
import HomeBusinessStyle from "./HomeBusinessStyle";
import { Grid, Typography, Box } from "@mui/material";
import CustomButton from "../../CustomButton/CustomButton";
import homeBusiness from "../../../../../assests/Images/homeBusiness.png";
import AOS from "aos";
import "aos/dist/aos.css";
import Lottie from "lottie-react";
import BusinessAnimation from "../../Animation//BusinessAnimation.json";

const HomeBusiness = () => {
  const styles = HomeBusinessStyle;

  useEffect(() => {
    AOS.init({
      duration: 800, // duration of the animation
      easing: "ease-in-out", // easing function
    });
    AOS.refresh(); // refresh AOS to apply any new elements added dynamically
  }, []);

  return (
    <Grid container sx={styles.mainGrid}>
      <Grid
        item
        xl={5.5}
        lg={6}
        md={5.5}
        sm={5.5}
        xs={10}
        sx={styles.leftBox}
        data-aos="fade-left" // Apply aos animation for appearing from right
        data-aos-offset="300" // Offset to trigger animation earlier/later
      >
        <Box sx={styles.row1}>
          <Box>
            <Typography sx={styles.smallText}>Our Business</Typography>
          </Box>
          <Box>
            <Typography sx={styles.largeText}>
              You can promote your business.
            </Typography>
          </Box>
          <Box>
            <Typography sx={styles.largeText}>
              <span style={styles.greenText}> just write away</span>
              <span style={styles.gradientText}> an email to us.</span>{" "}
            </Typography>
          </Box>
        </Box>
        <Box>
          <Typography sx={styles.paraText}>
            It is a long established fact that a reader will be distracted by
            the readable content of a page when looking at its layout. The point
            of using Lorem Ipsum is that it has a more-or-less normal
            distribution of letters, as opposed to using 'Content here, content
            here', making it look like readable English.
          </Typography>
        </Box>
        <Box sx={styles.btnBox}>
                <CustomButton title="Read More"/>
            </Box>
      </Grid>
      <Grid
        item
        xl={5.5}
        lg={5.5}
        md={5.5}
        sm={5.5}
        xs={10}
        sx={styles.imageBox}
        data-aos="fade-right"
        data-aos-offset="300" 
      >
        <Box sx={styles.imgbox}>
        <Lottie animationData={BusinessAnimation}  style={{ height: "100%", width: "100%", objectFit: "contain" }}/>
        </Box>
      </Grid>
    </Grid>
  );
};

export default HomeBusiness;
