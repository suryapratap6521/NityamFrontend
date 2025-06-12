import { IconButton } from "@mui/material";
import { BsThreeDots } from "react-icons/bs";

export default function PostHeader({ post, onMenuOpen, calculateTime }) {
  return (
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center space-x-3">
        <img
          className="h-12 w-12 rounded-full object-cover border-2 border-white"
          src={post?.postByUser?.image || "https://via.placeholder.com/150"}
          referrerPolicy="no-referrer"
          alt={post.postByUser?.firstName}
        />
        <div>
          <h4 className="font-semibold text-gray-800">
            {`${post.postByUser?.firstName} ${post.postByUser?.lastName}`}
          </h4>
          <p className="text-sm text-gray-500">
            {post.postByUser?.communityDetails?.communityName} •
            {post.postByUser?.city} • {calculateTime(post?.createdAt)}
          </p>
        </div>
      </div>
      <IconButton onClick={onMenuOpen} className="text-gray-600">
        <BsThreeDots />
      </IconButton>
    </div>
  );
}