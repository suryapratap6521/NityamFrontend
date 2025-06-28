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
       prependPost: (state, action) => {
      state.posts.unshift(action.payload); // Add new post to top
    },
      updatePoll: (state, action) => {
        const { postId, updatedPoll } = action.payload;
        state.posts = state.posts.map(post =>
          post._id === postId ? { ...post, poll: updatedPoll } : post
        );
      },
      updateComments: (state, action) => {
        const { postId, comments } = action.payload;
  const index = state.posts.findIndex(p => p._id === postId);
  if (index !== -1) {
    state.posts[index].comments = comments;
  }
      },
      updateLikes: (state, action) => {
        const { postId, likedBy, isLiked } = action.payload;
        state.posts = state.posts.map(post => {
          if (post._id !== postId) return post;
          const newLikes = isLiked
            ? [...post.likes, likedBy]
            : post.likes.filter(id =>
                typeof id === "object" ? id._id !== likedBy : id !== likedBy
              );
          return { ...post, likes: newLikes };
        });
      },
      removePost: (state, action) => {
        state.posts = state.posts.filter(post => post._id !== action.payload);
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
    updatePoll,
    updateComments,
    updateLikes,
    prependPost,
    removePost,
    setLoading,
    setError,
  } = postSlice.actions;

  export default postSlice.reducer;
