import { IconButton } from "@mui/material";
import { FaRegComment, FaRegHeart, FaHeart } from "react-icons/fa";
import { FiShare } from "react-icons/fi";

export default function PostActions({ post, isLiked, onLike, onUnlike, onComment }) {
  return (
    <div className="flex items-center justify-between mt-4 px-4 py-2 border-t border-b border-gray-100">
      <div className="flex items-center space-x-1">
        <span className="text-sm text-gray-600">
          {post.likes.length} likes
        </span>
      </div>
      
      <div className="flex space-x-4">
        <IconButton
          onClick={isLiked ? () => onUnlike(post._id) : () => onLike(post._id)}
        >
          {isLiked ? (
            <FaHeart className="text-red-500" />
          ) : (
            <FaRegHeart className="text-gray-600" />
          )}
        </IconButton>
        
        <IconButton onClick={onComment}>
          <FaRegComment className="text-gray-600" />
        </IconButton>
        
        <IconButton>
          <FiShare className="text-gray-600" />
        </IconButton>
      </div>
    </div>
  );
}