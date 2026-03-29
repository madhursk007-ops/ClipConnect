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
        const { user, token } = response.data.data;
        login(user, token);
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
        const { user, token } = response.data.data;
        login(user, token);
        return { success: true };
      }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const signOut = () => {
    logout();
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

export const useStats = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    editors: 0,
    clients: 0,
    totalProjects: 0,
    completedProjects: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/stats');
        if (response.data.success) {
          setStats(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  return { stats, loading };
};

export const useSocketRealtime = () => {
  const [connected, setConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(0);

  useEffect(() => {
    if (typeof io === 'undefined') return;

    const socket = io('http://localhost:5000', {
      transports: ['websocket', 'polling'],
    });

    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));
    socket.on('users:online', (count) => setOnlineUsers(count));

    return () => socket.disconnect();
  }, []);

  return { connected, onlineUsers };
};
