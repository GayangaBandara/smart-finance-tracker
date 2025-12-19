import React from 'react';
import { motion } from 'framer-motion';
import { glassCardVariants } from '../layout/variants';

const GlassCard = ({ title, icon, children, className = '', variant = 'default' }) => {
  const variants = {
    default: 'glass-card hover-lift interactive-card',
    metric: 'metric-card hover-lift hover-glow',
    elevated: 'glass-intense hover-lift',
    subtle: 'glass hover-lift',
  };

  return (
    <motion.div
      variants={glassCardVariants}
      initial="hidden"
      animate="show"
      whileHover="hover"
      whileTap="tap"
      className={`relative overflow-hidden rounded-2xl p-6 ${variants[variant]} ${className}`}
    >
      {/* Enhanced Decorative Elements */}
      <div className="absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-br from-indigo-500/15 via-purple-500/10 to-pink-500/15 blur-2xl rounded-full pointer-events-none" />
      <div className="absolute top-4 left-4 w-16 h-16 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 blur-xl rounded-full pointer-events-none" />

      {/* Subtle border glow */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

      {title && (
        <div className="flex items-center justify-between mb-4 relative z-10">
          <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wider">{title}</h3>
          {icon && (
            <div className="text-gray-500 p-2 rounded-lg bg-white/5 backdrop-blur-sm">{icon}</div>
          )}
        </div>
      )}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};

export default GlassCard;
