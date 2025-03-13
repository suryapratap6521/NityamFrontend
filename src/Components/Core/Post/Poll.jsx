import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { voteOnPoll, fetchVoters } from '../../../services/operations/postApi';
import { updatePoll } from '../../../slices/postSlice';
import Modal from '../../Common/Modal';
import UserAvatar from './UserAvatar';

export default function Poll({ post, user }) {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const [selectedOption, setSelectedOption] = useState(null);
  const [error, setError] = useState(null);
  const [viewingVoters, setViewingVoters] = useState(null);
  const [voters, setVoters] = useState([]);
  const [loadingVoters, setLoadingVoters] = useState(false);

  const totalVotes = post.pollOptions?.reduce((sum, option) => sum + (option.votes?.length || 0), 0) || 0;
  const userVoteIndex = post.pollOptions?.findIndex(option =>
    option.votes?.some(v => v._id === user?._id)
  ) ?? -1;

  const calculatePercentage = (votes) => {
    if (totalVotes === 0) return 0;
    return Math.round((votes / totalVotes) * 100);
  };

  const handleVote = async (optionIndex) => {
    if (!user?._id) return;

    try {
      setError(null);
      setSelectedOption(optionIndex);

      const response = await voteOnPoll(post._id, optionIndex, token);

      if (response?.success) {
        dispatch(updatePoll({
          postId: post._id,
          updatedPoll: response.updatedPoll
        }));
      }
    } catch (error) {
      setError(error.message || 'Failed to update vote');
      setSelectedOption(null);
    }
  };

  const showVoters = async (optionIndex) => {
    try {
      setLoadingVoters(true);
      const response = await fetchVoters(post._id, optionIndex, token);
      if (response.success) {
        setVoters(response.voters);
        setViewingVoters(optionIndex);
      }
    } catch (error) {
      setError(error.message || 'Failed to load voters');
    } finally {
      setLoadingVoters(false);
    }
  };

  return (
    <div className="mt-4 space-y-3">
      {error && <div className="text-red-500 text-sm">{error}</div>}

      {post.pollOptions?.map((option, index) => {
        const votesCount = option.votes?.length || 0;
        const percentage = calculatePercentage(votesCount);
        const isUserVote = userVoteIndex === index;

        return (
          <div
            key={index}
            className={`relative p-3 rounded-lg transition-all ${isUserVote
                ? 'bg-blue-50 border-2 border-blue-200'
                : 'hover:bg-gray-50 cursor-pointer border-2 border-transparent'
              }`}
            onClick={() => handleVote(index)}
          >
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center space-x-2">
                <span className="font-medium">{option.option}</span>
                {isUserVote && (
                  <span className="text-blue-500 text-sm">✓ Your vote</span>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  {percentage}%
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    showVoters(index);
                  }}
                  className={`text-xs ${votesCount > 0
                      ? 'text-blue-600 hover:text-blue-800 cursor-pointer'
                      : 'text-gray-400 cursor-default'
                    }`}
                  disabled={votesCount === 0}
                >
                  {votesCount === 1 ? `${votesCount} vote` : `${votesCount} votes`}
                </button>
              </div>
            </div>

            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all duration-500"
                style={{ width: `${percentage}%` }}
              />
            </div>

            {selectedOption === index && (
              <div className="absolute inset-0 bg-gray-100 opacity-50 animate-pulse rounded-lg" />
            )}
          </div>
        );
      })}

      <Modal
        show={viewingVoters !== null}
        onClose={() => setViewingVoters(null)}
        title={`Voters for "${post.pollOptions[viewingVoters]?.option}"`}
      >
        <div className="max-h-96 overflow-y-auto">
          {loadingVoters ? (
            <div className="text-center py-4">Loading voters...</div>
          ) : voters.length === 0 ? (
            <div className="text-gray-500 text-center py-4">No voters yet</div>
          ) : (
            voters.map((voter, index) => (
              <div key={index} className="flex items-center space-x-3 p-2 hover:bg-gray-50">
                <UserAvatar
                  user={voter}
                  className="h-8 w-8"
                />
                <span>
                  {voter.firstName} {voter.lastName}
                </span>
              </div>
            ))
          )}
        </div>
      </Modal>
    </div>
  );
}