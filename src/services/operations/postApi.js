import { apiConnector } from '../apiConnector';
import { postEndpoints } from '../apis';
import toast from 'react-hot-toast';
import { setPosts, updatePoll } from '../../slices/postSlice';
import { setAllAds } from '../../slices/adSlice';
import { handleResponse } from "../../utils/apiUtils";

export const getAllPosts = async (token, dispatch) => {
  try {
    const response = await apiConnector("GET", postEndpoints.GET_ALL_POST, null, {
      Authorization: `Bearer ${token}`,
    });

    if (!response?.data?.success) {
      throw new Error("Could not fetch posts");
    }

    const posts = response.data.communityPost.map(post => ({
      ...post,
      type: 0, // Marking as post
    }));

    const ads = response.data.communityAdvertisedPosts.map(ad => ({
      ...ad,
      type: 1, // Marking as ad
    }));

    const combined = [];
    let postIndex = 0;
    let adIndex = 0;

    while (postIndex < posts.length) {
      // Add up to 3 posts
      for (let i = 0; i < 3 && postIndex < posts.length; i++) {
        combined.push(posts[postIndex++]);
      }

      // Add 1 ad if available
      if (adIndex < ads.length) {
        combined.push(ads[adIndex++]);
      }
    }

    dispatch(setPosts(combined));
    dispatch(setAllAds(ads));
    localStorage.setItem("posts", JSON.stringify(response.data.communityPost));
    localStorage.setItem("ad", JSON.stringify(response.data.communityAdvertisedPosts));

    return response.data.communityPost;

  } catch (error) {
    console.error("GET_ALL_POST error:", error);
    toast.error(error.message);
    throw error; // Rethrow the error for further handling
  }
};

export const createPost = async (formData, token) => {
  const toastId = toast.loading("Creating post...");
  try {
    const response = await apiConnector("POST", postEndpoints.CREATE_POST, formData, {
      Authorization: `Bearer ${token}`,
    });

    console.log(response, "Response");

    // Handle non-201 status codes
    if (!response || response.status !== 200) {
      throw new Error(`Error: Received status code ${response?.status}`);
    }
    toast.success("Post created successfully");

  } catch (error) {
    console.error('Error in createPost API call:', error.response?.data || error.message);
    toast.error(error.response?.data || error.message);
    throw error; // Re-throw the error to handle it in the component

  }
  finally {
    toast.dismiss(toastId);
  }
};

export const voteOnPoll = async (postId, optionIndex, token) => {
  try {
    const response = await fetch(`https://nityambackend.onrender.com/api/v1/post/${postId}/vote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ optionIndex })
    });
    return handleResponse(response);
  } catch (error) {
    throw error;
  }
};

export const fetchVoters = async (postId, optionIndex, token) => {
  try {
    const response = await fetch(`https://nityambackend.onrender.com/api/v1/post/${postId}/voters/${optionIndex}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return handleResponse(response);
  } catch (error) {
    throw error;
  }
};

export const deletePost = async (token, postId) => {
  try {
    const response = await apiConnector("POST", postEndpoints.DELETE_POST, { postId }, {
      Authorization: `Bearer ${token}`
    });
    console.log(response, "response");
    if (!response?.data?.success) {
      throw new Error("Could not create post");
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// ✅ Like Post - postApi.js
export const likePost = async (postId, token) => {
  try {
    const response = await apiConnector("POST", postEndpoints.SET_LIKE, { postId }, {
      Authorization: `Bearer ${token}`,
    });

    // Return only the updated post (not an array)
    return response.data[0];
  } catch (error) {
    console.error("Error liking post:", error);
    throw error;
  }
};

// ✅ Unlike Post - postApi.js
export const unlikePost = async (postId, token) => {
  try {
    const response = await apiConnector("POST", postEndpoints.UNLIKE, { postId }, {
      Authorization: `Bearer ${token}`,
    });

    // Return only the updated post (not an array)
    return response.data[0];
  } catch (error) {
    console.error("Error unliking post:", error);
    throw error;
  }
};


export const comment = async (postId, text, userId, token, dispatch) => {
  try {
    const response = await apiConnector("POST", postEndpoints.COMMENT, { postId, text, userId }, {
      Authorization: `Bearer ${token}`,
    });
    const updatedComment = response.data;
    dispatch(setPosts(updatedComment));
  } catch (error) {
    console.error("Error commenting post:", error);
    toast.error("Error commenting post");
    throw error;
  }
};

export const commentDelete = async (postId, commentId, dispatch, token) => {
  try {
    const response = await apiConnector("POST", postEndpoints.UNCOMMENT, { postId, commentId }, {
      Authorization: `Bearer ${token}`,
    });
    const updatedComment = response.data;
    dispatch(setPosts(updatedComment));
  } catch (error) {
    console.error("Error in deleting Comment", error);
    toast.error("Error commenting deleting post");
    throw error;
  }
};

export const reply = async (postId, commentId, text, dispatch, token) => {
  try {
    const response = await apiConnector("POST", postEndpoints.REPLY, { postId, commentId, text }, {
      Authorization: `Bearer ${token}`,
    });
    const updatedComment = response.data.allPosts;
    dispatch(setPosts(updatedComment));
  } catch (error) {
    console.error("Error commenting post:", error);
    toast.error("Error commenting post");
    throw error;
  }
};

export const commentLike = async (postId, commentId, dispatch, token) => {
  try {
    const response = await apiConnector("POST", postEndpoints.LIKE_COMMENT, { postId, commentId }, {
      Authorization: `Bearer ${token}`,
    });
    const updatedComment = response.data.allPosts;
    console.log(updatedComment, "----------->updatedComment");
    dispatch(setPosts(updatedComment));
  } catch (error) {
    console.error("Error Liking comment:", error);
    toast.error("Error Liking comment");
    throw error;
  }
};

export const replyLike = async (postId, commentId, replyId, dispatch, token) => {
  try {
    const response = await apiConnector("POST", postEndpoints.LIKE_REPLY, { postId, commentId, replyId }, {
      Authorization: `Bearer ${token}`,
    });
    const updatedComment = response.data.allPosts;
    console.log(updatedComment, "----------->updatedComment h ye")
    dispatch(setPosts(updatedComment));
  } catch (error) {
    console.error("Error commenting post:", error);
    toast.error("Error commenting post");
    throw error;
  }
};

export const nestedReply = async (postId, commentId, replyId, text, dispatch, token) => {
  try {
    const response = await apiConnector("POST", postEndpoints.NESTED_REPLY, { postId, commentId, replyId, text }, {
      Authorization: `Bearer ${token}`,
    });
    return response.data;
  } catch (error) {
    console.error("Error commenting post:", error);
    toast.error("Error commenting post");
    throw error;
  }
};