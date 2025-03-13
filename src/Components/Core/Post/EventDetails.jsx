import { FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";

export default function EventDetails({ post }) {
  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

  return (
    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
      <div className="flex items-center space-x-2 mb-2">
        <FaCalendarAlt className="text-blue-600" />
        <span className="font-medium">
          {formatDate(post.startDate)} - {formatDate(post.endDate)}
        </span>
      </div>
      <div className="flex items-center space-x-2">
        <FaMapMarkerAlt className="text-blue-600" />
        <span>{post.venue}, {post.location}</span>
      </div>
      {post.hostedBy && (
        <p className="mt-2 text-sm text-gray-600">
          Hosted by: {post.hostedBy}
        </p>
      )}
    </div>
  );
}