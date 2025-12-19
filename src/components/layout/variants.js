export const drawerVariants = {
  hidden: { x: '100%', opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } },
  exit: { x: '100%', opacity: 0, transition: { type: 'tween', duration: 0.18 } },
};

export const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.18 } },
  exit: { opacity: 0, transition: { duration: 0.12 } },
};

export const sidebarItemVariants = {
  hidden: { opacity: 0, x: 8 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.18 } },
};

// 1. Page Transitions (Smoothly fade between pages)
export const pageVariants = {
  initial: { opacity: 0, x: -10 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, x: 10, transition: { duration: 0.2 } },
};

// 2. Staggered Container (For Dashboard/Lists)
// This orchestrates the children to appear one-by-one
export const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Delay between each item showing
      delayChildren: 0.1,
    },
  },
};

// 3. Items (Cards, List Items)
export const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 50, damping: 20 },
  },
};

// 4. Micro-interactions (Hover effects)
export const cardHover = {
  hover: {
    y: -5,
    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    transition: { duration: 0.2 },
  },
  tap: { scale: 0.98 },
};

// Combined for GlassCard
export const glassCardVariants = {
  ...fadeInUp,
  ...cardHover,
};
