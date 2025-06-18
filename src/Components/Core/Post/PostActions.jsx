import React from "react";
import { FaRegHeart, FaHeart, FaRegComment } from "react-icons/fa";
import { FiShare } from "react-icons/fi";

const PostActions = ({
  post,
  userId,
  onLike,
  onCommentClick,
  onShareClick,
}) => {
  if (!post || !post.likes) return null;

  const isLiked = post.likes.some((like) => like._id === userId);

  return (
    <div className="flex items-center space-x-4 text-gray-600 mt-2 px-2">
      <button
        onClick={() => onLike && onLike(post._id)}
        className="flex items-center space-x-1"
      >
        {isLiked ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
        <span>{post.likes.length}</span>
      </button>

      <button
        onClick={() => onCommentClick && onCommentClick(post._id)}
        className="flex items-center space-x-1"
      >
        <FaRegComment />
        <span>{post.comments?.length || 0}</span>
      </button>

      <button
        onClick={() => onShareClick && onShareClick(post)}
        className="flex items-center space-x-1"
      >
        <FiShare />
      </button>
    </div>
  );
};

export default PostActions;
