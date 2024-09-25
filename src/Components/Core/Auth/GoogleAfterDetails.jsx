import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { SetSignUpData } from '../../../slices/authSlice';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputAdornment from '@mui/material/InputAdornment';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { StateSelect, CitySelect } from "react-country-state-city";
import "react-country-state-city/dist/react-country-state-city.css";

const GoogleAfterDetails = () => {
  const [stateId, setStateId] = useState(null);
  const [showDropDown, setShowDropDown] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    state: "",
    city: "",
    phoneNumber: "",
    postalCost: "",
    community: "",
    profession: "",
    hourlyCharge: "",
  });

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleStateChange = (state) => {
    setFormData((prevData) => ({
      ...prevData,
      state: state?.name || "",
    }));
    setStateId(state?.id || null);
  };

  const handleCityChange = (city) => {
    setFormData((prevData) => ({
      ...prevData,
      city: city?.name || "",
    }));
  };

  const handleToggleChange = () => {
    setShowDropDown(!showDropDown);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if any field is empty
    for (const key in formData) {
      if (key !== "community" && !formData[key]) {
        toast.error(`Please fill ${key}`);
        return;
      }
    }

    const signUpData = { formData };
    console.log(signUpData);
    dispatch(SetSignUpData(signUpData));
    navigate('/community');

    setFormData({
      state: "",
      city: "",
      phoneNumber: "",
      postalCost: "",
      community: "",
      profession: "",
      hourlyCharge: "",
    });
  };

  const defaultTheme = createTheme();

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs" sx={{ backgroundColor: 'transparent', backdropFilter: 'blur(10px)' }}>
        <CssBaseline />
        <Box
          sx={{
            mt: 12,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Complete Your Details
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <StateSelect
                  countryid={101}
                  value={formData.state}
                  onChange={handleStateChange}
                  placeHolder="Select State"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                {stateId && (
                  <CitySelect
                    countryid={101}
                    stateid={stateId}
                    value={formData.city}
                    onChange={handleCityChange}
                    placeHolder="Select City"
                  />
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  name="phoneNumber"
                  label="Phone Number"
                  type="number"
                  value={formData.phoneNumber}
                  onChange={handleOnChange}
                  id="phoneNumber"
                  inputProps={{ maxLength: 10 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  name="postalCost"
                  label="Postal Cost"
                  type="number"
                  value={formData.postalCost}
                  onChange={handleOnChange}
                  id="postalCost"
                />
              </Grid>
              <Grid item xs={12}>
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showDropDown}
                    onChange={handleToggleChange}
                    className="sr-only peer"
                  />
                  <div className="relative w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">If you have any skills or profession you select it</span>
                </label>
              </Grid>
              {showDropDown && (
                <>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label" shrink>
                        Profession
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        name="profession"
                        value={formData.profession}
                        onChange={handleOnChange}
                        label="Profession"
                      >
                        <MenuItem value="Developer">Developer</MenuItem>
                        <MenuItem value="Designer">Designer</MenuItem>
                        <MenuItem value="Manager">Manager</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  {formData.profession === "Other" && (
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Please provide some details about your profession"
                        name="profession"
                        value={formData.profession}
                        onChange={handleOnChange}
                      />
                    </Grid>
                  )}
                  {formData.profession && (
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        name="hourlyCharge"
                        label="Please provide your hourly charge"
                        type="number"
                        value={formData.hourlyCharge}
                        onChange={handleOnChange}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                        }}
                      />
                    </Grid>
                  )}
                </>
              )}
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="success"
              sx={{ mt: 3, mb: 2 }}
            >
              Next
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default GoogleAfterDetails;
