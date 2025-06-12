import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllPosts, likePost, unlikePost, deletePost, comment, commentDelete, reply, replyLike, commentLike } from "../../../services/operations/postApi";
import { setPosts } from "../../../slices/postSlice";
import SinglePost from "./SinglePost";
import 'tailwindcss/tailwind.css';
import CommentSection from "./CommentsSection";
import PostSkeleton from "../../Common/PostSkeleton";
import { IconButton } from "@mui/material";
import { FaRegComment, FaRegHeart, FaHeart } from "react-icons/fa";
import { FiShare } from "react-icons/fi";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AdPosts from "./AdPost";


const Posts = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { posts } = useSelector((state) => state.post);
  const adData = useSelector((state) => state.ad.allAds || []);

  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [expandedPostId, setExpandedPostId] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    const getPosts = async () => {
      try {
        const response = await getAllPosts(token, dispatch);
        // dispatch(setPosts(response));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setLoading(false);
      }
    };

    getPosts();
  }, [token, dispatch]);

const handleLike = async (postId) => {
  try {
    const updatedPost = await likePost(postId, token);
    updatedPost.type = 0; // Ensure post type is retained for rendering

    const updatedPosts = posts.map((post) =>
      post._id === updatedPost._id ? updatedPost : post
    );

    dispatch(setPosts(updatedPosts));
  } catch (error) {
    console.error("Error liking post:", error);
  }
};

const handleUnlike = async (postId) => {
  try {
    const updatedPost = await unlikePost(postId, token);
    updatedPost.type = 0; // Ensure post type is retained for rendering

    const updatedPosts = posts.map((post) =>
      post._id === updatedPost._id ? updatedPost : post
    );

    dispatch(setPosts(updatedPosts));
  } catch (error) {
    console.error("Error unliking post:", error);
  }
};


  const handlePopoverOpen = (event, postId) => {
    setAnchorEl(event.currentTarget);
    setSelectedPost(postId);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
    setSelectedPost(null);
  };

  const handleDeletePost = async (postId) => {
    try {
      await deletePost(token, postId);
      const updatedPosts = posts.filter((post) => post._id !== postId);
      dispatch(setPosts(updatedPosts));
      handlePopoverClose();
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };


  if (posts === null || posts?.length === 0) {
    return <div>No Posts available</div>
  }

  const handleComment = async (postId, commentText) => {
    try {
      await comment(postId, commentText, user._id, token, dispatch);
      setCommentText("");
    } catch (error) {
      console.error("Error commenting post:", error);
    }
  };

  const handleCommentDelete = async (postId, commentId) => {
    try {
      await commentDelete(postId, commentId, dispatch, token);
    } catch (error) {
      console.error("Error in commenting delete", error);
    }
  };

  const handleReply = async (postId, commentId) => {
    try {
      await reply(postId, commentId, replyText, dispatch, token);
    } catch (error) {
      console.error("Error in replying the comment", error);
    }
  }
  const handleCommentLike = async (postId, commentId) => {
    try {
      await commentLike(postId, commentId, dispatch, token);
    } catch (error) {
      console.error("Error in liking the comment", error);
    }
  }
  const handleReplyLike = async (postId, commentId, replyId) => {
    try {
      await replyLike(postId, commentId, replyId, dispatch, token);

    } catch (error) {
      console.error("Error in liking the reply", error);
    }
  }

  const handleExpandClick = (postId) => {
    setExpandedPostId(expandedPostId === postId ? null : postId);
  };


  console.log(posts,"--->")

  return (
    <div className="posts-container">
      {posts.map((post, index) => (
        <React.Fragment key={post._id || `ad-${index}`}>
          {post.type === 0 ? (
            <SinglePost
              post={post}
              user={user}
              handleLike={handleLike}
              handleUnlike={handleUnlike}
              handleComment={handleComment}
              setCommentText={setCommentText}
              commentText={commentText}
              handleDeletePost={handleDeletePost}
              setReplyText={setReplyText}
              replyText={replyText}
              handleCommentLike={handleCommentLike}
              handleReply={handleReply}
              handleReplyLike={handleReplyLike}
            />
          ) : (
            <AdPosts ad={post} />
          )}
        </React.Fragment>
      ))}

    </div>
  );

};

export default Posts;