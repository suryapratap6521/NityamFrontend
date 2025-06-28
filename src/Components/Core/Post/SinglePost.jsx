// SinglePost.jsx
import React, { useState, useRef } from "react";
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
  onLike,
  onComment,
  onCommentDelete,
  onReply,
  onCommentLike,
  onReplyLike,
  onDelete,
  updatePostInList,
  removePostFromList,
  token,
  setEditPostData,
}) => {
  const [showComments, setShowComments] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [replyText, setReplyText] = useState("");
  const commentInputRef = useRef(null);

  const scrollToCommentInput = () => {
    if (showComments) {
      setShowComments(false);
    } else {
      setShowComments(true);
      setTimeout(() => {
        commentInputRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(`${window.location.origin}/post/${post._id}`);
    alert("Post link copied to clipboard!");
  };

  return (
    <div className="bg-white rounded-xl shadow p-4 border border-gray-200">
      <PostHeader post={post} onMenuOpen={() => setIsModalOpen(true)} />

      {post.title && (
        <ExpandableText text={post.title} threshold={100} className="mb-3" />
      )}

      {post.imgPath?.length > 0 && (
        <div className={`grid gap-2 ${post.imgPath.length > 1 ? "grid-cols-2" : ""}`}>
          {post.imgPath.map((media, i) => (
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

      {post.postType === "event" && <EventDetails post={post} />}
      {post.postType === "poll" && (
        <Poll post={post} user={user} updatePostInList={updatePostInList} token={token} />
      )}

      <PostActions
        post={post}
        userId={user._id}
        onLike={onLike}
        onCommentClick={scrollToCommentInput}
        onShareClick={handleShare}
      />

      {showComments && (
        <CommentSection
          post={post}
          user={user}
          commentText={commentText}
          setCommentText={setCommentText}
          replyText={replyText}
          setReplyText={setReplyText}
          handleComment={(text) =>
            onComment(post._id, text, (updatedComments) => {
              updatePostInList({ ...post, comments: updatedComments });
            })
          }
          handleReply={(postId, commentId, text) =>
            onReply(postId, commentId, text, (updatedComments) => {
              updatePostInList({ ...post, comments: updatedComments });
            })
          }
          handleCommentLike={(commentId) =>
            onCommentLike(post._id, commentId, (updatedComments) => {
              updatePostInList({ ...post, comments: updatedComments });
            })
          }
          handleReplyLike={(postId, commentId, replyId) =>
            onReplyLike(postId, commentId, replyId, (updatedComments) => {
              updatePostInList({ ...post, comments: updatedComments });
            })
          }
          onCommentDelete={(commentId, replyId) =>
            onCommentDelete(post._id, commentId, replyId, (updatedComments) => {
              updatePostInList({ ...post, comments: updatedComments });
            })
          }
          commentInputRef={commentInputRef}
        />
      )}

      <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)} title="Post Actions">
        <div className="space-y-3">
          {post.postByUser?._id === user._id && (
            <>
              <button
                className="flex items-center w-full p-2 text-red-600 hover:bg-red-100 rounded"
                onClick={() => {
                  onDelete(post._id, () => {
                    removePostFromList(post._id);
                    setIsModalOpen(false);
                  });
                }}
              >
                <MdDelete className="mr-3" /> Delete Post
              </button>
              <button
                className="flex items-center w-full p-2 hover:bg-gray-50 rounded"
                onClick={() => {
                  setEditPostData(post);
                  setIsModalOpen(false);
                }}
              >
                <GrUpdate className="mr-3" /> Edit Post
              </button>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default SinglePost;
