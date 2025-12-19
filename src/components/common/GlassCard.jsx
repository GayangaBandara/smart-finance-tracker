import React from 'react';

const GlassCard = ({ title, icon, children, className = '' }) => {
  return (
    <div
      className={`rounded-2xl p-4 shadow-lg border bg-white/5 backdrop-blur-sm border-gray-200/10 ${className}`}
      role="region"
      aria-label={title}
    >
      {title && (
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm text-gray-400 font-semibold">{title}</h3>
          {icon && <div className="text-gray-300">{icon}</div>}
        </div>
      )}
      <div>{children}</div>
    </div>
  );
};

export default GlassCard;
