// Posts.jsx
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
import {
  setPosts,
  appendPosts,
  prependPost,
  updateComments,
} from "../../../slices/postSlice";
import SinglePost from "./SinglePost";
import AdPosts from "./AdPost";
import PostSkeleton from "../../Common/PostSkeleton";
import useSocket from "../../../config/useSocket";
import SideBarPost from "./SideBarPost";

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
  const [editPostData, setEditPostData] = useState(null);

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

  useEffect(() => {
    if (!socket) return;

    const handleNewPost = (newPost) => {
      const formatted = { ...newPost, type: 0 };
      dispatch(prependPost(formatted));
    };

    socket.on("newPost", handleNewPost);
    return () => socket.off("newPost", handleNewPost);
  }, [socket, dispatch]);

  useEffect(() => {
    if (!socket) return;

    const handleLikeUpdate = ({ updatedPost }) => {
      const newPosts = posts.map((p) =>
        p._id === updatedPost._id ? { ...updatedPost, type: 0 } : p
      );
      dispatch(setPosts(newPosts));
    };

    socket.on("post liked", handleLikeUpdate);
    return () => socket.off("post liked", handleLikeUpdate);
  }, [socket, posts, dispatch]);

  useEffect(() => {
    if (!socket) return;

    const handleCommentUpdate = ({ postId, comments }) => {
      dispatch(updateComments({ postId, comments }));
    };

    socket.on("comment added", handleCommentUpdate);
    socket.on("comment updated", handleCommentUpdate);

    return () => {
      socket.off("comment added", handleCommentUpdate);
      socket.off("comment updated", handleCommentUpdate);
    };
  }, [socket, dispatch]);

  const updatePostInList = (updatedPost) => {
    const updatedPosts = posts.map((p) =>
      p._id === updatedPost._id ? updatedPost : p
    );
    dispatch(setPosts(updatedPosts));
  };

  const removePostFromList = (postId) => {
    const updatedPosts = posts.filter((p) => p._id !== postId);
    dispatch(setPosts(updatedPosts));
  };

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
                onLike={(postId) => likePost(postId, token)}
                onComment={(postId, text, cb) =>
                  comment({ postId, text }, token).then((res) => {
                    if (res?.success) cb(res.comments);
                  })
                }
                onCommentDelete={(postId, commentId, replyId, cb) =>
                  commentDelete(commentId, token).then(cb)
                }
                onCommentLike={(postId, commentId, cb) =>
                  commentLike(postId, commentId, token).then((res) => {
                    if (res?.success) cb(res.comments);
                  })
                }
                onReplyLike={(postId, commentId, replyId, cb) =>
                  replyLike(postId, commentId, replyId, token).then((res) => {
                    if (res?.success) cb(res.comments);
                  })
                }
                onReply={(postId, commentId, text, cb) =>
                  reply({ postId, commentId, text }, token).then((res) => {
                    if (res?.success) cb(res.comments);
                  })
                }
                onDelete={(postId, cb) =>
                  deletePost(postId, token, dispatch).then(cb)
                }
                updatePostInList={updatePostInList}
                removePostFromList={removePostFromList}
                token={token}
                setEditPostData={setEditPostData}
              />
            ) : (
              <AdPosts ad={post} />
            )}
          </div>
        );
      })}
      {loading && <PostSkeleton />}
      {editPostData && (
        <SideBarPost
          closeModal={() => setEditPostData(null)}
          editData={editPostData}
        />
      )}
    </div>
  );
};

export default Posts;
