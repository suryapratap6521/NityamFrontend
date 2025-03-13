// src/Components/Core/Auth/GoogleAuthHandler.jsx
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Cookies from 'js-cookie';
import { setUser } from '../../../slices/profileSlice';
import { setToken } from '../../../slices/authSlice';
import { useNavigate } from 'react-router-dom';

const GoogleAuthHandler = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Helper to safely parse the token
  const getTokenFromCookie = () => {
    const tokenCookie = Cookies.get('token');
    if (!tokenCookie) return null;
    try {
      return JSON.parse(tokenCookie);
    } catch (err) {
      return tokenCookie;
    }
  };

  useEffect(() => {
    const userCookie = Cookies.get('user');
    const token = getTokenFromCookie();

    if (userCookie && token) {
      const user = JSON.parse(userCookie);
      dispatch(setUser(user));
      dispatch(setToken(token));

      // Check for onboarding completeness based on available fields.
      const hasOnboarding =
        (user.communityDetails && user.communityDetails.trim() !== '') ||
        (user.city && user.state && user.postalCost && user.community);

      if (hasOnboarding) {
        navigate('/dashboard');
      } else {
        navigate('/profiledetails');
      }
    } else {
      navigate('/login');
    }
  }, [dispatch, navigate]);

  return (
    <div className="flex justify-center items-center h-screen">
      <p>Loading user data...</p>
    </div>
  );
};

export default GoogleAuthHandler;
