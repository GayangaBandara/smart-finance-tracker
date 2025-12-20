import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  User,
  Shield,
  Bell,
  Download,
  Trash2,
  Palette,
  LogOut,
  Eye,
  EyeOff,
  Save,
  AlertTriangle,
  CheckCircle,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useFinance } from '../context/FinanceContext';
import { useTheme } from '../context/ThemeContext';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';
import authService from '../services/auth.js';

// Validation schemas
const profileSchema = yup.object({
  displayName: yup
    .string()
    .required('Display name is required')
    .min(2, 'Display name must be at least 2 characters'),
  email: yup.string().email('Invalid email address').required('Email is required'),
});

const passwordSchema = yup.object({
  currentPassword: yup.string().required('Current password is required'),
  newPassword: yup
    .string()
    .required('New password is required')
    .min(6, 'Password must be at least 6 characters'),
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('newPassword')], 'Passwords must match'),
});

const Settings = () => {
  const { user, logout } = useAuth();
  const { transactions, budgets } = useFinance();
  const { theme, systemTheme, highContrast, updateTheme, updateHighContrast } = useTheme();
  const [activeSection, setActiveSection] = useState('profile');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [notification, setNotification] = useState(null);

  // Profile form
  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors, isSubmitting: profileSubmitting },
    reset: resetProfile,
  } = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      displayName: user?.user_metadata?.displayName || '',
      email: user?.email || '',
    },
  });

  // Password form
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors, isSubmitting: passwordSubmitting },
    reset: resetPassword,
  } = useForm({
    resolver: yupResolver(passwordSchema),
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Notification preferences
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    budgetAlerts: true,
    monthlyReports: false,
    transactionReminders: true,
  });

  // Appearance settings
  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: theme,
    compactMode: false,
    currency: 'USD',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
    language: 'en',
    numberFormat: 'US',
    transactionDisplay: 'detailed',
    chartStyle: 'modern',
    showTooltips: true,
    animations: true,
    highContrast: highContrast,
  });

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleProfileUpdate = async (data) => {
    try {
      // Update email and display name via authService
      const { success } = await authService.updateUserProfile({
        email: data.email,
        displayName: data.displayName,
      });
      if (success) {
        resetProfile({ displayName: data.displayName, email: data.email });
        showNotification('success', 'Profile updated successfully');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      showNotification('error', error.message || 'Failed to update profile');
    }
  };

  const handlePasswordChange = async (data) => {
    try {
      await authService.changePassword(data.newPassword);
      resetPassword();
      showNotification('success', 'Password changed successfully');
    } catch (error) {
      console.error('Error changing password:', error);
      showNotification('error', error.message || 'Failed to change password');
    }
  };

  const handleExportData = () => {
    const data = {
      transactions,
      budgets,
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `finance-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showNotification('success', 'Data exported successfully');
  };

  const handleClearData = async () => {
    try {
      const confirmed = window.confirm(
        'Are you sure you want to permanently delete all your transactions, budgets, and expenses? This cannot be undone.'
      );
      if (!confirmed) return;
      await authService.deleteUserData();
      showNotification('success', 'All data cleared successfully');
    } catch (error) {
      console.error('Error clearing data:', error);
      showNotification('error', error.message || 'Failed to clear data');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const confirmed = window.confirm(
        'Delete your account and ALL data? This is irreversible. Are you sure?'
      );
      if (!confirmed) return;

      // First remove all user data via RPC, then sign the user out.
      await authService.deleteUserData();
      await logout();

      showNotification(
        'success',
        'Account data deleted. Your authentication record must be removed by an admin if desired.'
      );
    } catch (error) {
      console.error('Error deleting account:', error);
      showNotification('error', error.message || 'Failed to delete account');
    }
  };

  const sections = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'data', label: 'Data Management', icon: Download },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'account', label: 'Account', icon: LogOut },
  ];

  const renderProfileSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Profile Information</h3>
        <form onSubmit={handleSubmitProfile(handleProfileUpdate)} className="space-y-5">
          <Input
            label="Display Name"
            type="text"
            {...registerProfile('displayName')}
            error={profileErrors.displayName?.message}
            required
          />
          <Input
            label="Email Address"
            type="email"
            {...registerProfile('email')}
            error={profileErrors.email?.message}
            required
          />
          <Button type="submit" disabled={profileSubmitting}>
            {profileSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </div>
    </div>
  );

  const renderSecuritySection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
        <form onSubmit={handleSubmitPassword(handlePasswordChange)} className="space-y-5">
          <div className="relative">
            <Input
              label="Current Password"
              type={showPasswords.current ? 'text' : 'password'}
              {...registerPassword('currentPassword')}
              error={passwordErrors.currentPassword?.message}
              required
            />
            <button
              type="button"
              className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
              onClick={() => setShowPasswords((prev) => ({ ...prev, current: !prev.current }))}
            >
              {showPasswords.current ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="relative">
            <Input
              label="New Password"
              type={showPasswords.new ? 'text' : 'password'}
              {...registerPassword('newPassword')}
              error={passwordErrors.newPassword?.message}
              required
            />
            <button
              type="button"
              className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
              onClick={() => setShowPasswords((prev) => ({ ...prev, new: !prev.new }))}
            >
              {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="relative">
            <Input
              label="Confirm New Password"
              type={showPasswords.confirm ? 'text' : 'password'}
              {...registerPassword('confirmPassword')}
              error={passwordErrors.confirmPassword?.message}
              required
            />
            <button
              type="button"
              className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
              onClick={() => setShowPasswords((prev) => ({ ...prev, confirm: !prev.confirm }))}
            >
              {showPasswords.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <Button type="submit" disabled={passwordSubmitting}>
            {passwordSubmitting ? 'Changing...' : 'Change Password'}
          </Button>
        </form>
      </div>
    </div>
  );

  const renderNotificationsSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Preferences</h3>
        <div className="space-y-4">
          {Object.entries({
            emailNotifications: 'Email Notifications',
            budgetAlerts: 'Budget Alerts',
            monthlyReports: 'Monthly Reports',
            transactionReminders: 'Transaction Reminders',
          }).map(([key, label]) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">{label}</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notificationSettings[key]}
                  onChange={(e) =>
                    setNotificationSettings((prev) => ({ ...prev, [key]: e.target.checked }))
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderDataSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Data Management</h3>
        <div className="space-y-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Export Data</h4>
            <p className="text-sm text-gray-600 mb-3">
              Download all your financial data including transactions and budgets as a JSON file.
            </p>
            <Button onClick={handleExportData} variant="outline">
              <Download size={16} className="mr-2" />
              Export Data
            </Button>
          </div>

          <div className="border border-red-200 rounded-lg p-4">
            <h4 className="font-medium text-red-900 mb-2">Clear All Data</h4>
            <p className="text-sm text-red-600 mb-3">
              Permanently delete all your transactions and budgets. This action cannot be undone.
            </p>
            <Button onClick={handleClearData} variant="danger">
              <Trash2 size={16} className="mr-2" />
              Clear All Data
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAppearanceSection = () => (
    <div className="space-y-8">
      {/* Visual Theme */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Visual Theme</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
            <select
              value={appearanceSettings.theme}
              onChange={(e) => {
                const newTheme = e.target.value;
                setAppearanceSettings((prev) => ({ ...prev, theme: newTheme }));
                updateTheme(newTheme);
                showNotification('success', `Theme changed to ${newTheme}`);
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System</option>
              <option value="sepia">Sepia</option>
              <option value="blue">Blue</option>
              <option value="green">Green</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Chart Style</label>
            <select
              value={appearanceSettings.chartStyle}
              onChange={(e) =>
                setAppearanceSettings((prev) => ({ ...prev, chartStyle: e.target.value }))
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
            >
              <option value="modern">Modern</option>
              <option value="classic">Classic</option>
              <option value="minimal">Minimal</option>
              <option value="colorful">Colorful</option>
            </select>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">High Contrast</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={appearanceSettings.highContrast}
                onChange={(e) => {
                  const newValue = e.target.checked;
                  setAppearanceSettings((prev) => ({ ...prev, highContrast: newValue }));
                  updateHighContrast(newValue);
                  showNotification('success', `High contrast ${newValue ? 'enabled' : 'disabled'}`);
                }}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Animations</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={appearanceSettings.animations}
                onChange={(e) =>
                  setAppearanceSettings((prev) => ({ ...prev, animations: e.target.checked }))
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Regional Settings */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Regional Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
            <select
              value={appearanceSettings.currency}
              onChange={(e) =>
                setAppearanceSettings((prev) => ({ ...prev, currency: e.target.value }))
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="JPY">JPY (¥)</option>
              <option value="CAD">CAD ($)</option>
              <option value="AUD">AUD ($)</option>
              <option value="CHF">CHF (Fr)</option>
              <option value="CNY">CNY (¥)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
            <select
              value={appearanceSettings.language}
              onChange={(e) =>
                setAppearanceSettings((prev) => ({ ...prev, language: e.target.value }))
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
              <option value="it">Italiano</option>
              <option value="pt">Português</option>
              <option value="zh">中文</option>
              <option value="ja">日本語</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
            <select
              value={appearanceSettings.dateFormat}
              onChange={(e) =>
                setAppearanceSettings((prev) => ({ ...prev, dateFormat: e.target.value }))
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
            >
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              <option value="DD-MM-YYYY">DD-MM-YYYY</option>
              <option value="MMM DD, YYYY">MMM DD, YYYY</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Time Format</label>
            <select
              value={appearanceSettings.timeFormat}
              onChange={(e) =>
                setAppearanceSettings((prev) => ({ ...prev, timeFormat: e.target.value }))
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
            >
              <option value="12h">12-hour (AM/PM)</option>
              <option value="24h">24-hour</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Number Format</label>
            <select
              value={appearanceSettings.numberFormat}
              onChange={(e) =>
                setAppearanceSettings((prev) => ({ ...prev, numberFormat: e.target.value }))
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
            >
              <option value="US">1,234.56</option>
              <option value="EU">1.234,56</option>
              <option value="IN">1,23,456.78</option>
              <option value="FR">1 234,56</option>
            </select>
          </div>
        </div>
      </div>

      {/* Interface Preferences */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Interface Preferences</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Transaction Display
            </label>
            <select
              value={appearanceSettings.transactionDisplay}
              onChange={(e) =>
                setAppearanceSettings((prev) => ({ ...prev, transactionDisplay: e.target.value }))
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
            >
              <option value="detailed">Detailed View</option>
              <option value="compact">Compact View</option>
              <option value="minimal">Minimal View</option>
              <option value="list">List View</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Compact Mode</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={appearanceSettings.compactMode}
                  onChange={(e) =>
                    setAppearanceSettings((prev) => ({ ...prev, compactMode: e.target.checked }))
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Show Tooltips</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={appearanceSettings.showTooltips}
                  onChange={(e) =>
                    setAppearanceSettings((prev) => ({ ...prev, showTooltips: e.target.checked }))
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Section */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Preview</h3>
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Current Settings Preview:</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Theme:</span>
                <span className="ml-2 font-medium">
                  {appearanceSettings.theme === 'system'
                    ? `System (${systemTheme})`
                    : appearanceSettings.theme}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Currency:</span>
                <span className="ml-2 font-medium">{appearanceSettings.currency}</span>
              </div>
              <div>
                <span className="text-gray-500">Date Format:</span>
                <span className="ml-2 font-medium">{appearanceSettings.dateFormat}</span>
              </div>
              <div>
                <span className="text-gray-500">Time Format:</span>
                <span className="ml-2 font-medium">{appearanceSettings.timeFormat}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAccountSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Account Management</h3>
        <div className="space-y-4">
          <div className="border border-red-200 rounded-lg p-4">
            <h4 className="font-medium text-red-900 mb-2">Delete Account</h4>
            <p className="text-sm text-red-600 mb-3">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
            <Button onClick={() => setShowDeleteConfirm(true)} variant="danger">
              <Trash2 size={16} className="mr-2" />
              Delete Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return renderProfileSection();
      case 'security':
        return renderSecuritySection();
      case 'notifications':
        return renderNotificationsSection();
      case 'data':
        return renderDataSection();
      case 'appearance':
        return renderAppearanceSection();
      case 'account':
        return renderAccountSection();
      default:
        return renderProfileSection();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your account preferences and settings</p>
      </div>

      {/* Notification */}
      {notification && (
        <div
          className={`flex items-center justify-between p-4 rounded-lg ${
            notification.type === 'success'
              ? 'bg-green-50 text-green-800'
              : 'bg-red-50 text-red-800'
          }`}
        >
          <div className="flex items-center">
            {notification.type === 'success' ? (
              <CheckCircle size={20} className="mr-2" />
            ) : (
              <AlertTriangle size={20} className="mr-2" />
            )}
            {notification.message}
          </div>
          <button onClick={() => setNotification(null)}>
            <X size={20} />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <nav className="space-y-1">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeSection === section.id
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon size={18} className="mr-3" />
                  {section.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {renderContent()}
          </div>
        </div>
      </div>

      {/* Delete Account Modal */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Delete Account"
      >
        <div className="space-y-4">
          <div className="flex items-center text-red-600 mb-4">
            <AlertTriangle size={20} className="mr-2" />
            <span className="font-medium">This action cannot be undone</span>
          </div>
          <p className="text-gray-600">
            Are you sure you want to delete your account? This will permanently remove all your data
            including transactions, budgets, and account information.
          </p>
          <div className="flex justify-end space-x-4 pt-4">
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteAccount}>
              Delete Account
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Settings;
