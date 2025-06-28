import React, { useState } from "react";
import { Button } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import like from "../../../assests/like.png";
import unlike from "../../../assests/unlike.png";
import { calculateTime } from "../../../utils/miliToHours";

const CommentsSection = ({
  post,
  handleComment,
  handleReply,
  handleCommentLike,
  handleReplyLike,
  user,
  commentText,
  setCommentText,
  replyText,
  setReplyText,
}) => {
  const [replyingTo, setReplyingTo] = useState(null);
  const [showAll, setShowAll] = useState(false);

  const comments = post.comments || [];

const onSubmitComment = (e) => {
  e.preventDefault();
  if (commentText.trim()) {
    handleComment(commentText);  // ✅ send only text
    setCommentText("");
  }
};


  const onSubmitReply = (e, commentId) => {
    e.preventDefault();
    if (replyText.trim()) {
      handleReply(post._id, commentId, replyText);
      setReplyText("");
      setReplyingTo(null);
    }
  };

  return (
    <div className="p-2">
      {comments.length > 1 && !showAll && (
        <button className="text-blue-600" onClick={() => setShowAll(true)}>
          See {comments.length - 1} more comments
        </button>
      )}
      {(showAll ? comments : comments.slice(-1)).map((comment) => (
        <div key={comment._id} className="mb-4">
          <div className="flex gap-2 items-start">
            <img
              src={comment.commentedBy?.image}
              className="h-8 w-8 rounded-full"
              alt="avatar"
            />
            <div>
              <p className="font-medium">
                {comment.commentedBy?.firstName} {comment.commentedBy?.lastName}
              </p>
              <p className="text-sm text-gray-700">{comment.text}</p>
              <div className="text-xs text-gray-500">
                {calculateTime(comment.commentedAt)}
              </div>
              <div className="flex gap-4 mt-1">
                <Button
                  size="small"
                  onClick={() => handleCommentLike(comment._id)}
                >
                  {comment.likes?.includes(user._id) ? (
                    <span style={{ color: "red" }}>Like</span>
                  ) : (
                    <span>Like</span>
                  )}
                </Button>
                <Button
                  size="small"
                  onClick={() => setReplyingTo(comment._id)}
                >
                  Reply
                </Button>
                <img
                  src={comment.likes?.includes(user._id) ? like : unlike}
                  alt="like"
                  className="w-5 h-5"
                />
                <span>{comment.likes?.length || 0}</span>
              </div>

              {comment.replies?.map((reply) => (
                <div key={reply._id} className="ml-6 mt-2">
                  <div className="flex gap-2 items-start">
                    <img
                      src={reply.repliedBy?.image}
                      className="h-6 w-6 rounded-full"
                      alt="reply avatar"
                    />
                    <div>
                      <p className="font-medium text-sm">
                        {reply.repliedBy?.firstName} {reply.repliedBy?.lastName}
                      </p>
                      <p className="text-sm">{reply.text}</p>
                      <div className="flex gap-2 text-xs text-gray-500">
                        {calculateTime(reply.repliedAt)}
                        <Button
                          size="small"
                          onClick={() =>
                            handleReplyLike(post._id, comment._id, reply._id)
                          }
                        >
                          {reply.likes?.includes(user._id) ? (
                            <span style={{ color: "red" }}>Like</span>
                          ) : (
                            <span>Like</span>
                          )}
                        </Button>
                        <img
                          src={reply.likes?.includes(user._id) ? like : unlike}
                          alt="like"
                          className="w-5 h-5"
                        />
                        <span>{reply.likes?.length || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {replyingTo === comment._id && (
                <form
                  className="mt-2 flex items-center gap-2"
                  onSubmit={(e) => onSubmitReply(e, comment._id)}
                >
                  <input
                    type="text"
                    className="flex-1 p-1 border rounded-lg"
                    placeholder="Write a reply..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                  />
                  <button className="bg-green-500 p-1 rounded-full" type="submit">
                    <SendIcon style={{ color: "white" }} />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      ))}

     <form className="flex items-center gap-2 mt-4" onSubmit={onSubmitComment}>
  <img src={user.image} className="h-8 w-8 rounded-full" alt="User" />
  <input
    type="text"
    className="flex-1 p-2 bg-gray-100 rounded-full border"
    placeholder="Add a comment..."
    value={commentText}
    onChange={(e) => setCommentText(e.target.value)}
  />
  <button className="bg-blue-500 p-2 rounded-full" type="submit">
    <SendIcon style={{ color: "white" }} />
  </button>
</form>
    </div>
  );
};

export default CommentsSection;
