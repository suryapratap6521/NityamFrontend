import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Typography, TextField, Button, Grid, Paper } from '@mui/material';
import Loader from "../Components/Common/Loader";
import { useDispatch, useSelector } from 'react-redux';
import { getPasswordResetToken } from "../../src/services/operations/authApi";
import { useNavigate } from "react-router-dom";
const ForgotPassword = () => {
    const navigate=useNavigate();
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const { loading } = useSelector((state) => state.auth);
const dispatch=useDispatch();
  const rootStyle = {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const paperStyle = {
    padding: '2rem',
    maxWidth: 400,
    textAlign: 'center',
  };

  const formStyle = {
    marginTop: '1rem',
  };

  const buttonStyle = {
    marginTop: '1rem',
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(getPasswordResetToken(email,setEmailSent,navigate));
    setEmailSent(true);
  };

  return (
    <div style={rootStyle}>
      <Paper style={paperStyle} elevation={3}>
        {loading ? (
          <Loader />
        ) : (
          <>
            <Typography variant="h4" gutterBottom>
              {!emailSent ? "Reset Your Password" : "Check Your Email"}
            </Typography>
            <Typography variant="body1" paragraph>
              {!emailSent
                ? "Have no fear. We'll email you instructions to reset your password. If you don't have access to your email, we can try account recovery."
                : `We have sent the reset email to ${email}.`}
            </Typography>
            {!emailSent && (
              <form style={formStyle} onSubmit={handleSubmit}>
                <Grid container spacing={2} justifyContent="center">
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      label="Email Address"
                      name="email"
                      type="email"
                      value={email}
                      onChange={handleEmailChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      style={buttonStyle}
                      variant="contained"
                      color="success"
                      type="submit"
                    >
                      Send Email
                    </Button>
                  </Grid>
                </Grid>
              </form>
            )}
            <Typography variant="body2" style={buttonStyle}>
              <Link to="/login">Back to Login</Link>
            </Typography>
          </>
        )}
      </Paper>
    </div>
  );
};

export default ForgotPassword;
