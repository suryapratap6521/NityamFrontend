import React, { useState } from "react";
import { IconButton } from "@mui/material";
import like from "../../../assests/like.png";
import unlike from "../../../assests/unlike.png";
import Comment_icon from "../../../assests/Comment_icon.gif";
import Likes_Count from "../../../assests/Likes_Count.gif";
import { calculateTime } from "../../../utils/miliToHours";
import Share_Icon from "../../../assests/Share_Icon.png";
import CommentSection from "./CommentsSection";
import { BsThreeDots } from "react-icons/bs";
import Modal from "../../Common/Modal";
import { GrUpdate } from 'react-icons/gr';
import { MdDelete } from 'react-icons/md';

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
  handleReplyLike
}) => {
  const [showComments, setShowComments] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    handleDeletePost(post._id);
    setIsModalOpen(false);
  };

  const renderMedia = () => {
    const mediaItems = post.imgPath || [];
    if (mediaItems.length === 0) return null;

    if (mediaItems.length === 1) {
      const media = mediaItems[0];
      const extension = media.split('.').pop();
      return extension === 'mp4' ? (
        <video controls className="w-full">
          <source src={media} type="video/mp4" />
        </video>
      ) : (
        <img className="w-full" src={media} alt="Post visual" />
      );
    }

    return (
      <div className="grid grid-cols-2 gap-1">
        {mediaItems.slice(0, 4).map((media, index) => (
          <div key={index} className="relative">
            {media.endsWith('.mp4') ? (
              <video controls className="w-full h-full object-cover">
                <source src={media} type="video/mp4" />
              </video>
            ) : (
              <img
                className="w-full h-full object-cover"
                src={media}
                alt={`Post visual ${index + 1}`}
              />
            )}
            {mediaItems.length > 4 && index === 3 && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-2xl">
                +{mediaItems.length - 4}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-xl mb-4">
      <div className="md:flex">
        <div className="p-4 w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img
                className="h-12 w-12 rounded-full"
                src={post?.postByUser?.image}
                alt={`${post.postByUser?.firstName} ${post.postByUser?.lastName}`}
              />
              <div className="ml-3">
                <div className="text-sm font-medium text-gray-900">{`${post.postByUser?.firstName} ${post.postByUser?.lastName}`}</div>
                <div className="text-xs text-gray-500">
                  {post.postByUser.communityDetails.communityName} •{" "}
                  {post.postByUser.city} •{" "}
                  {`Posted ${calculateTime(post?.createdAt)}`} • 🌍
                </div>
              </div>
            </div>
            <IconButton
              className="ml-auto"
              onClick={handleOpenModal}
            >
              <BsThreeDots />
            </IconButton>
            <Modal
              show={isModalOpen}
              onClose={handleCloseModal}
              title="Post Actions"
            >
              <ul className="space-y-2">
                <li className="flex items-center space-x-3 cursor-pointer hover:bg-gray-100 p-2 rounded-md">
                  <GrUpdate className="text-2xl" />
                  <span className="text-sm font-medium">Update Post</span>
                </li>
                <li className="flex items-center space-x-3 cursor-pointer hover:bg-gray-100 p-2 rounded-md" onClick={handleDelete}>
                  <MdDelete className="text-2xl text-red-500" />
                  <span className="text-sm font-medium">Delete Post</span>
                </li>
              </ul>
            </Modal>
          </div>
          <div className="mt-4">
            <p className="text-gray-700 text-sm">{post.title}</p>
          </div>
        </div>
      </div>
      <div className="media-section">
        {renderMedia()}
      </div>
      <div className="px-4 py-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            {post.likes.length > 0 ? (
              <span className="flex items-center space-x-1">
                <img
                  src={Likes_Count}
                  alt="Likes count"
                  className="h-10 w-10"
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
                src={post.likes.includes(user._id) ? like : unlike}
                alt="like/unlike"
                className="h-8 w-8"
              />
            </IconButton>
            <IconButton
              aria-label="comment"
              onClick={() => setShowComments(true)}
              style={{ display: "flex", alignItems: "center" }}
            >
              <img src={Comment_icon} alt="Comment" className="h-6 w-6" />
              <span
                style={{
                  backgroundColor: "#f0f0f0",
                  borderRadius: "50%",
                  padding: "0.2em 0.6em",
                  marginLeft: "0.5em",
                  fontSize: "0.9em",
                  fontWeight: "bold",
                }}
              >
                {post.comments.length}
              </span>
            </IconButton>
            <IconButton>
              <img src={Share_Icon} alt="Share" className="h-6 w-6" />
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
    </div>
  );
};

export default SinglePost;
