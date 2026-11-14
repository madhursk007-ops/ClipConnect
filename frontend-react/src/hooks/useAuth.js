import { useEffect, useState } from 'react';
import { useAuthStore } from '@store';
import api from '@services/api';

export const useAuth = () => {
  const { user, token, isAuthenticated, isLoading, login, logout, setLoading, updateUser } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('auth-storage');
      
      if (storedToken) {
        try {
          const response = await api.get('/auth/me');
          if (response.data.success) {
            updateUser(response.data.data.user);
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          logout();
        }
      }
      
      setLoading(false);
    };

    initAuth();
  }, []);

  const signIn = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      
      if (response.data.success) {
        const { user, token, refreshToken } = response.data.data;
        login(user, token);
        if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
        return { success: true };
      }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const signUp = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      
      if (response.data.success) {
        const { user, token, refreshToken } = response.data.data;
        login(user, token);
        if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
        return { success: true };
      }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const signOut = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout request failed:', error);
    } finally {
      localStorage.removeItem('refreshToken');
      logout();
    }
  };

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    signIn,
    signUp,
    signOut,
  };
};

export default useAuth;
