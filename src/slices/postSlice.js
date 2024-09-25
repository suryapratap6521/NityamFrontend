// slices/postSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  posts:localStorage.getItem("posts") ? JSON.parse(localStorage.getItem("posts")) : null,
};

const postSlice = createSlice({
  name: "post",
  initialState: initialState,
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setPosts(state, action) {
      state.posts = action.payload;
    },
  },
});

export const { setLoading, setPosts } = postSlice.actions;

export default postSlice.reducer;
