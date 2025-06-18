import { IconButton } from "@mui/material";
import { BsThreeDots } from "react-icons/bs";

const PostHeader = ({ post, onMenuOpen }) => {
  const user = post.postByUser;

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center space-x-3">
        <img
          src={user?.image || "https://via.placeholder.com/100"}
          alt="avatar"
          className="w-10 h-10 rounded-full"
        />
        <div>
          <h4 className="font-semibold text-gray-800">
            {user?.firstName} {user?.lastName}
          </h4>
          <p className="text-xs text-gray-500">
            {user?.city} • {new Date(post.createdAt).toLocaleString()}
          </p>
        </div>
      </div>
      <IconButton onClick={onMenuOpen}>
        <BsThreeDots />
      </IconButton>
    </div>
  );
};

export default PostHeader;
