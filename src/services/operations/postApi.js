import { apiConnector } from '../apiConnector';
import { postEndpoints } from '../apis';
import toast from 'react-hot-toast';
import {
  setPosts,
  updatePoll,
  updateSinglePost,
  setError,
  removePost,
  setLoading,
  appendPosts,
  addPostToTop,
} from '../../slices/postSlice';

const {
  CREATE_POST,
  GET_ALL_POST,
  DELETE_POST,
  CREATE_ADV,
  VOTE_ON_POLL,
  UPDATE_POST,
  GET_POLL_VOTERS,
  COMMENT,
  COMMENT_DELETE,
  LIKE_COMMENT,
  REPLY,
  LIKE_REPLY,
  SET_LIKE_UNLIKE,
} = postEndpoints;


// ✅ Get Community Posts with Pagination
export const getAllPosts = async (token, dispatch, page = 1, limit = 10, append = false) => {
  
  try {
    console.log("📡 Requesting posts from:", `${GET_ALL_POST}?page=${page}&limit=${limit}`);
    dispatch(setLoading(true));

    const response = await apiConnector("GET", `${GET_ALL_POST}?page=${page}&limit=${limit}`, null, {
      Authorization: `Bearer ${token}`,
    });

    if (!response?.data?.success) throw new Error("Could not fetch posts");

    const raw = response.data;
    const mergedPosts = [
      ...(raw.advertisedPosts || []).map(p => ({ ...p, type: 1 })),
      ...(raw.posts || []).map(p => ({ ...p, type: 0 })),
    ];

    console.log("✅ Raw response from backend:", response);
    console.log("✅ Merged post count:", mergedPosts.length);

    if (append) {
      dispatch(appendPosts(mergedPosts));
    } else {
      dispatch(setPosts(mergedPosts));
    }

    return raw.pagination;
  } catch (err) {
    console.error("getAllPosts ERROR:", err);
    toast.error("Failed to fetch posts");
    dispatch(setError(err.message));
  } finally {
    dispatch(setLoading(false));
  }
};

// ✅ Create Post
export const createPost = async (formData, token) => {
  try {
    const res = await apiConnector('POST', CREATE_POST, formData, {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    });
    if (res.data.success) toast.success('Post created');
    return res.data;
  } catch (err) {
    console.error(err);
    toast.error(err.response?.data?.message || 'Post creation failed');
    return null;
  }
};

// ✅ Delete Post
export const deletePost = async (postId, token, dispatch) => {
  try {
    const res = await apiConnector('POST', DELETE_POST, { postId }, {
      Authorization: `Bearer ${token}`,
    });
    if (res.data.success) {
      dispatch(removePost(postId));
      toast.success('Post deleted');
    }
  } catch (err) {
    console.error(err);
    toast.error('Post delete failed');
  }
};

// ✅ Like/Unlike Post (Toggle)
export const likePost = async (postId, token) => {
  try {
    const res = await apiConnector('POST', SET_LIKE_UNLIKE, { postId }, {
      Authorization: `Bearer ${token}`,
    });
    console.log("Post like/unlike response:", res.data);
    
    return res.data?.updatedPost;
    
  } catch (err) {
    console.error(err);
  }
};

export const updatePost = async (postId, formData, token) => {
  try {
    const response = await apiConnector(
      "POST",
      `${postEndpoints.UPDATE_POST}`,
      formData,
      {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error updating post:", error);
    throw error;
  }
};


// ✅ Comment on Post
export const comment = async (data, token) => {
  try {
    const res = await apiConnector('POST', COMMENT, data, {
      Authorization: `Bearer ${token}`,
    });
    console.log("Comment response:", res.data);
    return res.data;
    
  } catch (err) {
    console.error(err);
  }
};

// ✅ Delete Comment
export const commentDelete = async (commentId, token) => {
  try {
    const res = await apiConnector('POST', COMMENT_DELETE, { commentId }, {
      Authorization: `Bearer ${token}`,
    });
    return res.data;
  } catch (err) {
    console.error(err);
  }
};

// ✅ Like Comment
export const commentLike = async (postId, commentId, token) => {
  try {
    const res = await apiConnector("POST", LIKE_COMMENT, {
      postId,
      commentId,
    }, {
      Authorization: `Bearer ${token}`,
    });
console.log(res.data, "commentLike response");
    return res.data;
    
  } catch (err) {
    console.error("❌ commentLike error:", err);
  }
};


// ✅ Reply to Comment

export const reply = async (data, token) => {
  try {
    const res = await apiConnector("POST", REPLY, data, {
      Authorization: `Bearer ${token}`,
    });
    console.log("Reply response:", res.data);
    return res.data;
  } catch (err) {
    console.error("❌ reply error:", err);
    return null;
  }
};


// ✅ Like a Reply
export const replyLike = async (postId, commentId, replyId, token) => {
  console.log(LIKE_REPLY, "REPLY_LIKE endpoint");
  try {
    const res = await apiConnector("POST", LIKE_REPLY, {
      postId,
      commentId,
      replyId,
    }, {
      Authorization: `Bearer ${token}`,
    });
    console.log("Reply like response:", res.data);
    return res.data;
  } catch (err) {
    console.error("❌ replyLike error:", err);
    return null;
  }
};


// ✅ Vote on Poll
export const voteOnPoll = async (postId, optionIndex, token, dispatch) => {
  try {
    const res = await apiConnector('POST', `${VOTE_ON_POLL}/${postId}/vote`, { optionIndex }, {
      Authorization: `Bearer ${token}`,
    });
    if (res.data.success) {
      dispatch(updatePoll({ postId, updatedPoll: res.data.updatedPoll }));
    }
    return res.data;
  } catch (err) {
    console.error('Poll vote error:', err);
    toast.error('Failed to vote');
  }
};

// ✅ Get Voters of Poll Option
export const fetchVoters = async (postId, optionIndex, token) => {
  try {
    const res = await apiConnector('GET', `${GET_POLL_VOTERS}/${postId}/voters/${optionIndex}`, null, {
      Authorization: `Bearer ${token}`,
    });
    return res.data;
  } catch (err) {
    console.error('Fetch voters error:', err);
  }
};
