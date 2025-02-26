// SinglePost.jsx
import React, { useState } from "react";
import { IconButton } from "@mui/material";
import { BsThreeDots } from "react-icons/bs";
import { GrUpdate } from "react-icons/gr";
import { MdDelete } from "react-icons/md";
import CommentSection from "./CommentsSection";
import Modal from "../../Common/Modal";
import { calculateTime } from "../../../utils/miliToHours";
import PostHeader from "./PostHeader";
import PostActions from "./PostActions";
import Poll from "./Poll";
import EventDetails from "./EventDetails";

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

  const mediaItems = post.imgPath || [];
  const isLiked = post.likes.includes(user?._id);
  const isEvent = post.postType === "event";
  const isPoll = post.postType === "poll";

  const renderMedia = () => {
    if (mediaItems.length === 0) return null;

    return (
      <div className={`grid gap-2 mt-4 ${mediaItems.length > 1 ? "grid-cols-2" : ""}`}>
        {mediaItems.map((media, index) => {
          const isVideo = media.endsWith(".mp4");
          return (
            <div key={index} className="relative group">
              {isVideo ? (
                <video
                  controls
                  className="w-full h-64 object-cover rounded-lg cursor-pointer"
                  onClick={() => setSelectedMedia(media)}
                >
                  <source src={media} type="video/mp4" />
                </video>
              ) : (
                <img
                  src={media}
                  alt="Post media"
                  className="w-full h-64 object-cover rounded-lg cursor-pointer"
                  onClick={() => setSelectedMedia(media)}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <article className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm p-6 mb-6">
      <PostHeader
        post={post}
        onMenuOpen={() => setIsModalOpen(true)}
        calculateTime={calculateTime}
      />

      <div className="mt-4">
        {post.title && <p className="text-gray-800 mb-4">{post.title}</p>}
        
        {renderMedia()}

        {isEvent && <EventDetails post={post} />}
        {isPoll && <Poll post={post} user={user} />}
      </div>

      <PostActions
        post={post}
        user={user}
        isLiked={isLiked}
        onLike={handleLike}
        onUnlike={handleUnlike}
        onComment={() => setShowComments(!showComments)}
      />

      {showComments && (
        <CommentSection
          post={post}
          user={user}
          commentText={commentText}
          replyText={replyText}
          setCommentText={setCommentText}
          setReplyText={setReplyText}
          handleComment={handleComment}
          handleReply={handleReply}
          handleCommentLike={handleCommentLike}
          handleReplyLike={handleReplyLike}
        />
      )}

      <Modal
        show={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Post Actions"
      >
        <div className="p-4 space-y-3">
          <button className="flex items-center w-full p-2 hover:bg-gray-50 rounded-lg">
            <GrUpdate className="mr-3" />
            Edit Post
          </button>
          <button
            onClick={() => handleDeletePost(post._id)}
            className="flex items-center w-full p-2 text-red-600 hover:bg-red-50 rounded-lg"
          >
            <MdDelete className="mr-3" />
            Delete Post
          </button>
        </div>
      </Modal>

      {selectedMedia && (
        <MediaViewer media={selectedMedia} onClose={() => setSelectedMedia(null)} />
      )}
    </article>
  );
};

const MediaViewer = ({ media, onClose }) => (
  <Modal show={!!media} onClose={onClose} title="Media Viewer">
    <div className="max-h-[80vh] overflow-auto">
      {media.endsWith(".mp4") ? (
        <video controls className="w-full">
          <source src={media} type="video/mp4" />
        </video>
      ) : (
        <img src={media} alt="Enlarged media" className="w-full h-auto" />
      )}
    </div>
  </Modal>
);

export default SinglePost;