import React, { useRef, useState } from "react";
import { Box, Typography, Grid } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { IconButton } from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";

import HomeServiceStyle from "./HomeServiceStyle"; // Adjust the path as per your file structure

import slideImage1 from "../../../../../assests/Images/slideImage1.png";
import slideImage2 from "../../../../../assests/Images/slideImage2.png";
import slideImage3 from "../../../../../assests/Images/slideImage3.png";
import slideImage4 from "../../../../../assests/Images/slideImage4.png";

const HomeService = () => {
  const styles = HomeServiceStyle;
  const swiperRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const goNext = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideNext();
    }
  };

  const goPrev = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slidePrev();
    }
  };

  const slidesContent = [
    {
      text: "Connect With Friends",
    },
    {
      text: "You Can Chat",
    },
    {
      text: "Upload Post",
    },
    {
      text: "Grow Business",
    },
  ];

  const handleSlideChange = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      setCurrentSlide(swiperRef.current.swiper.realIndex);
    }
  };

  return (
    <>
      <Box sx={styles.headingBox}>
        <Typography sx={styles.largeText}>
          Our{"\t"}
          <span style={styles.greenText}>Ser</span>
          <span style={styles.gradientText}>vice</span>
        </Typography>
      </Box>
      <Box sx={styles.outerBox}>
        <Grid container sx={styles.gridMain}>
          <Grid item xl={5} lg={5.5} md={5.5} sm={5.5} xs={10} sx={styles.gridLeft}>
            <Box>
              <Typography sx={styles.largeText2}>Best Service</Typography>
              <Typography sx={styles.largeText2}>Provided By Us:</Typography>
            </Box>
            <Box sx={styles.changingTextBox}>
              <Typography sx={styles.changingText}>
                {slidesContent[currentSlide].text.split(" ").slice(0, -1).join(" ")}
                <span style={styles.gradientText}>
                  {" "}
                  {slidesContent[currentSlide].text.split(" ").slice(-1)}
                </span>
              </Typography>
            </Box>
            <Box sx={styles.btnBox}>{/* CustomButton component */}</Box>
          </Grid>
          <Grid item xl={5.5} lg={6} md={5.5} sm={5.5} xs={10} sx={styles.mainRight}>
            <Box sx={styles.swiperContainer}>
              <Swiper
                ref={swiperRef}
                spaceBetween={10}
                slidesPerView={1.2}
                loop={true}
                navigation={{
                  nextEl: `.${styles.nextButton}`,
                }}
                onSlideChange={handleSlideChange}
                sx={styles.swiper}
              >
                {slidesContent.map((slide, index) => (
                  <SwiperSlide key={index} sx={styles.swiperSlide}>
                    <Box
                      sx={{
                        ...styles.imageBox,
                        filter: index !== currentSlide ? "blur(6px)" : "none",
                      }}
                    >
                      <img
                        src={index === 0 ? slideImage1 : index === 1 ? slideImage2 : index === 2 ? slideImage3 : slideImage4}
                        alt={`Slide ${index + 1}`}
                        style={styles.swiperImg}
                      />
                    </Box>
                  </SwiperSlide>
                ))}
              </Swiper>
              <Box sx={styles.btnBoxRel}>
                <IconButton
                  className={`${styles.navigationButton} ${styles.nextButton}`}
                  aria-label="next"
                  onClick={goNext}
                >
                  <ArrowForward />
                </IconButton>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default HomeService;
