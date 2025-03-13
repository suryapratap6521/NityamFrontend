// src/slices/authSlice.js
import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

// Helper function to safely parse token from cookie
function getToken() {
  const tokenCookie = Cookies.get("token");
  if (!tokenCookie) return null;
  try {
    // Try parsing the token (this works for JSON-stringified tokens)
    return JSON.parse(tokenCookie);
  } catch (error) {
    // If parsing fails, the token is likely stored as a plain string (e.g., from Google flow)
    return tokenCookie;
  }
}

const initialState = {
  signUpData: {},
  loading: false,
  token: getToken(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    SetSignUpData: (state, action) => {
      state.signUpData = { ...state.signUpData, ...action.payload };
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setToken(state, action) {
      state.token = action.payload;
    },
  },
});

export const { SetSignUpData, setLoading, setToken } = authSlice.actions;
export default authSlice.reducer;
