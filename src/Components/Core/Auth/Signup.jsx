import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useNavigate } from 'react-router-dom';
import { SetSignUpData } from '../../../slices/authSlice';
import { FcGoogle } from "react-icons/fc";
import {
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CssBaseline,
  TextField,
  Box,
  Link,
  Typography,
  Container,
  Grid,
  OutlinedInput,
  InputAdornment,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { StateSelect, CitySelect } from "react-country-state-city";
import "react-country-state-city/dist/react-country-state-city.css";
import { ROLES } from "../../../config/roles";
import  Tab  from "../../Common/Tab";
const Signup = () => {
  const [accountType, setAccountType] = useState(ROLES.PEOPLE);
  const [stateId, setStateId] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showDropDown, setShowDropDown] = useState(false);
  const [other, setOther] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    state: "",
    city: "",
    phoneNumber: "",
    postalCost: "",
    password: "",
    confirmPassword: "",
    email: "",
    community: "",
    profession: "",
    hourlyCharge: "",
  
  });

  useEffect(() => {
    setOther(formData.profession === "Other");
    // setOther(formData !=="other")
  }, [formData.profession]);

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

  const defaultTheme = createTheme();

  const handleSubmit = (e) => {
    e.preventDefault();

    const { password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    // // Check if any required field is empty
    // for (const key in formData) {
    //   if (key !== "community" && !formData[key]) {
    //     toast.error(`Please fill in the ${key} field`);
    //     return;
    //   }
    // }

    const signUpData = { formData };
    // SetSignUpData(...formData,accountType);
    dispatch(SetSignUpData(signUpData));
    console.log(signUpData);
    navigate('/community');

    setFormData({
      firstName: "",
      lastName: "",
      state: "",
      city: "",
      phoneNumber: "",
      postalCost: "",
      password: "",
      confirmPassword: "",
      email: "",
      community: "",
      profession: "",
      hourlyCharge: "",
    });
  };

  const handleToggleChange = () => {
    setShowDropDown(!showDropDown);
  };

  const tabData = [
    {
      id: 1,
      tabName: "People",
      type: ROLES.PEOPLE,
    },
    {
      id: 2,
      tabName: "Business",
      type: ROLES.BUSINESS,
    },
  ]
  console.log(accountType);
  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            mt: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            bgcolor: 'rgba(255, 255, 255, 0.8)',
            p: 3,
            borderRadius: 1,
          }}
        >
          <Tab tabData={tabData} field={accountType} setField={setAccountType} />
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign Up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  value={formData.firstName}
                  onChange={handleOnChange}
                  id="firstName"
                  label="First Name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  value={formData.lastName}
                  onChange={handleOnChange}
                  name="lastName"
                  autoComplete="family-name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  value={formData.email}
                  onChange={handleOnChange}
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  value={formData.password}
                  onChange={handleOnChange}
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleOnChange}
                  id="confirmPassword"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <StateSelect
                  countryid={101}
                  value={formData.state}
                  onChange={handleStateChange}
                  placeHolder="Select State"
                  required
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
                    required
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
                  inputProps={{ maxLength: 6 }}
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
                  inputProps={{ maxLength: 6 }}
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
                  {other && (
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
              Sign Up
            </Button>
            <Button
              type="button"
              variant="contained"
              style={{ backgroundColor: '#D3D3D3', color: '#000', padding: '10px 0' }}
              fullWidth
              onClick={() => window.location.href = 'http://localhost:8080/api/v1/auth/google'}
            >
              <FcGoogle style={{ fontSize: '30px', marginRight: '10px' }} />
              Continue with Google
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/login" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default Signup;
