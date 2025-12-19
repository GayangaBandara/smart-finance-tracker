import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, User, Menu } from 'lucide-react';
import Button from '../common/Button';

const Header = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="glass-card border-b border-white/20 sticky top-0 z-20 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            {/* Mobile menu button */}
            <button
              type="button"
              onClick={onToggleSidebar}
              className="mr-3 inline-flex items-center justify-center p-2 rounded-xl text-gray-600 hover:bg-white/10 hover:text-gray-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 transition-all duration-300 md:hidden"
              aria-controls="main-menu"
              aria-expanded="false"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>

            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl">
                <img
                  src="/logo.png"
                  alt="Finance Tracker Logo"
                  className="h-6 w-auto filter brightness-0 invert"
                />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-800">Finance Tracker</h1>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3 sm:space-x-4">
            {user && (
              <>
                <div className="hidden sm:flex items-center space-x-3 px-4 py-2 bg-white/10 rounded-xl backdrop-blur-sm">
                  <div className="p-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full">
                    <User size={16} className="text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{user.email}</span>
                </div>
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-2 px-3 sm:px-4"
                  leftIcon={<LogOut size={16} />}
                >
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
