import React, { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BarChart3, CreditCard, PiggyBank, FileText, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { drawerVariants, overlayVariants, sidebarItemVariants } from './variants';

const Sidebar = ({ isOpen = false, onClose = () => {} }) => {
  const location = useLocation();
  const closeBtnRef = useRef(null);

  useEffect(() => {
    if (isOpen && closeBtnRef.current) {
      closeBtnRef.current.focus();
    }
  }, [isOpen]);

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { path: '/transactions', label: 'Transactions', icon: CreditCard },
    { path: '/budgets', label: 'Budgets', icon: PiggyBank },
    { path: '/reports', label: 'Reports', icon: FileText },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  // Desktop / large: static sidebar
  const staticSidebar = (
    <aside className="hidden md:block bg-white shadow-sm border-r border-gray-200 w-64 h-screen sticky top-0">
      <div className="p-6">
        <nav className="space-y-2" aria-label="Main navigation">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 border-r-2 border-indigo-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );

  // Mobile drawer: animated
  const mobileDrawer = (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="overlay"
            className="fixed inset-0 bg-black/40 z-40 md:hidden"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={overlayVariants}
            onClick={onClose}
            aria-hidden
          />

          <motion.aside
            key="drawer"
            className="fixed right-0 top-0 bottom-0 w-80 bg-white z-50 shadow-lg p-4 md:hidden"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={drawerVariants}
            role="dialog"
            aria-modal="true"
            aria-label="Main menu"
            onKeyDown={(e) => {
              if (e.key === 'Escape') onClose();
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Menu</h2>
              <button
                ref={closeBtnRef}
                onClick={onClose}
                className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>

            <nav className="space-y-2" aria-label="Main navigation">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <motion.div
                    key={item.path}
                    variants={sidebarItemVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <Link
                      to={item.path}
                      onClick={onClose}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-indigo-50 text-indigo-700 border-r-2 border-indigo-700'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <Icon size={20} />
                      <span>{item.label}</span>
                    </Link>
                  </motion.div>
                );
              })}
            </nav>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <>
      {staticSidebar}
      {mobileDrawer}
    </>
  );
};

export default Sidebar;
