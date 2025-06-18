import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  posts: [],
  loading: false,
  error: null,
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    setPosts: (state, action) => {
      state.posts = action.payload;
    },
    appendPosts: (state, action) => {
      state.posts = [...state.posts, ...action.payload];
    },
    addPostToTop: (state, action) => {
      state.posts = [action.payload, ...state.posts];
    },
    updatePoll: (state, action) => {
      const { postId, updatedPoll } = action.payload;
      state.posts = state.posts.map((post) =>
        post._id === postId ? { ...post, pollOptions: updatedPoll } : post
      );
    },
    removePost: (state, action) => {
      state.posts = state.posts.filter((post) => post._id !== action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setPosts,
  appendPosts,
  addPostToTop,
  updatePoll,
  removePost,
  setLoading,
  setError,
} = postSlice.actions;

export default postSlice.reducer;
