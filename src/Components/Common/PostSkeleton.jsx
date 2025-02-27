import React from "react";

const PostSkeleton = ({ count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="bg-white rounded-xl shadow-sm p-6 mb-6 animate-pulse">
          {/* Header Skeleton */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          </div>

          {/* Content Skeleton */}
          <div className="mt-4 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
            <div className="h-4 bg-gray-200 rounded w-4/6" />
          </div>

          {/* Media Skeleton */}
          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="aspect-square bg-gray-200 rounded-lg" />
            <div className="aspect-square bg-gray-200 rounded-lg" />
          </div>

          {/* Actions Skeleton */}
          <div className="mt-4 flex space-x-4">
            <div className="h-8 bg-gray-200 rounded-full w-20" />
            <div className="h-8 bg-gray-200 rounded-full w-20" />
            <div className="h-8 bg-gray-200 rounded-full w-20" />
          </div>
        </div>
      ))}
    </>
  );
};

export default PostSkeleton;