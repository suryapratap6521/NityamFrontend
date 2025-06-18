import React, { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllPosts,
  likePost,
  deletePost,
  comment,
  commentDelete,
  reply,
  commentLike,
  replyLike,
} from "../../../services/operations/postApi";
import { setPosts } from "../../../slices/postSlice";
import SinglePost from "./SinglePost";
import AdPosts from "./AdPost";
import PostSkeleton from "../../Common/PostSkeleton";
import useSocket from "../../../config/useSocket";

const Posts = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { posts } = useSelector((state) => state.post);

  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const observer = useRef();

  const socket = useSocket();

  // Infinite Scroll Handler
  const lastPostRef = useCallback(
    (node) => {
      if (loading || !hasMorePosts) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMorePosts]
  );

  // Fetch posts on page/token change
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const data = await getAllPosts(token, dispatch, page);
        if (!data?.posts?.length && !data?.advertisedPosts?.length) {
          setHasMorePosts(false);
        }
      } catch (err) {
        console.error("Error loading posts:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [token, page, dispatch]);

  // Real-time socket listener for new posts
  useEffect(() => {
    if (!socket) return;

    socket.on("newPostCreated", (newPost) => {
      const formatted = { ...newPost, type: 0 };
      dispatch(setPosts((prev) => [formatted, ...prev]));
    });

    return () => {
      socket.off("newPostCreated");
    };
  }, [socket, dispatch]);

  // Helper functions to update/delete from list
  const updatePostInList = (updatedPost) => {
    dispatch(setPosts((prev) => prev.map((p) => (p._id === updatedPost._id ? updatedPost : p))));
  };

  const removePostFromList = (postId) => {
    dispatch(setPosts((prev) => prev.filter((p) => p._id !== postId)));
  };

  // Error or empty fallback
  if (!Array.isArray(posts)) {
    return <div className="text-center text-red-500">Unable to load posts.</div>;
  }
  if (posts.length === 0 && !loading) {
    return <div className="text-center text-gray-500 mt-4">No posts available.</div>;
  }

  return (
    <div className="posts-container space-y-4">
      {posts.map((post, index) => {
        const isLast = posts.length === index + 1;
        return (
          <div key={post._id || `ad-${index}`} ref={isLast ? lastPostRef : null}>
            {post.type === 0 ? (
              <SinglePost
                post={post}
                user={user}
                onLike={likePost}
                onComment={comment}
                onCommentDelete={commentDelete}
                onReply={reply}
                onCommentLike={commentLike}
                onReplyLike={replyLike}
                onDelete={deletePost}
                updatePostInList={updatePostInList}
                removePostFromList={removePostFromList}
                token={token}
              />
            ) : (
              <AdPosts ad={post} />
            )}
          </div>
        );
      })}
      {loading && <PostSkeleton />}
    </div>
  );
};

export default Posts;
