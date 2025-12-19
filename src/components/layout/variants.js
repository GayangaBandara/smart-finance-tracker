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
