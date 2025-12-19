import React from 'react';

const SkeletonCard = ({ lines = 3, className = '', variant = 'default' }) => {
  const variants = {
    default: (
      <div className={`glass-card p-6 animate-pulse ${className}`}>
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="skeleton w-12 h-12 rounded-xl"></div>
            <div className="space-y-3 flex-1">
              <div className="skeleton h-4 rounded-lg w-3/4"></div>
              <div className="skeleton h-3 rounded-lg w-1/2"></div>
            </div>
          </div>
          <div className="space-y-3">
            {Array.from({ length: lines }).map((_, i) => (
              <div key={i} className="skeleton h-4 rounded-lg w-5/6"></div>
            ))}
          </div>
        </div>
      </div>
    ),
    metric: (
      <div className={`metric-card p-6 animate-pulse ${className}`}>
        <div className="flex items-center justify-between">
          <div className="space-y-3">
            <div className="skeleton h-3 rounded-lg w-24"></div>
            <div className="skeleton h-8 rounded-lg w-32"></div>
          </div>
          <div className="skeleton w-12 h-12 rounded-xl"></div>
        </div>
      </div>
    ),
    chart: (
      <div className={`chart-container p-6 animate-pulse ${className}`}>
        <div className="mb-6">
          <div className="skeleton h-6 rounded-lg w-48 mb-2"></div>
          <div className="skeleton h-4 rounded-lg w-24"></div>
        </div>
        <div className="skeleton h-80 rounded-2xl"></div>
      </div>
    ),
    form: (
      <div className={`glass-card p-8 animate-pulse ${className}`}>
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="skeleton h-5 rounded-lg w-32"></div>
            <div className="skeleton h-12 rounded-xl w-full"></div>
          </div>
          <div className="space-y-2">
            <div className="skeleton h-5 rounded-lg w-24"></div>
            <div className="skeleton h-12 rounded-xl w-full"></div>
          </div>
          <div className="space-y-2">
            <div className="skeleton h-5 rounded-lg w-20"></div>
            <div className="skeleton h-12 rounded-xl w-full"></div>
          </div>
          <div className="skeleton h-12 rounded-xl w-full"></div>
        </div>
      </div>
    ),
    list: (
      <div className={`space-y-4 ${className}`}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass-card p-4 animate-pulse">
            <div className="flex items-center space-x-4">
              <div className="skeleton w-10 h-10 rounded-lg"></div>
              <div className="flex-1 space-y-2">
                <div className="skeleton h-4 rounded-lg w-3/4"></div>
                <div className="skeleton h-3 rounded-lg w-1/2"></div>
              </div>
              <div className="skeleton h-4 rounded-lg w-16"></div>
            </div>
          </div>
        ))}
      </div>
    ),
  };

  return variants[variant] || variants.default;
};

export default SkeletonCard;
