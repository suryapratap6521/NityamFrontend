import { Box, Grid, Typography } from "@mui/material";
import React from "react";
import HomeBannerStyle from "./HomeBannerStyle";
import ChangingTextBanner from "../../AnimatedText/ChangingTextBanner"; // Ensure this path is correct
import { TextField, Button, InputAdornment, useMediaQuery } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import bannerImage1 from "../../../../../assests/Images/bannerImage1.png";
import bannerImage2 from "../../../../../assests/Images/bannerImage2.png";
import bannerImage3 from "../../../../../assests/Images/bannerImage3.png";
import arrowImg from "../../../../../assests/Images/arrowImg.svg";
import Lottie from "lottie-react";
import ChatAnimation from "../../Animation/ChatAnimation.json";

const HomeBanner = () => {
  const below500px = useMediaQuery("(max-width: 500px)");
  const styles = HomeBannerStyle;

  const handleSearch = () => {
    // Implement your search logic here
    console.log("Searching...");
  };

  return (
    <Box sx={styles.box1}>
      <Grid container sx={styles.bannerGrid}>
        <Box sx={{ ...styles.animatedBox, height: below500px ? "7rem" : "10rem" }}>
          <Lottie animationData={ChatAnimation} style={{ height: "100%", width: "100%", objectFit: "contain" }} />
        </Box>

        <Grid item xl={6} lg={7} md={5.5} sm={5} xs={12} sx={styles.mainGridLeft}>
          <Box>
            <Box>
              <Typography sx={styles.largeText}>
                Explore Your{"\t"}
                <span style={styles.greenText}>Neig</span>
                <span style={styles.gradientText}>hbours</span>
              </Typography>
            </Box>
            <Box>
              <Typography sx={styles.greenTextLarge}>Connections</Typography>
            </Box>
          </Box>
          <Box sx={styles.rotatingTextBox}>
            <ChangingTextBanner />
          </Box>
          <Box sx={{ width: "100%" }}>
            <Grid container sx={styles.inputBox} className="inputBoxClass">
              <Grid item>
                <TextField
                  variant="standard"
                  placeholder={below500px ? "Search" : "Search Your Community Here"}
                  sx={styles.inptField}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item>
                <Button variant="contained" onClick={handleSearch} sx={styles.searchBtn}>
                  Search
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Grid>
        <Grid item container xl={5.5} lg={4} md={6} sm={6} xs={10} sx={styles.imageRow}>
          <Box sx={styles.arrowBox} className="classArrowBox">
            <img src={arrowImg} alt="arrow" />
          </Box>
          <Grid item xl={5} lg={5} md={5} sm={5} xs={5} sx={styles.imageTopBox1} className="classImageTopBox1">
            <img src={bannerImage1} style={styles.imageTop} alt="banner 1" />
          </Grid>
          <Grid item xl={6.8} lg={6.5} md={6.8} sm={6.8} xs={6.8} sx={styles.imageTopBox2} className="classImageTopBox2">
            <img src={bannerImage2} style={styles.imageTop} alt="banner 2" />
          </Grid>
          <Grid item xl={12} lg={11} md={12} sm={12} xs={12} sx={styles.imageBottomBox}>
            <img src={bannerImage3} style={styles.imageBottom} alt="banner 3" />
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HomeBanner;
