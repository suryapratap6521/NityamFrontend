// reducers/index.js
import { combineReducers } from '@reduxjs/toolkit';
import authSlice from '../slices/authSlice';
import profileSlice from '../slices/profileSlice';
import postSlice from '../slices/postSlice';
import chatSlice from '../slices/chatSlice';
const rootReducer = combineReducers({
  auth: authSlice,
  profile: profileSlice,
  post: postSlice,
  chat:chatSlice,
});

export default rootReducer;
