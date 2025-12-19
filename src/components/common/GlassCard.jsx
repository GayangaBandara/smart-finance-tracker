import React from 'react';
import { motion } from 'framer-motion';
import { glassCardVariants } from '../layout/variants';

const GlassCard = ({ title, icon, children, className = '' }) => {
  return (
    <motion.div
      variants={glassCardVariants}
      initial="hidden"
      animate="show"
      whileHover="hover"
      whileTap="tap"
      className={`relative overflow-hidden rounded-2xl p-4 border bg-white/10 backdrop-blur-md border-white/20 shadow-sm ${className}`}
    >
      {/* Decorative Gradient Blob for "Premium" feel */}
      <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 blur-2xl rounded-full pointer-events-none" />

      {title && (
        <div className="flex items-center justify-between mb-3 relative z-10">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{title}</h3>
          {icon && <div className="text-gray-400">{icon}</div>}
        </div>
      )}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};

export default GlassCard;
