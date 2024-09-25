import React from "react";
import {
  Container,
  Grid,
  Typography,
  Box,
  TextField,
} from "@mui/material";
import HomeContactStyle from "./HomeContactStyle";
import ci1 from "../../../../../assests/Images/cnti1.png";
import ci2 from "../../../../../assests/Images/cnti2.png";
import ci3 from "../../../../../assests/Images/cnti3.png";
import ci4 from "../../../../../assests/Images/cnti4.png";
import ci5 from "../../../../../assests/Images/cnti5.png";
import CustomButton from "../../CustomButton/CustomButton";
import ContactSchema from "./ContactSchema";
import { useFormik } from "formik";

const HomeContact = () => {
  const handleSubmit = async (values, { resetForm }) => {
    // Uncomment and use the following line for actual submission logic
    // const res = await contactUs(values);
    // if (res.status) {
    //   resetForm();
    //   toastMessage("success", "Successfully Sent", 3000);
    // } else {
    //   toastMessage("error", res.message, 3000);
    // }
    console.log("Form Submitted:", values);
    resetForm();
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      number: "",
      message: "",
    },
    validationSchema: ContactSchema, // Yup validation schema
    onSubmit: handleSubmit,
  });

  const styles = HomeContactStyle;

  return (
    <>
      <Grid container sx={styles.hcgridcontainer}>
        <Grid item lg={5.5} md={5.5} sm={10} xs={10} sx={styles.hcl}>
          <Box sx={styles.hclupper}>
            <Box sx={styles.hclupperrow}>
              <Typography sx={styles.tangibleheadingone}>
                For Any Enquiry Please
              </Typography>
            </Box>
            <Box sx={styles.hclupperrow}>
              <Typography sx={styles.tangibleheadingtwo}>Contact Us</Typography>
            </Box>
          </Box>
          <Box sx={styles.hcllowerrow}>
            <Box sx={styles.hcllowerrowr}>
              <Box sx={styles.hcllowerrowiconbox}>
                <img src={ci1} style={styles.hcllowerrowiconboximg} />
              </Box>
              <Box>
                <Typography
                  sx={{ ...styles.hcllowerrowtext, cursor: "pointer" }}
                  onClick={() => {
                    window.open(
                      "https://maps.app.goo.gl/5LWJuSngoDtRkBpi7",
                      "_blank"
                    );
                  }}
                >
                  C-14, Ground Floor, Sector-6, Noida UP - 201301, India
                </Typography>
              </Box>
            </Box>
            <Box sx={styles.hcllowerrowr}>
              <Box sx={styles.hcllowerrowiconbox}>
                <img src={ci2} style={styles.hcllowerrowiconboximg} />
              </Box>
              <Box>
                <Typography sx={styles.hcllowerrowtext}>
                  Monday - Saturday, 10:00 am - 08:00 pm
                </Typography>
              </Box>
            </Box>
            <Box sx={styles.hcllowerrowr}>
              <Box sx={styles.hcllowerrowiconbox}>
                <img src={ci3} style={styles.hcllowerrowiconboximg} />
              </Box>
              <Box>
                <Typography sx={styles.hcllowerrowtext}>
                  info@sartiaglobal.com
                </Typography>
              </Box>
            </Box>
            <Box sx={styles.hcllowerrowr}>
              <Box sx={styles.hcllowerrowiconbox}>
                <img src={ci4} style={styles.hcllowerrowiconboximg} />
              </Box>
              <Box>
                <Typography sx={styles.hcllowerrowtext}>
                  +91-8882910517
                </Typography>
              </Box>
            </Box>
            <Box sx={styles.hcllowerrowr}>
              <Box sx={styles.hcllowerrowiconbox}>
                <img src={ci5} style={styles.hcllowerrowiconboximg} />
              </Box>
              <Box>
                <Typography sx={styles.hcllowerrowtext}>
                  +91-8882910517 / +91-8882910514
                </Typography>
              </Box>
            </Box>
          </Box>
        </Grid>
        <Grid item lg={5} md={5.5} sm={10} xs={10} sx={styles.hcr}>
          <form onSubmit={formik.handleSubmit}>
            <Box sx={styles.inputrow}>
              <TextField
                label="Your Name"
                variant="standard"
                name="name"
                sx={styles.inptfield}
                value={formik.values.name}
                onChange={formik.handleChange}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={
                  formik.touched.name && formik.errors.name ? (
                    <Typography variant="body2" color="error" sx={styles.erortxt}>
                      {formik.errors.name}
                    </Typography>
                  ) : null
                }
              />
            </Box>
            <Box sx={styles.inputrow}>
              <TextField
                label="Your Email Id"
                variant="standard"
                name="email"
                sx={styles.inptfield}
                email="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={
                  formik.touched.email && formik.errors.email ? (
                    <Typography variant="body2" color="error" sx={styles.erortxt}>
                      {formik.errors.email}
                    </Typography>
                  ) : null
                }
              />
            </Box>
            <Box sx={styles.inputrow}>
              <TextField
                label="Your Number"
                variant="standard"
                sx={styles.inptfield}
                name="number"
                value={formik.values.number} // Bind value to Formik's values
                onChange={formik.handleChange}
                error={formik.touched.number && Boolean(formik.errors.number)}
                helperText={
                  formik.touched.number && formik.errors.number ? (
                    <Typography variant="body2" color="error" sx={styles.erortxt}>
                      {formik.errors.number}
                    </Typography>
                  ) : null
                }
              />
            </Box>
            <Box sx={styles.inputrow}>
              <TextField
                label="Your Message"
                variant="standard"
                name="message"
                sx={styles.inptfield}
                value={formik.values.message} // Bind value to Formik's values
                onChange={formik.handleChange} // Use Formik's handleChange
                error={formik.touched.message && Boolean(formik.errors.message)}
                helperText={
                  formik.touched.message && formik.errors.message ? (
                    <Typography variant="body2" color="error" sx={styles.erortxt}>
                      {formik.errors.message}
                    </Typography>
                  ) : null
                }
              />
            </Box>
            <Box sx={styles.btnrow}>
              <CustomButton
                title="Submit"
                type="submit"
              />
            </Box>
          </form>
        </Grid>
      </Grid>
    </>
  );
};

export default HomeContact;
