// reducers/index.js
import { combineReducers } from '@reduxjs/toolkit';
import authSlice from '../slices/authSlice';
import profileSlice from '../slices/profileSlice';
import postSlice from '../slices/postSlice';
import chatSlice from '../slices/chatSlice';
import pageSlice from "../slices/pageSlice";
import adSlice from "../slices/adSlice";
import eventSlice from "../slices/eventSlice";
const rootReducer = combineReducers({
  auth: authSlice,
  profile: profileSlice,
  post: postSlice,
  chat:chatSlice,
  page:pageSlice,
  ad: adSlice,
  event: eventSlice
});

export default rootReducer;
