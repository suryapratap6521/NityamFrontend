import React, { useState } from 'react';
import { Button, IconButton } from "@mui/material";
import like from "../../../assests/like.png";
import unlike from "../../../assests/unlike.png";
import { calculateTime } from "../../../utils/miliToHours";

const CommentsSection = ({ post, handleComment, user, setCommentText, commentText, setReplyText, replyText, handleReply, handleCommentLike, handleReplyLike }) => {
  const [showAllComments, setShowAllComments] = useState(false);
  const [replyingToCommentId, setReplyingToCommentId] = useState(null);

  const handleShowAllComments = () => {
    setShowAllComments(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleComment(post._id, commentText);
    setCommentText("");
  };

  const handleReplySubmit = (e, commentId) => {
    e.preventDefault();
    handleReply(post._id, commentId, replyText);
    setReplyText("");
    setReplyingToCommentId(null);
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-xl mb-4 p-4">
      {post.comments.length > 1 && !showAllComments && (
        <span
          onClick={handleShowAllComments}
          className="underline mb-4 cursor-pointer text-black block"
        >
          See {post.comments.length - 1} previous comments
        </span>
      )}
      <div>
        {(showAllComments ? post.comments : post.comments.slice(-1)).map((comment) => (
          <div key={comment._id} className="mb-4">
            <div className="flex items-center mb-2">
              <img
                src={comment.commentedBy.image}
                alt={`${comment.commentedBy.firstName} ${comment.commentedBy.lastName}`}
                className="h-8 w-8 rounded-full"
              />
              <div className="ml-3">
                <div className="text-sm font-medium text-gray-900">{`${comment.commentedBy.firstName} ${comment.commentedBy.lastName}`}</div>
                <div className="text-xs text-gray-500">
                  {comment.commentedBy.communityDetails.communityName} •{" "}
                  {comment.commentedBy.city} •{" "}
                  {`Posted ${calculateTime(comment.createdAt)}`} • 🌍
                </div>
              </div>
            </div>
            <p className="ml-11 text-sm">{comment.text}</p>
            <div className="flex items-center space-x-4 ml-11">
              <Button size="small" onClick={() =>
                comment.likes.includes(user._id)
                  ? handleCommentLike(post._id, comment._id)
                  : handleCommentLike(post._id, comment._id)
              }>
                {comment.likes.includes(user._id) ? (<span style={{color:"red"}}><b>Like</b></span>) : (<span><b>Like</b></span>)}
              </Button>
              <Button size="small" onClick={() => setReplyingToCommentId(comment._id)}>
                Reply
              </Button>
              <div className="flex">
                <img
                  src={comment.likes.includes(user._id) ? like : unlike}
                  alt="like/unlike"
                  className="h-5 w-5"
                />
                <span>{comment.likes.length === 0 ? "" : comment.likes.length}</span>
              </div>
            </div>
            {comment.replies && comment.replies.map((reply) => (
              <div key={reply._id} className="ml-11 mt-4">
                <div className="flex items-center mb-2">
                  <img
                    src={reply.repliedBy.image}
                    alt={`${reply.repliedBy.firstName} ${reply.repliedBy.lastName}`}
                    className="h-8 w-8 rounded-full"
                  />
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900">{`${reply.repliedBy.firstName} ${reply.repliedBy.lastName}`}</div>
                    <div className="text-xs text-gray-500">
                      {reply.repliedBy.communityDetails.communityName} •{" "}
                      {reply.repliedBy.city} •{" "}
                      {`Posted ${calculateTime(reply.createdAt)}`} • 🌍
                    </div>
                  </div>
                </div>
                <p className="ml-11 text-sm">{reply.text}</p>
                <div className="flex items-center space-x-4 ml-11">
                  <Button size="small"
                    onClick={() =>
                      reply.likes.includes(user._id)
                        ? handleReplyLike(post._id, comment._id, reply._id)
                        : handleReplyLike(post._id, comment._id, reply._id)
                    }
                  >
                    {reply.likes.includes(user._id) ? (<span style={{color:"red"}}><b>Like</b></span>) : (<span><b>Like</b></span>)}
                  </Button>
                  <img
                      src={reply.likes.includes(user._id) ? like : unlike}
                      alt="like/unlike"
                      className="h-5 w-5"
                  />
                  <span>{reply.likes.length===0?"":reply.likes.length}</span>
                </div>
              </div>
            ))}
            {replyingToCommentId === comment._id && (
              <div className="mt-4 flex items-center ml-11 w-74">
                <img 
                  src={user?.image} 
                  className="w-8 h-8 rounded-full mr-3" 
                  alt="User Avatar"
                />
                <form className="flex w-full items-center" onSubmit={(e) => handleReplySubmit(e, comment._id)}>
                  <input 
                    type="text" 
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Add a reply..."
                    className="w-full border rounded-2xl p-2 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-700" 
                  />
                  <Button 
                    type="submit"
                    variant="contained" 
                    color="success" 
                    sx={{ borderRadius: '18px', marginLeft: '8px' }}
                  >
                    Reply
                  </Button>
                </form>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center">
        <img 
          src={user?.image} 
          className="w-8 h-8 rounded-full mr-3" 
          alt="User Avatar"
        />
        <form className="flex w-full items-center" onSubmit={handleSubmit}>
          <input 
            type="text" 
            placeholder="Add a comment..." 
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="w-full border rounded-2xl p-2 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-700" 
          />
          <Button 
            type="submit"
            variant="contained" 
            color="success" 
            sx={{ borderRadius: '18px', marginLeft: '8px' }}
          >
            Comment
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CommentsSection;
