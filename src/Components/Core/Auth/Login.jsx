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
    <div className='h-screen flex justify-around px-8 py-8'>
      <div className="relative md:w-5/12 h-full rounded-md">
        <div className="absolute md:w-full h-full rounded-md top-0 left-0 z-10 flex flex-col justify-end p-10" style={{ background: 'linear-gradient(180deg, rgba(255, 255, 255, 0) 44%, rgb(0 0 0 / 52%) 80%)' }}>
          <h1 className="text-white text-2xl font-medium mb-2">Connect With Community</h1>
          <p className="text-gray-400 leading-4 text-base">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore elit, sed do eius tempor incididunt ut labore et dolore
          </p>
        </div>
        <img className="md:w-full h-full bg-cover bg-center rounded-md" src={login_image} />
      </div>
      <div className="md:w-5/12 h-full">
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <div className='w-full mb-4'>
            <h1 className="md:text-3xl text-xl text-left font-semibold mb-1 text-[#8E2DE2]">
              Login
            </h1>
            <p className="text-gray-400 leading-4 text-sm">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
            </p>
          </div>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
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
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <button
              type="submit"
              disabled={loading}  // Disable while loading
              className="w-full text-base bg-gradient text-white py-4 rounded-full m-0"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
            <div className='flex w-full justify-between items-center mt-1'>
              <div>
                <a href="/forgotpassword" className='text-gray-700 text-sm'>
                  Forgot password?
                </a>
              </div>
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
              className="w-9/12 flex items-center justify-center m-auto text-base bg-lime-400 border-gray-400 border-solid py-3 rounded-full m-0"
              onClick={handleGoogleLogin}
            >
              <FcGoogle style={{ fontSize: '30px', marginRight: '10px' }} />
              CONTINUE WITH GOOGLE
            </button>
        </Box>
      </div>
    </div>
  );
}
