import React, { useState } from "react";
import OtpInput from "react-otp-input";
import { Link } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { sendotp, signUp } from "../services/operations/authApi";
import { useNavigate } from "react-router-dom";
import { Button, Container, Typography } from "@mui/material";
import Loader from "../Components/Common/Loader";

function VerifyEmail() {
  const [otp, setOtp] = useState("");
  const { signUpData, loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleVerifyAndSignup = (e) => {
    e.preventDefault();
    const {
      firstName,
      lastName,
      email,
      password,
      city,
      state,
      community,
      postalCost,
      phoneNumber,
      confirmPassword,
      profession,
      hourlyCharge,
    } = signUpData.formData;

    dispatch(
      signUp(
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        phoneNumber,
        state,
        city,
        community,
        postalCost,
        profession,
      hourlyCharge,
        otp,
        navigate
      )
    );
  };
  console.log(otp);
  const renderInput = (props, index) => {
    return (
      <input
        key={index}
        {...props}
        style={{
          width: "40px",
          height: "40px",
          margin: "0 5px",
          fontSize: "16px",
          borderRadius: "5px",
          border: "1px solid #ccc",
          textAlign: "center",
        }}
      />
    );
  };

  return (
    <Container maxWidth="md" sx={{ mt: 12 }}>
      {loading ? (
        <Loader/>
      ) : (
        <div>
          <Typography variant="h4" sx={{ mb: 4 }}>
            Verify Email
          </Typography>
          <Typography variant="body1" sx={{ mb: 4 }}>
            A verification code has been sent to you. Enter the code below
          </Typography>
          <form onSubmit={handleVerifyAndSignup}>
            <OtpInput
              value={otp}
              onChange={setOtp}
              numInputs={6}
              separator={<span>-</span>}
              isInputNum
              containerStyle={{ justifyContent: "space-between" }}
              inputStyle={{
                width: "40px",
                height: "40px",
                margin: "0 5px",
                fontSize: "16px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                textAlign: "center",
              }}
              renderInput={renderInput}
            />
            <Button type="submit" variant="contained" sx={{ mt: 4, mb: 2 }}>
              Verify OTP
            </Button>
          </form>
          <div>
            <Link to="/signup">
              <Typography variant="body2" color="primary" sx={{ display: 'flex', alignItems: 'center' }}>
                <BiArrowBack /> Back To Signup
              </Typography>
            </Link>
            <Button
              variant="text"
              color="primary"
              onClick={() => dispatch(sendotp(signUpData.email))}
              sx={{ ml: 2 }}
            >
              Resend OTP
            </Button>
          </div>
        </div>
      )}
    </Container>
  );
}

export default VerifyEmail;
