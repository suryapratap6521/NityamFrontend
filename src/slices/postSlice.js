import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  posts: localStorage.getItem("posts")
    ? JSON.parse(localStorage.getItem("posts"))
    : [],
    sharedPost:null,
  error: null,
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setPosts: (state, action) => {
      state.posts = action.payload;
      state.error = null;
      localStorage.setItem("posts", JSON.stringify(action.payload));
    },
    updatePoll: (state, action) => {
      const { postId, updatedPoll } = action.payload;
      state.posts = state.posts.map((post) =>
        post._id === postId
          ? {
              ...post,
              pollOptions: updatedPoll, // Update only poll options
            }
          : post
      );
      localStorage.setItem("posts", JSON.stringify(state.posts));
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setSharedPost: (state, action) => {
    state.sharedPost = action.payload;
  },
  },
});

export const { setLoading, setPosts, updatePoll, setError,setSharedPost } = postSlice.actions;
export default postSlice.reducer;
