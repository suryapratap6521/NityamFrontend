import React, { useState } from 'react';
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
import { login } from "../../../services/operations/authApi";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from 'react-hot-toast';
import Cookies from 'js-cookie';
import login_image from "../../../assests/login_image.jpg";
import logo from "../../../assests/nityam_mlogo.png";

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

  const handleGoogleLogin = () => {
    // Redirect to your backend Google OAuth endpoint.
    window.location.href = 'https://nityambackend.onrender.com/api/v1/auth/google';
  };

  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen">
      {/* Image Section */}
      <div className="relative w-full md:w-1/2 h-64 md:h-auto">
        <div
          className="absolute w-full h-full top-0 left-0 z-10 flex flex-col justify-end p-4 sm:p-10"
          style={{ background: 'linear-gradient(180deg, rgba(255, 255, 255, 0) 44%, rgb(0 0 0 / 52%) 80%)' }}
        >
          <h1 className="text-white text-xl sm:text-2xl font-medium mb-2">
            Connect With Community
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm leading-5">
            Join a vibrant community where you can share ideas, collaborate, and build meaningful connections. Whether you're looking for support, inspiration, or networking opportunities, our platform brings people together to engage, learn, and grow.
          </p>
        </div>
        <img
          className="w-full h-full object-cover"
          src={login_image}
          alt="Login Visual"
        />
      </div>

      {/* Login Form Section */}
      <div className="flex w-full md:w-1/2 justify-center items-center p-4">
        <div className="w-full max-w-sm sm:max-w-md px-4 sm:px-6 lg:px-8 space-y-6">
          <img
            src={logo}
            alt="Nityam Needs"
            className="h-16 sm:h-20 w-auto"
          />
          <div className='w-full mb-4'>
            <h1 className="text-2xl sm:text-3xl font-semibold mb-1 text-[#695ea8]">
              Login
            </h1>
            <p className="text-gray-400 text-sm sm:text-base">
              Access your account to stay connected, explore, and engage with the community.
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
            <div className="flex items-center justify-between mt-2">
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
                style={{ marginBottom: 0 }}
              />
              <Link href="/forgotpassword" className="text-gray-700 text-sm">
                Forgot password?
              </Link>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full text-lg bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-4 rounded-full mt-4"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
            <div className="flex w-full justify-center items-center mt-1">
              <Link href="/signup" className="text-gray-700 text-sm">
                Don't have an account? <span className="text-[#695ea8] font-medium">Sign Up</span>
              </Link>
            </div>
            <hr className="my-4" style={{ borderTop: "0.5px solid #00000070" }} />
          </Box>
          <button
            disabled={loading}
            onClick={handleGoogleLogin}
            className="flex items-center justify-center w-full bg-white border border-gray-300 rounded-md py-2 text-sm font-medium hover:bg-gray-100 transition focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <FcGoogle className="w-5 h-5 mr-2" />
            CONTINUE WITH GOOGLE
          </button>
        </div>
      </div>
    </div>
  );
}
