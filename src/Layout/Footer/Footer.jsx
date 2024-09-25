import React from "react";
import FooterStyle from "./FooterStyle";
import { Grid, Box, Typography } from "@mui/material";
import logoImage from "../../assests/Images/logoImage.png";
import whatsappIcon from "../../assests/Images/whatsappIcon.png";
import twitterIcon from "../../assests/Images/twitterIcon.png";
import facebookIcon from "../../assests/Images/facebookIcon.png";
import instagramIcon from "../../assests/Images/instagramIcon.png";
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";
import CopyrightIcon from "@mui/icons-material/Copyright";
import { varColors } from "../../variable";

const Footer = () => {
  const styles = FooterStyle;
  return (
    <>
      <Box sx={styles.footerBox} className="footerImage">
        <Grid container sx={styles.footerContainer}>
          <Grid
            item
            xl={2.8}
            lg={2.8}
            md={2.8}
            sm={5}
            xs={10}
            sx={styles.footerCol1}
          >
            <Box sx={styles.footerLogoBox}>
              <img src={logoImage} style={styles.footerLogoImage} />
            </Box>
            <Box sx={styles.footerIconRow}>
              <Box sx={styles.footerIconBox}>
                <img src={whatsappIcon} style={styles.footerIcon} />
              </Box>
              <Box sx={styles.footerIconBox}>
                <img src={facebookIcon} style={styles.footerIcon} />
              </Box>
              <Box sx={styles.footerIconBox}>
                <img src={instagramIcon} style={styles.footerIcon} />
              </Box>
              <Box sx={styles.footerIconBox}>
                <img src={twitterIcon} style={styles.footerIcon} />
              </Box>
            </Box>
          </Grid>
          <Grid
            item
            xl={2.8}
            lg={2.8}
            md={2.8}
            sm={5}
            xs={10}
            sx={styles.footerCol}
          >
            <Box sx={styles.footerColHeadingBox}>
              <Typography sx={styles.footerHeading}>Services</Typography>
            </Box>
            <Box sx={styles.footerContentCol}>
              <Box sx={styles.footerContentRow}>
                <Box>
                  <DoubleArrowIcon sx={styles.arrow} />
                </Box>
                <Box>
                  <Typography sx={styles.footerLinkText}>
                    Advanced Website Package
                  </Typography>
                </Box>
              </Box>
              <Box sx={styles.footerContentRow}>
                <Box>
                  <DoubleArrowIcon sx={styles.arrow} />
                </Box>
                <Box>
                  <Typography sx={styles.footerLinkText}>
                    E-commerce Solutions
                  </Typography>
                </Box>
              </Box>
              <Box sx={styles.footerContentRow}>
                <Box>
                  <DoubleArrowIcon sx={styles.arrow} />
                </Box>
                <Box>
                  <Typography sx={styles.footerLinkText}>
                    Digital Marketing
                  </Typography>
                </Box>
              </Box>
              <Box sx={styles.footerContentRow}>
                <Box>
                  <DoubleArrowIcon sx={styles.arrow} />
                </Box>
                <Box>
                  <Typography sx={styles.footerLinkText}>
                    Brand Identity Package
                  </Typography>
                </Box>
              </Box>
              <Box sx={styles.footerContentRow}>
                <Box>
                  <DoubleArrowIcon sx={styles.arrow} />
                </Box>
                <Box>
                  <Typography sx={styles.footerLinkText}>
                    Basic Website Package
                  </Typography>
                </Box>
              </Box>
              <Box sx={styles.footerContentRow}>
                <Box>
                  <DoubleArrowIcon sx={styles.arrow} />
                </Box>
                <Box>
                  <Typography sx={styles.footerLinkText}>
                    Cross-Platform App
                  </Typography>
                </Box>
              </Box>
              <Box sx={styles.footerContentRow}>
                <Box>
                  <DoubleArrowIcon sx={styles.arrow} />
                </Box>
                <Box>
                  <Typography sx={styles.footerLinkText}>
                    Monthly Maintenance Plans
                  </Typography>
                </Box>
              </Box>
              <Box sx={styles.footerContentRow}>
                <Box>
                  <DoubleArrowIcon sx={styles.arrow} />
                </Box>
                <Box>
                  <Typography sx={styles.footerLinkText}>
                    Ad Hoc Support
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
          <Grid
            item
            xl={2.8}
            lg={2.8}
            md={2.8}
            sm={5}
            xs={10}
            sx={styles.footerCol}
          >
            <Box sx={styles.footerColHeadingBox}>
              <Typography sx={styles.footerHeading}>Products</Typography>
            </Box>
            <Box sx={styles.footerContentCol}>
              <Box sx={styles.footerContentRow}>
                <Box>
                  <DoubleArrowIcon sx={styles.arrow} />
                </Box>
                <Box>
                  <Typography sx={styles.footerLinkText}>
                    The Wingshield HoMS
                  </Typography>
                </Box>
              </Box>
              <Box sx={styles.footerContentRow}>
                <Box>
                  <DoubleArrowIcon sx={styles.arrow} />
                </Box>
                <Box>
                  <Typography sx={styles.footerLinkText}>
                    The Wingshield CRM
                  </Typography>
                </Box>
              </Box>
              <Box sx={styles.footerContentRow}>
                <Box>
                  <DoubleArrowIcon sx={styles.arrow} />
                </Box>
                <Box>
                  <Typography sx={styles.footerLinkText}>
                    The Wingshield IMS/POS
                  </Typography>
                </Box>
              </Box>
              <Box sx={styles.footerContentRow}>
                <Box>
                  <DoubleArrowIcon sx={styles.arrow} />
                </Box>
                <Box>
                  <Typography sx={styles.footerLinkText}>
                    The Wingshield School ERP
                  </Typography>
                </Box>
              </Box>
              <Box sx={styles.footerContentRow}>
                <Box>
                  <DoubleArrowIcon sx={styles.arrow} />
                </Box>
                <Box>
                  <Typography sx={styles.footerLinkText}>
                    The Wingshield E-Zone
                  </Typography>
                </Box>
              </Box>
              <Box sx={styles.footerContentRow}>
                <Box>
                  <DoubleArrowIcon sx={styles.arrow} />
                </Box>
                <Box>
                  <Typography sx={styles.footerLinkText}>
                    The Wingshield Real Estate ERP
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
          <Grid
            item
            xl={2.8}
            lg={2.8}
            md={2.8}
            sm={5}
            xs={10}
            sx={styles.footerCol}
          >
            <Box sx={styles.footerColHeadingBox}>
              <Typography sx={styles.footerHeading}>Contact Info</Typography>
            </Box>
            <Box sx={styles.footerContentCol}>
              <Box sx={styles.footerContentRow}>
                <Box>
                  <Typography sx={styles.linkBoldText}>Email:</Typography>
                </Box>
                <Box>
                  <Typography sx={styles.footerLinkText}>
                     info@ Nityam Needs.com
                  </Typography>
                </Box>
              </Box>
              <Box sx={styles.footerContentRow}>
                <Box>
                  <Typography sx={styles.linkBoldText}>Call Us:</Typography>
                </Box>
                <Box>
                  <Typography sx={styles.footerLinkText}>
                    +91 7838469950
                  </Typography>
                </Box>
              </Box>
              <Box sx={styles.footerContentRow}>
                <Box>
                  <Typography sx={styles.linkBoldText}>Office:</Typography>
                </Box>
                <Box>
                  <Typography sx={styles.footerLinkText}>
                    +91 8882910517
                  </Typography>
                </Box>
              </Box>
              <Box sx={styles.footerContentRow}>
                <Box>
                  <Typography sx={styles.linkBoldText}>Address:</Typography>
                </Box>
                <Box>
                  <Typography sx={styles.footerLinkText}>
                    C-14 Ground Floor, Sector 6, Noida U.P - 201301, India
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
        <Grid container sx={styles.footerSecondContainer}>
          <Grid
            item
            xl={5.5}
            lg={5.5}
            md={5.5}
            sm={5.5}
            xs={10}
            sx={styles.secondRowCol1}
          >
            <Box>
              <CopyrightIcon sx={{ color: "#fff" }} />
            </Box>
            <Box>
              <Typography sx={styles.footerBoldText}>
                2024{" "}
                <span style={{ color: varColors.varGreen }}>Nityam Needs.</span>{" "}
                All Rights Reserved
              </Typography>
            </Box>
          </Grid>
          <Grid
            item
            xl={5.5}
            lg={5.5}
            md={5.5}
            sm={5.5}
            xs={10}
            sx={styles.secondRowCol2}
          >
            <Box>
              <Typography sx={styles.footerBoldText}>
                Terms and Condition
              </Typography>
            </Box>
            <Box>
              <Typography sx={styles.footerBoldText}>Privacy Policy</Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Footer;
