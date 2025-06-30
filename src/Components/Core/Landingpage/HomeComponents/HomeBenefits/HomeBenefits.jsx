import React, { useEffect } from "react";
import HomeBenefitStyle from "./HomeBenefitStyle";
import { Grid, Typography, Box } from "@mui/material";
import AOS from "aos";
import "aos/dist/aos.css";
import CustomButton from "../../CustomButton/CustomButton";
import cardImage1 from "../../../../../assests/Images/cardImage1.png";
import cardImage2 from "../../../../../assests/Images/cardImage2.png";
import cardImage3 from "../../../../../assests/Images/cardImage3.png";

const HomeBenefits = () => {
  const styles = HomeBenefitStyle;

  useEffect(() => {
    AOS.init({
      duration: 800, // duration of the animation
      easing: "ease-in-out", // easing function
    });
    AOS.refresh(); // refresh AOS to apply any new elements added dynamically
  }, []);

  return (
    <Box sx={styles.outerBox}>
      <Grid container sx={styles.mainGrid}>
        <Box sx={{ width: "100%", textAlign: "center", paddingBottom: "2rem" }}>
          <Typography sx={styles.largeText}>
            Explore Your{"\t"}
            {/* <span style={styles.greenText}>Neig</span> */}
            <span style={styles.gradientText}>Neighbours</span>
          </Typography>
        </Box>
        <Grid
          item
          xl={3}
          lg={3.5}
          md={3.5}
          sm={3.5}
          xs={11.9}
          sx={{ ...styles.card, marginRight: "auto" }}
          data-aos="fade-right"
          data-aos-offset="300"
        >
          <img src={cardImage1} alt="Top Image" style={styles.image} />
          <Box>
            <Typography sx={styles.card1Title}>Essentials</Typography>
          </Box>
          <Box sx={{ width: "90%" }}>
            <Typography sx={styles.card1Des}>
              Relevant news and information from Neighbors, business, and public
              agencies in real time
            </Typography>
          </Box>
          <Box sx={styles.overlay} className="overlay"></Box>
          <Box sx={styles.content} className="card-content">
            <Box>
              <Typography sx={styles.cardTitle}>Essentials</Typography>
            </Box>
            <Typography sx={styles.cardText}>
              Relevant news and information from Neighbors, business, and public
              agencies in real time
            </Typography>
            <CustomButton title="Read More" />
          </Box>
        </Grid>

        <Grid
          item
          xl={3}
          lg={3.5}
          md={3.5}
          sm={3.5}
          xs={11.9}
          sx={{ ...styles.card, marginTop: "auto", marginBottom: "auto" }}
          data-aos="fade-up" // Animation from bottom
          data-aos-offset="300"
        >
          <img src={cardImage2} alt="Top Image" style={styles.image} />
          <Box>
            <Typography sx={styles.card1Title}>Local</Typography>
          </Box>
          <Box sx={{ width: "90%" }}>
            <Typography sx={styles.card1Des}>
              The only way to connect to the people, business, and happenings
              near home.
            </Typography>
          </Box>
          <Box sx={styles.overlay} className="overlay"></Box>
          <Box sx={styles.content} className="card-content">
            <Box>
              <Typography sx={styles.cardTitle}>Local</Typography>
            </Box>
            <Typography sx={styles.cardText}>
              The only way to connect to the people, business, and happenings
              near home.
            </Typography>
            <CustomButton title="Read More" />
          </Box>
        </Grid>
        <Grid
          item
          xl={3}
          lg={3.5}
          md={3.5}
          sm={3.5}
          xs={11.9}
          sx={{ ...styles.card, marginLeft: "auto" }}
          data-aos="fade-left" // Animation from left
          data-aos-offset="300"
        >
          <img src={cardImage1} alt="Top Image" style={styles.image} />
          <Box>
            <Typography sx={styles.card1Title}>Trusted</Typography>
          </Box>
          <Box sx={{ width: "90%" }}>
            <Typography sx={styles.card1Des}>
              A secure environment where all Neighbors are verified.
            </Typography>
          </Box>
          <Box sx={styles.overlay} className="overlay"></Box>
          <Box sx={styles.content} className="card-content">
            <Box>
              <Typography sx={styles.cardTitle}>Trusted</Typography>
            </Box>
            <Typography sx={styles.cardText}>
              A secure environment where all Neighbors are verified.
            </Typography>
            <CustomButton title="Read More" />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HomeBenefits;
