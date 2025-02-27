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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faRegular } from '@fortawesome/free-solid-svg-icons';

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
          className="w-full h-80 object-cover rounded-lg cursor-pointer"
          onClick={() => openMediaViewer(media)}
        >
          <source src={media} type="video/mp4" />
        </video>
      ) : (
        <img
          src={media}
          alt="Post Media"
          className="w-full h-80 object-cover rounded-lg cursor-pointer"
          onClick={() => openMediaViewer(media)}
        />
      );
    }

    // Multiple images/videos
    return (
      <div className="media-container grid grid-cols-2 gap-2 px-3">
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
    <div className="max-w-3xl mx-auto bg-white rounded-lg border-2  border-gray-200 overflow-hidden mb-4">
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
              {post.postByUser?.city} • {calculateTime(post?.createdAt)}
            </p>
          </div>
        </div>
        <div onClick={handleOpenModal} className="rotate-90">
          <BsThreeDots />
        </div>
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
      <div className="px-4">
        <p className="text-gray-600">{post.title}</p>
      </div>

      <div className="media-section px-4 mt-2">{renderMedia()}</div>

      {/* Like, Comment, Share Section */}
      <div className="px-4 py-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2 text-gray-600 text-sm">
            {post.likes.length > 0 ? (
              <span className="flex items-center space-x-1">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15.63 3.45753C15.2469 3.07428 14.7921 2.77026 14.2915 2.56284C13.7909 2.35542 13.2543 2.24866 12.7125 2.24866C12.1706 2.24866 11.634 2.35542 11.1335 2.56284C10.6329 2.77026 10.178 3.07428 9.79497 3.45753L8.99997 4.25253L8.20497 3.45753C7.4312 2.68376 6.38174 2.24906 5.28747 2.24906C4.19319 2.24906 3.14374 2.68376 2.36997 3.45753C1.5962 4.2313 1.1615 5.28075 1.1615 6.37503C1.1615 7.4693 1.5962 8.51876 2.36997 9.29253L3.16497 10.0875L8.99997 15.9225L14.835 10.0875L15.63 9.29253C16.0132 8.90946 16.3172 8.45464 16.5247 7.95404C16.7321 7.45345 16.8388 6.91689 16.8388 6.37503C16.8388 5.83316 16.7321 5.2966 16.5247 4.79601C16.3172 4.29542 16.0132 3.84059 15.63 3.45753Z" stroke="black" stroke-opacity="0.4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>

                <span className="text-gray-600 text-sm">{post.likes.length}</span>
              </span>
            ) : (
              "Be the first to react"
            )}

            {post.likes.length > 0 ? (
              <span className="flex items-center space-x-1">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15.75 8.62502C15.7526 9.61492 15.5213 10.5914 15.075 11.475C14.5458 12.5338 13.7323 13.4244 12.7256 14.047C11.7189 14.6696 10.5587 14.9996 9.375 15C8.3851 15.0026 7.40859 14.7713 6.525 14.325L2.25 15.75L3.675 11.475C3.2287 10.5914 2.99742 9.61492 3 8.62502C3.00046 7.44134 3.33046 6.28116 3.95304 5.27443C4.57562 4.26771 5.46619 3.4542 6.525 2.92502C7.40859 2.47872 8.3851 2.24744 9.375 2.25002H9.75C11.3133 2.33627 12.7898 2.99609 13.8969 4.10317C15.0039 5.21024 15.6638 6.68676 15.75 8.25002V8.62502Z" stroke="black" stroke-opacity="0.4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>

                <span className="text-gray-600 text-sm">{post.comments.length}</span>
              </span>
            ) : null}


          </div>
          <div className="flex items-center space-x-4 mt-[-30px] mb-[20px]">

            <div
              aria-label="comment"
              onClick={(e) => {
                e.stopPropagation();
                setShowComments(!showComments);
              }}
              style={{ background: '#4A00E0', padding: '10px', borderRadius: '100%' }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 11.5C21.0034 12.8199 20.6951 14.1219 20.1 15.3C19.3944 16.7118 18.3098 17.8992 16.9674 18.7293C15.6251 19.5594 14.0782 19.9994 12.5 20C11.1801 20.0035 9.87812 19.6951 8.7 19.1L3 21L4.9 15.3C4.30493 14.1219 3.99656 12.8199 4 11.5C4.00061 9.92179 4.44061 8.37488 5.27072 7.03258C6.10083 5.69028 7.28825 4.6056 8.7 3.90003C9.87812 3.30496 11.1801 2.99659 12.5 3.00003H13C15.0843 3.11502 17.053 3.99479 18.5291 5.47089C20.0052 6.94699 20.885 8.91568 21 11V11.5Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>

            </div>
            <div style={{ background: '#4A00E0', padding: '10px', borderRadius: '100%' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 7H18C18.6566 7 19.3068 7.12933 19.9134 7.3806C20.52 7.63188 21.0712 8.00017 21.5355 8.46447C21.9998 8.92876 22.3681 9.47996 22.6194 10.0866C22.8707 10.6932 23 11.3434 23 12C23 12.6566 22.8707 13.3068 22.6194 13.9134C22.3681 14.52 21.9998 15.0712 21.5355 15.5355C21.0712 15.9998 20.52 16.3681 19.9134 16.6194C19.3068 16.8707 18.6566 17 18 17H15M9 17H6C5.34339 17 4.69321 16.8707 4.08658 16.6194C3.47995 16.3681 2.92876 15.9998 2.46447 15.5355C1.52678 14.5979 1 13.3261 1 12C1 10.6739 1.52678 9.40215 2.46447 8.46447C3.40215 7.52678 4.67392 7 6 7H9" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M8 12H16" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>

            </div>
            <div
              aria-label="like"
              style={{ background: post.likes.includes(user?._id) ? '#D10709' : '#FFFFFF', padding: '18px', borderRadius: '100%', boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.10)' }}
              onClick={() =>
                post.likes.includes(user._id)
                  ? handleUnlike(post._id)
                  : handleLike(post._id)
              }
            >
              {/* <img
                src={post.likes.includes(user?._id) ? like : unlike}
                alt="like/unlike"
                className="h-6 w-6 object-contain"
              /> */}
              <svg width="20" height="22" viewBox="0 0 20 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.3236 3C12.5749 3 11.0344 3.95667 10.16 5.46C9.28564 3.95667 7.74509 3 5.99636 3C3.24836 3 1 5.46 1 8.46667C1 13.8878 10.16 19.4 10.16 19.4C10.16 19.4 19.32 13.9333 19.32 8.46667C19.32 5.46 17.0716 3 14.3236 3Z" fill={post.likes.includes(user?._id) ? '#FFFFFF' : '#D10709'} />
              </svg>

            </div>
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
