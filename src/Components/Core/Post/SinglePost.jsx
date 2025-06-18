import React, { useState } from "react";
import PostHeader from "./PostHeader";
import PostActions from "./PostActions";
import CommentSection from "./CommentsSection";
import EventDetails from "./EventDetails";
import Poll from "./Poll";
import ExpandableText from "../../Common/ExpandableText";
import Modal from "../../Common/Modal";
import { MdDelete } from "react-icons/md";
import { GrUpdate } from "react-icons/gr";

const SinglePost = ({
  post,
  user,
  handleLike,
  handleUnlike,
  handleComment,
  setCommentText,
  commentText,
  setReplyText,
  replyText,
  handleReply,
  handleCommentLike,
  handleReplyLike,
}) => {
  const [showComments, setShowComments] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const mediaItems = post.imgPath || [];
  const isLiked = post.likes.some((like) => like._id === user._id);
  const isEvent = post.postType === "event";
  const isPoll = post.postType === "poll";

  return (
    <div className="bg-white rounded-xl shadow p-4 border border-gray-200">
      <PostHeader post={post} onMenuOpen={() => setIsModalOpen(true)} />
      {post.title && <ExpandableText text={post.title} threshold={100} className="mb-3" />}
      {mediaItems.length > 0 && (
        <div className={`grid gap-2 ${mediaItems.length > 1 ? "grid-cols-2" : ""}`}>
          {mediaItems.map((media, i) => (
            <div key={i}>
              {media.endsWith(".mp4") ? (
                <video controls className="w-full h-64 object-cover rounded-lg">
                  <source src={media} type="video/mp4" />
                </video>
              ) : (
                <img src={media} alt="media" className="w-full h-64 object-cover rounded-lg" />
              )}
            </div>
          ))}
        </div>
      )}
      {isEvent && <EventDetails post={post} />}
      {isPoll && <Poll post={post} user={user} />}
      <PostActions
        post={post}
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
      <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)} title="Post Actions">
        <div className="space-y-3">
          <button className="flex items-center w-full p-2 hover:bg-gray-50 rounded">
            <GrUpdate className="mr-3" /> Edit Post
          </button>
          <button className="flex items-center w-full p-2 text-red-600 hover:bg-red-100 rounded">
            <MdDelete className="mr-3" /> Delete Post
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default SinglePost;
