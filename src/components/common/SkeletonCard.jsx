import React from 'react';

const SkeletonCard = ({ lines = 3, className = '' }) => {
  return (
    <div className={`rounded-2xl p-4 bg-gray-100/30 animate-pulse ${className}`}>
      <div className="h-4 bg-gray-300 rounded w-3/4 mb-3" />
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="h-6 bg-gray-300 rounded mb-2" />
      ))}
    </div>
  );
};

export default SkeletonCard;
