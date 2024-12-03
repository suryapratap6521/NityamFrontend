import React, { useState } from "react";
import { IconButton } from "@mui/material";
import { BsThreeDots } from "react-icons/bs";
import { GrUpdate } from "react-icons/gr";
import { MdDelete } from "react-icons/md";
import CommentSection from "./CommentsSection";
import Modal from "../../Common/Modal";
import Likes_Count from "../../../assests/Likes_Count.gif";
import like from "../../../assests/like.png";
import unlike from "../../../assests/unlike.png";
import Comment_icon from "../../../assests/Comment_icon.gif";
import Share_Icon from "../../../assests/Share_Icon.png";
import { calculateTime } from "../../../utils/miliToHours";

const SinglePost = ({
  post,
  user,
  handleLike,
  handleUnlike,
  handleComment,
  setCommentText,
  commentText,
  handleDeletePost,
  setReplyText,
  replyText,
  handleReply,
  handleCommentLike,
  handleReplyLike,
}) => {
  const [showComments, setShowComments] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const handleDelete = () => {
    handleDeletePost(post._id);
    setIsModalOpen(false);
  };

  const openMediaViewer = (media) => setSelectedMedia(media);
  const closeMediaViewer = () => setSelectedMedia(null);

  const calculatePollPercentage = (votes, totalVotes) =>
    totalVotes === 0 ? 0 : ((votes / totalVotes) * 100).toFixed(2);

  const renderMedia = () => {
    const mediaItems = post.imgPath || [];
    if (mediaItems.length === 0) return null;

    if (mediaItems.length === 1) {
      // Single image/video
      const media = mediaItems[0];
      const extension = media.split(".").pop();
      return extension === "mp4" ? (
        <video
          controls
          className="w-full h-64 object-cover rounded-lg cursor-pointer"
          onClick={() => openMediaViewer(media)}
        >
          <source src={media} type="video/mp4" />
        </video>
      ) : (
        <img
          src={media}
          alt="Post Media"
          className="w-full h-64 object-cover rounded-lg cursor-pointer"
          onClick={() => openMediaViewer(media)}
        />
      );
    }

    // Multiple images/videos
    return (
      <div className="media-container grid grid-cols-2 gap-2">
        {mediaItems.map((media, index) => {
          const extension = media.split(".").pop();
          return extension === "mp4" ? (
            <video
              key={index}
              controls
              className="w-full h-32 object-cover rounded-lg cursor-pointer"
              onClick={() => openMediaViewer(media)}
            >
              <source src={media} type="video/mp4" />
            </video>
          ) : (
            <img
              key={index}
              src={media}
              alt={`Media ${index}`}
              className="w-full h-32 object-cover rounded-lg cursor-pointer"
              onClick={() => openMediaViewer(media)}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="max-w-lg mx-auto bg-white rounded-lg shadow-md overflow-hidden mb-4">
      {/* Header */}
      <div className="p-4 flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <img
            className="h-10 w-10 rounded-full object-cover"
            src={post?.postByUser?.image || ""}
            alt={`${post.postByUser?.firstName}`}
          />
          <div>
            <h4 className="text-sm font-medium">{`${post.postByUser?.firstName} ${post.postByUser?.lastName}`}</h4>
            <p className="text-xs text-gray-500">
              {post.postByUser?.communityDetails?.communityName} •{" "}
              {post.postByUser?.city} • {calculateTime(post?.createdAt)} • 🌍
            </p>
          </div>
        </div>
        <IconButton onClick={handleOpenModal}>
          <BsThreeDots />
        </IconButton>
        {/* Modal */}
        <Modal
          show={isModalOpen}
          onClose={handleCloseModal}
          title="Post Actions"
        >
          <ul className="space-y-2">
            <li className="flex items-center space-x-3 cursor-pointer hover:bg-gray-100 p-2 rounded-md">
              <GrUpdate className="text-xl" />
              <span className="text-sm font-medium">Update Post</span>
            </li>
            <li
              className="flex items-center space-x-3 cursor-pointer hover:bg-gray-100 p-2 rounded-md"
              onClick={handleDelete}
            >
              <MdDelete className="text-xl text-red-500" />
              <span className="text-sm font-medium">Delete Post</span>
            </li>
          </ul>
        </Modal>
      </div>

      {/* Post Content */}
      <div className="mt-4 px-4">
        <p className="text-gray-700">{post.title}</p>
      </div>

      <div className="media-section">{renderMedia()}</div>

      {/* Like, Comment, Share Section */}
      <div className="px-4 py-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            {post.likes.length > 0 ? (
              <span className="flex items-center space-x-1">
                <img
                  src={Likes_Count}
                  alt="Likes count"
                  className="h-6 w-6 object-contain"
                />
                <span>{post.likes.length}</span>
              </span>
            ) : (
              "Be the first to react"
            )}
          </div>
          <div className="flex items-center space-x-4">
            <IconButton
              aria-label="like"
              onClick={() =>
                post.likes.includes(user._id)
                  ? handleUnlike(post._id)
                  : handleLike(post._id)
              }
            >
              <img
                src={post.likes.includes(user?._id) ? like : unlike}
                alt="like/unlike"
                className="h-6 w-6 object-contain"
              />
            </IconButton>
            <IconButton
              aria-label="comment"
              onClick={() => setShowComments(true)}
            >
              <img
                src={Comment_icon}
                alt="Comment"
                className="h-6 w-6 object-contain"
              />
            </IconButton>
            <IconButton>
              <img src={Share_Icon} alt="Share" className="h-6 w-6 object-contain" />
            </IconButton>
          </div>
        </div>
      </div>

      {showComments && (
        <CommentSection
          post={post}
          handleComment={handleComment}
          user={user}
          setCommentText={setCommentText}
          commentText={commentText}
          setReplyText={setReplyText}
          replyText={replyText}
          handleReply={handleReply}
          handleCommentLike={handleCommentLike}
          handleReplyLike={handleReplyLike}
        />
      )}

      {/* Media Viewer Modal */}
      {selectedMedia && (
        <Modal show={true} onClose={closeMediaViewer} title="Media Viewer">
          <div className="media-viewer">
            {selectedMedia.endsWith(".mp4") ? (
              <video controls className="w-full h-auto">
                <source src={selectedMedia} type="video/mp4" />
              </video>
            ) : (
              <img
                src={selectedMedia}
                alt="Selected Media"
                className="w-full h-auto object-contain"
              />
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default SinglePost;
