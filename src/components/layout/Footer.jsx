import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto flex-shrink-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6 sm:py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-500 text-center md:text-left">
              © 2024 Finance Tracker v2.0. All rights reserved.
            </div>
            <div className="flex flex-wrap justify-center md:justify-end space-x-6 gap-y-2">
              <Link
                to="/transactions"
                className="text-sm text-gray-500 hover:text-green-600 transition-colors"
              >
                Transactions
              </Link>
              <Link
                to="/budgets"
                className="text-sm text-gray-500 hover:text-green-600 transition-colors"
              >
                Budgets
              </Link>
              <Link
                to="/reports"
                className="text-sm text-gray-500 hover:text-green-600 transition-colors"
              >
                Reports
              </Link>
              <Link
                to="/settings"
                className="text-sm text-gray-500 hover:text-green-600 transition-colors"
              >
                Settings
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
