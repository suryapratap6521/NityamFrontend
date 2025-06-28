import React, { useState } from "react";
import { FaRegHeart, FaHeart, FaRegComment } from "react-icons/fa";
import { FiSend } from "react-icons/fi";
import { BiRepost } from "react-icons/bi"; // Repost icon
import LikesModal from "./LikeModal";

const PostActions = ({ post, userId, onLike, onCommentClick, onShareClick }) => {
  const [openLikesModal, setOpenLikesModal] = useState(false);

  if (!post || !post.likes) return null;

  const isLiked = post.likes.some((like) =>
    typeof like === "object" ? like._id === userId : like === userId
  );

  const likeCount = post.likes.length;
  const commentCount = post.comments?.length || 0;

  // Show up to 3 avatars or emoji icons
  const likeIcons = ["👍", "❤️", "👏"]; // Customizable emoji-style icons
  const visibleIcons = likeIcons.slice(0, Math.min(likeCount, 3));

  return (
    <div className="mt-3 text-gray-600 text-sm border-t border-gray-200">
      {/* Top section: Like icons and counts */}
      <div
        className="flex justify-between items-center px-4 pt-2 cursor-pointer"
        onClick={() => onCommentClick && onCommentClick(post._id)}
      >
        <div className="flex items-center space-x-1">
          {visibleIcons.map((icon, index) => (
            <span key={index} className="text-sm">{icon}</span>
          ))}
          <span className="ml-1 text-gray-800 font-medium">{likeCount}</span>
        </div>
        <span className="text-gray-500">{commentCount} comments</span>
      </div>

      {/* Bottom section: Buttons */}
      <div className="flex justify-around mt-2 py-1 border-t border-gray-100">
        <button
          onClick={() => onLike && onLike(post._id)}
          className="flex items-center gap-2 py-2 hover:text-blue-600 transition"
        >
          {isLiked ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
          <span className="text-sm font-medium">Like</span>
        </button>

        <button
          onClick={() => onCommentClick && onCommentClick(post._id)}
          className="flex items-center gap-2 py-2 hover:text-blue-600 transition"
        >
          <FaRegComment />
          <span className="text-sm font-medium">Comment</span>
        </button>

        {/* <button
          onClick={() => onShareClick && onShareClick(post)}
          className="flex items-center gap-2 py-2 hover:text-blue-600 transition"
        >
          <BiRepost />
          <span className="text-sm font-medium">Repost</span>
        </button> */}

        <button
          className="flex items-center gap-2 py-2 hover:text-blue-600 transition"
        >
          <FiSend />
          <span className="text-sm font-medium">Send</span>
        </button>
      </div>

      {/* Likes Modal */}
      <LikesModal
        open={openLikesModal}
        onClose={() => setOpenLikesModal(false)}
        likes={post.likes}
      />
    </div>
  );
};

export default PostActions;
