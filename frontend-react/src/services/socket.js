import { io } from 'socket.io-client';
import { useEffect, useState, useCallback } from 'react';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
  }

  connect(userId = null) {
    if (this.socket) return;

    const options = {
      transports: ['websocket', 'polling'],
      withCredentials: true,
    };

    if (userId) {
      options.query = { userId };
    }

    this.socket = io(SOCKET_URL, options);

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket.id);
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.listeners.clear();
    }
  }

  on(event, callback) {
    if (!this.socket) return;

    this.socket.on(event, callback);
    this.listeners.set(event, callback);
  }

  off(event) {
    if (!this.socket) return;

    const callback = this.listeners.get(event);
    if (callback) {
      this.socket.off(event, callback);
      this.listeners.delete(event);
    }
  }

  emit(event, data) {
    if (!this.socket) return;
    this.socket.emit(event, data);
  }

  subscribeToActivityFeed() {
    if (!this.socket) return;
    this.socket.emit('activity:subscribe');
  }
}

// Singleton instance
export const socketService = new SocketService();

// React Hook for using socket
export const useSocket = (userId = null) => {
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(0);

  useEffect(() => {
    socketService.connect(userId);

    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);
    const handleOnlineUsers = (count) => setOnlineUsers(count);

    socketService.on('connect', handleConnect);
    socketService.on('disconnect', handleDisconnect);
    socketService.on('users:online', handleOnlineUsers);

    // Initial connection state
    if (socketService.socket?.connected) {
      setIsConnected(true);
    }

    return () => {
      socketService.off('connect');
      socketService.off('disconnect');
      socketService.off('users:online');
    };
  }, [userId]);

  return { isConnected, onlineUsers, socket: socketService };
};

// Hook for real-time stats
export const useRealtimeStats = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProjects: 0,
    completedProjects: 0
  });
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    socketService.connect();

    const handleStatsUpdate = (newStats) => {
      setStats(newStats);
    };

    const handleInitialStats = (initialStats) => {
      setStats(initialStats);
    };

    const handleNewActivity = (activity) => {
      setActivities(prev => [activity, ...prev].slice(0, 10)); // Keep last 10
    };

    socketService.on('stats:update', handleStatsUpdate);
    socketService.on('stats:initial', handleInitialStats);
    socketService.on('activity:new', handleNewActivity);

    // Subscribe to activity feed
    socketService.subscribeToActivityFeed();

    return () => {
      socketService.off('stats:update');
      socketService.off('stats:initial');
      socketService.off('activity:new');
    };
  }, []);

  return { stats, activities };
};
