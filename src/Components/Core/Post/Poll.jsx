import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { voteOnPoll } from "../../../services/operations/postApi";
import { updatePoll } from "../../../slices/postSlice";

const Poll = ({ post, user }) => {
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const totalVotes = post.pollOptions.reduce((sum, o) => sum + (o.votes?.length || 0), 0);

  const userVoteIndex = post.pollOptions.findIndex(option =>
    option.votes?.some(v => v._id === user._id)
  );

  const handleVote = async (index) => {
    const res = await voteOnPoll(post._id, index, token);
    if (res?.success) {
      dispatch(updatePoll({ postId: post._id, updatedPoll: res.updatedPoll }));
    }
  };

  return (
    <div className="mt-4 space-y-2">
      {post.pollOptions.map((opt, index) => {
        const percentage = totalVotes ? Math.round((opt.votes.length / totalVotes) * 100) : 0;
        const isSelected = userVoteIndex === index;

        return (
          <div
            key={index}
            className={`p-2 rounded-md border cursor-pointer ${isSelected ? "bg-blue-100" : "hover:bg-gray-50"}`}
            onClick={() => handleVote(index)}
          >
            <div className="flex justify-between">
              <span>{opt.option}</span>
              <span className="text-sm text-gray-500">{percentage}%</span>
            </div>
            <div className="w-full bg-gray-200 h-2 rounded-full mt-1">
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Poll;
