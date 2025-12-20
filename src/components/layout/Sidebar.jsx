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
    <aside className="hidden md:block sidebar-bg border-r border-white/20 w-64 h-screen fixed top-16 left-0 z-10">
      <div className="p-6 pb-20">
        <div className="mb-6">
          <h2 className="text-sm font-bold text-gray-600 uppercase tracking-wider">Navigation</h2>
        </div>
        <nav className="space-y-1" aria-label="Main navigation">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item group ${isActive ? 'active' : ''}`}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`p-2 rounded-lg transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                        : 'bg-white/5 text-gray-600 group-hover:bg-white/10 group-hover:text-gray-900'
                    }`}
                  >
                    <Icon size={18} />
                  </div>
                  <span className="font-medium">{item.label}</span>
                </div>
                {isActive && (
                  <div className="ml-auto w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer section - Pinned to bottom */}
        <div className="absolute bottom-6 left-6 right-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-white/10 rounded-full mb-2 overflow-hidden">
              <img src="/logo.png" alt="Finance Tracker Logo" className="w-6 h-6 object-contain" />
            </div>
            <p className="text-xs text-gray-600 font-semibold">Finance Tracker</p>
            <p className="text-xs text-gray-500">v2.0</p>
          </div>
        </div>
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
            className="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-sm"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={overlayVariants}
            onClick={onClose}
            aria-hidden
          />

          <motion.aside
            key="drawer"
            className="fixed right-0 top-0 bottom-0 w-80 sidebar-mobile-bg z-50 shadow-2xl p-6 pb-24 md:hidden"
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
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-800">Menu</h2>
                  <p className="text-xs text-gray-500">Finance Tracker</p>
                </div>
              </div>
              <button
                ref={closeBtnRef}
                onClick={onClose}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors focus:outline-none focus:ring-4 focus:ring-white/30"
                aria-label="Close menu"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <nav className="space-y-2" aria-label="Main navigation">
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <motion.div
                    key={item.path}
                    variants={sidebarItemVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      to={item.path}
                      onClick={onClose}
                      className={`nav-item group ${isActive ? 'active' : ''}`}
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`p-3 rounded-xl transition-all duration-300 ${
                            isActive
                              ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                              : 'bg-white/10 text-gray-600 group-hover:bg-white/20 group-hover:text-gray-900'
                          }`}
                        >
                          <Icon size={20} />
                        </div>
                        <span className="font-semibold">{item.label}</span>
                      </div>
                      {isActive && (
                        <div className="ml-auto">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        </div>
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            {/* Mobile footer - Pinned to bottom */}
            <div className="absolute bottom-6 left-6 right-6">
              <div className="glass rounded-xl p-4 text-center">
                <div className="inline-flex items-center justify-center w-8 h-8 bg-white/20 rounded-full mb-2 overflow-hidden">
                  <img
                    src="/logo.png"
                    alt="Finance Tracker Logo"
                    className="w-5 h-5 object-contain"
                  />
                </div>
                <p className="text-xs text-gray-600 font-semibold">Finance Tracker</p>
                <p className="text-xs text-gray-500">v2.0</p>
              </div>
            </div>
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
