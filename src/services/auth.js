import { supabase } from '../lib/supabaseClient';

// Authentication service functions using Supabase
export const authService = {
  register: async (email, password, displayName = '') => {
    try {
      const { data, error } = await supabase.auth.signUp(
        { email, password },
        { data: { displayName } }
      );
      if (error) throw error;
      return { user: data.user, success: true };
    } catch (err) {
      throw new Error(err.message || 'Registration failed');
    }
  },

  login: async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return { user: data.user, success: true };
    } catch (err) {
      throw new Error(err.message || 'Login failed');
    }
  },

  logout: async () => {
    try {
      await supabase.auth.signOut();
      return { success: true };
    } catch (err) {
      throw new Error('Failed to sign out');
    }
  },

  resetPassword: async (email, redirectTo) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
      if (error) throw error;
      return { success: true, data };
    } catch (err) {
      throw new Error(err.message || 'Failed to request password reset');
    }
  },

  getCurrentUser: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data?.user || null;
  },

  // Listen to auth state changes
  onAuthStateChange: (callback) => {
    const { data: subscription } = supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });
    return subscription;
  },

  updateUserProfile: async (updates) => {
    try {
      const { data, error } = await supabase.auth.updateUser({ data: updates });
      if (error) throw error;
      return { success: true, user: data.user };
    } catch (err) {
      throw new Error(err.message || 'Failed to update profile');
    }
  },
};

// Basic validation helpers
export const validation = {
  isValidEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  isValidPassword: (password) => password && password.length >= 6,

  isValidDisplayName: (name) => name && name.trim().length >= 2,
};

export default authService;
