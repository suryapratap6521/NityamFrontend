// services/operations/postApi.js
import { apiConnector } from '../apiConnector';
import { postEndpoints } from '../apis';
import toast from 'react-hot-toast';
import { setPosts,updatePoll } from '../../slices/postSlice';
import { setAllAds } from '../../slices/adSlice';
import { handleResponse } from "../../utils/apiUtils";

export const getAllPosts = async (token, dispatch) => {
  toast.dismiss();
  try {
    // console.log(token,"token of post------------>");
    const response = await apiConnector("GET", postEndpoints.GET_ALL_POST, null, {
      Authorization: `Bearer ${token}`,
    });
    // console.log(response, "response");

    if (!response?.data?.success) {
      throw new Error("Could not fetch posts");
    }

    dispatch(setPosts(response.data.communityPost));
    dispatch(setAllAds(response.data.communityAdvertisedPosts));
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
  toast.dismiss();
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
  finally{
  toast.dismiss(toastId);
  }
};

export const voteOnPoll = async (postId, optionIndex, token) => {
  // toast.dismiss();
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
  // toast.dismiss();
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
  // toast.dismiss();
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

}

export const likePost = async (postId, token, dispatch) => {
  // toast.dimiss();
  try {
    const response = await apiConnector("POST", postEndpoints.SET_LIKE, { postId }, {
      Authorization: `Bearer ${token}`,
    });

    const updatedLikes = response.data;
    console.log(updatedLikes, "reduxxx")
    dispatch(setPosts(updatedLikes)); // Update posts with updated likes
  } catch (error) {
    console.error("Error liking post:", error);
    toast.error("Error liking post");
    throw error;
  }
};

export const unlikePost = async (postId, token, dispatch) => {
  // toast.dismiss();
  try {
    const response = await apiConnector("POST", postEndpoints.UNLIKE, { postId }, {
      Authorization: `Bearer ${token}`,
    });

    const updatedLikes = response.data;
    console.log(updatedLikes, "reduxxx")
    dispatch(setPosts(updatedLikes)); // Update posts with updated likes
  } catch (error) {
    console.error("Error unliking post:", error);
    toast.error("Error unliking post");
    throw error;
  }
};

export const comment = async (postId, text, userId, token, dispatch) => {
  toast.dismiss();
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
}
export const commentDelete = async (postId, commentId, dispatch, token) => {
  // toast.dismiss();
  try {
    const response = await apiConnector("POST", postEndpoints.UNCOMMENT, { postId, commentId }, {
      Authorization: `Bearer ${token}`,
    })
    const updatedComment = response.data;
    dispatch(setPosts(updatedComment));
  } catch (error) {
    console.error("Error in deleting Comment", error);
    toast.error("Error commenting deleting post");
    throw error;
  }
}
export const reply=async(postId,commentId,text,dispatch,token)=>{
  try {
    const response=await apiConnector("POST",postEndpoints.REPLY,{postId,commentId,text},{
      Authorization: `Bearer ${token}`,
    })
    const updatedComment = response.data.allPosts;
    dispatch(setPosts(updatedComment));
  } catch (error) {
    console.error("Error commenting post:", error);
    toast.error("Error commenting post");
    throw error;
  }
}

export const commentLike=async(postId,commentId,dispatch,token)=>{
  try {
    const response = await apiConnector("POST", postEndpoints.LIKE_COMMENT, { postId, commentId }, {
      Authorization: `Bearer ${token}`,
    })
    const updatedComment = response.data.allPosts;
    console.log(updatedComment,"----------->updatedComment");
    dispatch(setPosts(updatedComment));
  } catch (error) {
    console.error("Error Liking comment:", error);
    toast.error("Error Liking comment");
    throw error;
  }
}

export const replyLike=async(postId,commentId,replyId,dispatch,token)=>{
  try {
    const response=await apiConnector("POST",postEndpoints.LIKE_REPLY,{postId,commentId,replyId},{
      Authorization: `Bearer ${token}`,
    })
    const updatedComment = response.data.allPosts;
    console.log(updatedComment,"----------->updatedComment h ye")
    dispatch(setPosts(updatedComment));
  } catch (error) {
    console.error("Error commenting post:", error);
    toast.error("Error commenting post");
    throw error;
  }
}

export const nestedReply=async( postId, commentId, replyId,text,dispatch,token)=>{
  try {
    const response=await apiConnector("POST",postEndpoints.NESTED_REPLY,{postId, commentId, replyId,text},{
      Authorization: `Bearer ${token}`,
    })
   
  } catch (error) {
    console.error("Error commenting post:", error);
    toast.error("Error commenting post");
    throw error;
  }
}