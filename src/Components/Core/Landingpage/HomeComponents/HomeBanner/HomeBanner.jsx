import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  InputAdornment,
  useMediaQuery,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import HomeBannerStyle from "./HomeBannerStyle";
import ChangingTextBanner from "../../AnimatedText/ChangingTextBanner";
import bannerImage1 from "../../../../../assests/Images/bannerImage1.png";
import bannerImage2 from "../../../../../assests/Images/bannerImage2.png";
import bannerImage3 from "../../../../../assests/Images/bannerImage3.png";
import arrowImg from "../../../../../assests/Images/arrowImg.svg";
import Lottie from "lottie-react";
import ChatAnimation from "../../Animation/ChatAnimation.json";
import { fetchAccessToken, fetchAreaSuggestions } from "../../../../../config/fetching_location";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const HomeBanner = () => {
  const below500px = useMediaQuery("(max-width: 500px)");
  const styles = HomeBannerStyle;
  const navigate=useNavigate();

  const [address, setAddress] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [accessToken, setAccessToken] = useState("");

  // Function to debounce API calls
  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  // Fetch access token on component mount or when expired
  const initializeAccessToken = async () => {
    try {
      const token = await fetchAccessToken();
      setAccessToken(token);
    } catch (error) {
      console.error("Failed to initialize access token:", error.message);
      toast.error("Unable to initialize access token.");
    }
  };

  useEffect(() => {
    initializeAccessToken();
  }, []);

  // Fetch suggestions for a given query
  const fetchSuggestions = async (query) => {
    if (!query) {
      setSuggestions([]);
      return;
    }
    try {
      const results = await fetchAreaSuggestions(query, accessToken);
      setSuggestions(results);
    } catch (error) {
      if (error.response?.status === 401) {
        // Token expired, fetch a new one
        toast.info("Refreshing access token...");
        await initializeAccessToken();
      } else {
        console.error("Error fetching suggestions:", error.message);
      }
      setSuggestions([]);
    }
  };

  const debouncedFetchSuggestions = debounce(fetchSuggestions, 300);

  // Handle address input change
  const handleAddressChange = (e) => {
    const value = e.target.value;
    setAddress(value);
    debouncedFetchSuggestions(value);
  };

  // Handle selecting an area
  const handleAreaClick = (area) => {
    console.log("Selected Area:", area);
    navigate('/login')
    // Perform navigation or other actions as needed
  };

  // Handle search button click
  const handleSearch = () => {
    console.log("Searching for:", address);
    navigate("/login")
  };

  return (
    <Box sx={styles.box1}>
      <Grid container sx={styles.bannerGrid}>
        <Box sx={{ ...styles.animatedBox, height: below500px ? "7rem" : "10rem" }}>
          <Lottie
            animationData={ChatAnimation}
            style={{ height: "100%", width: "100%", objectFit: "contain" }}
          />
        </Box>

        <Grid item xl={6} lg={7} md={5.5} sm={5} xs={12} sx={styles.mainGridLeft}>
          <Box>
            <Typography sx={styles.largeText}>
              Explore Your{" "}
              <span style={styles.greenText}>Neig</span>
              <span style={styles.gradientText}>hbours</span>
            </Typography>
            <Typography sx={styles.greenTextLarge}>Connections</Typography>
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
                  value={address}
                  onChange={handleAddressChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
                {suggestions.length > 0 && (
                  <ul className="suggestions-dropdown">
                    {suggestions.map((suggestion, index) => (
                      <li
                        key={index}
                        onClick={() => handleAreaClick(suggestion.formattedAddress)}
                        className="suggestion-item"
                      >
                        {suggestion.formattedAddress}
                      </li>
                    ))}
                  </ul>
                )}
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
          <Grid item xl={5} lg={5} md={5} sm={5} xs={5} sx={styles.imageTopBox1}>
            <img src={bannerImage1} style={styles.imageTop} alt="banner 1" />
          </Grid>
          <Grid item xl={6.8} lg={6.5} md={6.8} sm={6.8} xs={6.8} sx={styles.imageTopBox2}>
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
