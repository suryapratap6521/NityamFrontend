import React, { useEffect } from "react";
import HomeAboutStyle from "./HomeAboutStyle";
import { Grid, Typography, Box } from "@mui/material";
import Button from "@mui/material/Button";
import CustomButton from "../../CustomButton/CustomButton";
import homeAboutImage from "../../../../../assests/Images/homeAbout.png";
import AOS from "aos";
import "aos/dist/aos.css";
import Lottie from "lottie-react";
import AboutAnimation from "../../Animation/AboutAnimatiom.json";

const HomeAbout = () => {
  const styles = HomeAboutStyle;

  useEffect(() => {
    AOS.init({
      duration: 800, // duration of the animation
      easing: "ease-in-out", // easing function
    });
    AOS.refresh(); // refresh AOS to apply any new elements added dynamically
  }, []);

  return (
    <>
      <Box sx={styles.outerBox}>
        <Grid container sx={styles.mainGrid}>
          <Grid
            item
            xl={5.5}
            lg={5.5}
            md={5.5}
            sm={5.5}
            xs={10}
            sx={styles.leftBox}
            data-aos="fade-right" // Apply aos animation for appearing from right
            data-aos-offset="300" // Offset to trigger animation earlier/later
          >
            <Box sx={styles.row1}>
              <Box>
                <Typography sx={styles.smallText}>About Us</Typography>
              </Box>
              <Box>
                <Typography sx={styles.largeText}>
                  Welcome to <span style={styles.greenText}>True</span>
                  <span style={styles.gradientText}> Padosi</span>{" "}
                </Typography>
              </Box>
            </Box>
            <Box>
              <Typography sx={styles.paraText}>
                At Nityam Needs, we believe in the power of community. Our
                platform is designed to foster strong bonds between neighboring
                communities, empowering individuals to come together and support
                one another with valuable information, assistance, and
                camaraderie.
              </Typography>
            </Box>
            <Box>
              <CustomButton title="Read More" />
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
            data-aos="fade-left" // Apply aos animation for appearing from left
            data-aos-offset="300" // Offset to trigger animation earlier/later
          >
            <Box sx={styles.imgbox}>
              <Lottie animationData={AboutAnimation} style={{ height: "100%", width: "100%", objectFit: "contain" }} />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default HomeAbout;
