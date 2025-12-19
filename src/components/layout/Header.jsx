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
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            {/* Mobile menu button */}
            <button
              type="button"
              onClick={onToggleSidebar}
              className="mr-3 inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 md:hidden"
              aria-controls="main-menu"
              aria-expanded="false"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>

            <img src="/logo.png" alt="Finance Tracker Logo" className="h-8 w-auto" />
          </div>

          <div className="flex items-center space-x-4">
            {user && (
              <>
                <div className="flex items-center space-x-2">
                  <User size={20} className="text-gray-500" />
                  <span className="text-sm text-gray-700">{user.email}</span>
                </div>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
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
