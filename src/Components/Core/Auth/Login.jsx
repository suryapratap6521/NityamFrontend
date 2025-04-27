import React, { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import { FcGoogle } from "react-icons/fc";
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { login, setToken } from "../../../services/operations/authApi";
import { setUser } from '../../../slices/profileSlice';
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from 'react-hot-toast';
import Cookies from 'js-cookie';
import login_image from "../../../assests/login_image.jpg"

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const defaultTheme = createTheme();

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Get loading state from auth slice
  const { loading } = useSelector((state) => state.auth);

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(login(email, password, navigate));
  };

  const googleButtonStyle = {
    backgroundColor: '#D3D3D3',
    color: '#000',
    padding: '10px 0',
  };

  const handleGoogleLogin = () => {
    // Redirect to your backend Google OAuth endpoint.
    window.location.href = 'http://localhost:8080/api/v1/auth/google';
  };

  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen">
      <div className="relative md:w-1/2 h-full hidden md:block">
        <div className="absolute md:w-full h-full top-0 left-0 z-10 flex flex-col justify-end p-10" style={{ background: 'linear-gradient(180deg, rgba(255, 255, 255, 0) 44%, rgb(0 0 0 / 52%) 80%)' }}>
          <h1 className="text-white text-2xl font-medium mb-2">Connect With Community</h1>
          <p className="text-gray-400 leading-[22px] text-base">
            Join a vibrant community where you can share ideas, collaborate, and build meaningful connections. Whether you're looking for support, inspiration, or networking opportunities, our platform brings people together to engage, learn, and grow in a space designed for meaningful interactions.
          </p>
        </div>
        <img className="md:w-full h-screen bg-cover bg-center " src={login_image} />
      </div>
      <div className="flex w-full md:w-1/2 justify-center items-center p-4">
        <div className="max-w-md w-full space-y-6">
          <img src="/static/media/nityam_mlogo.ef49c119a46a1f2bf2f9.png" alt="Nityam needs" class="mr-auto h-20"></img>
          <div className='w-full mb-4'>
            <h1 className="md:text-3xl text-3xl text-left font-semibold mb-1 text-[#8E2DE2]">
              Login
            </h1>
            <p className="text-gray-400 leading-4 text-sm">
              Access your account to stay connected, explore and engage with the community.
            </p>
          </div>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="flex items-center justify-between">

              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
                style={{ marginBottom: 0 }}
              />
              <div>
                <a href="/forgotpassword" className='text-gray-700 text-sm'>
                  Forgot password?
                </a>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}  // Disable while loading
              className="w-full text-lg bg-gradient text-white py-4 rounded-full m-0 mt-4"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
            <div className='flex w-full justify-center items-center mt-1'>

              <div>
                <a href="/signup" className='text-gray-700 text-sm'>
                  Don't have an account? <b className='text-[#8E2DE2] text-sm'>Sign Up</b>
                </a>
              </div>
            </div>
            <hr className='my-4' style={{ borderTop: "0.5px solid #00000070" }} />
          </Box>
          <button
            disabled={loading}  // Also disable the Google login button when loading
            className="flex items-center justify-center w-full bg-white border border-gray-300 
            rounded-md py-2 text-sm font-medium hover:bg-gray-100 transition
            focus:outline-none focus:ring-2 focus:ring-purple-500"
            onClick={handleGoogleLogin}
          >
            <svg
              className="w-5 h-5 mr-2"
              viewBox="0 0 533.5 544.3"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="#4285F4"
                d="M533.5 278.4c0-15.6-1.3-30.7-3.8-45.3H272v85.7h146.9a125.9 125.9 0 0 1-54.5 82.6v68h88.2c51.4-47.2 80.9-116.8 80.9-191z"
              />
              <path
                fill="#34A853"
                d="M272 544.3c73.5 0 135.1-24.5 180.1-66.4l-88.2-68c-23.6 16-54 25.4-91.9 25.4a158.4 158.4 0 0 1-149.1-109h-89.2v68.5A272 272 0 0 0 272 544.3z"
              />
              <path
                fill="#FBBC04"
                d="M122.9 326.3a158.5 158.5 0 0 1 0-108.3v-68.5H33.7a272 272 0 0 0 0 245.3l89.2-68.5z"
              />
              <path
                fill="#EA4335"
                d="M272 105.7c39.8 0 75.5 13.7 103.7 40.7l77.7-77.7C430 24.2 368.4 0 272 0A272 272 0 0 0 33.7 149.5l89.2 68.5c21-64.7 81.6-112.3 149.1-112.3z"
              />
            </svg>
            CONTINUE WITH GOOGLE
          </button>
        </div>
      </div>
    </div>
  );
}
