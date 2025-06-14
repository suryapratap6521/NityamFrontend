import { useState } from "react";
import { useDispatch } from "react-redux";
import { setSharedPost } from "../../../slices/postSlice";
import { useNavigate } from "react-router-dom";
import { FiShare } from "react-icons/fi";
import { FaHeart, FaRegHeart, FaRegComment } from "react-icons/fa";
import IconButton from "@mui/material/IconButton";
import ShareModal from "./ShareModal";

export default function PostActions({ post, isLiked, onLike, onUnlike, onComment }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleConfirmShare = () => {
    dispatch(setSharedPost(post));
    setOpen(false);
    navigate("/dashboard/chat");
  };

  return (
    <div className="flex items-center justify-between mt-4 px-4 py-2 border-t border-b border-gray-100">
      <div className="flex items-center space-x-1">
        <span className="text-sm text-gray-600">{post.likes.length} likes</span>
      </div>
      <div className="flex space-x-4">
        <IconButton onClick={isLiked ? () => onUnlike(post._id) : () => onLike(post._id)}>
          {isLiked ? <FaHeart className="text-red-500" /> : <FaRegHeart className="text-gray-600" />}
        </IconButton>
        <IconButton onClick={onComment}>
          <FaRegComment className="text-gray-600" />
        </IconButton>
        <IconButton onClick={() => setOpen(true)}>
          <FiShare className="text-gray-600" />
        </IconButton>
      </div>

      <ShareModal
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={handleConfirmShare}
      />
    </div>
  );
}
