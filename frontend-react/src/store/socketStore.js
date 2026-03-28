import { create } from 'zustand'
import { io } from 'socket.io-client'
import { useAuthStore } from './authStore'

const useSocketStore = create((set, get) => ({
  socket: null,
  isConnected: false,
  onlineUsers: [],
  notifications: [],
  typingUsers: new Map(),

  // Initialize socket connection
  initializeSocket: () => {
    const { user, token } = useAuthStore.getState()
    
    if (!user || !token) return

    // Disconnect existing socket
    const { socket } = get()
    if (socket) {
      socket.disconnect()
    }

    // Create new socket connection
    const newSocket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000', {
      auth: {
        token,
      },
      transports: ['websocket', 'polling'],
    })

    // Connection events
    newSocket.on('connect', () => {
      console.log('Socket connected')
      set({ isConnected: true })
    })

    newSocket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason)
      set({ isConnected: false })
    })

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error)
      set({ isConnected: false })
    })

    // User events
    newSocket.on('users:online', (users) => {
      set({ onlineUsers: users })
    })

    newSocket.on('user:online', (userId) => {
      set((state) => ({
        onlineUsers: [...state.onlineUsers, userId],
      }))
    })

    newSocket.on('user:offline', (userId) => {
      set((state) => ({
        onlineUsers: state.onlineUsers.filter((id) => id !== userId),
      }))
    })

    // Message events
    newSocket.on('message:new', (message) => {
      // This will be handled by the chat store
      window.dispatchEvent(new CustomEvent('newMessage', { detail: message }))
    })

    newSocket.on('message:typing', (data) => {
      set((state) => {
        const newTypingUsers = new Map(state.typingUsers)
        if (data.isTyping) {
          newTypingUsers.set(data.userId, data.conversationId)
        } else {
          newTypingUsers.delete(data.userId)
        }
        return { typingUsers: newTypingUsers }
      })
    })

    // Notification events
    newSocket.on('notification:new', (notification) => {
      set((state) => ({
        notifications: [notification, ...state.notifications],
      }))

      // Show browser notification if permitted
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(notification.title, {
          body: notification.body,
          icon: '/favicon.ico',
        })
      }
    })

    // Project events
    newSocket.on('project:update', (project) => {
      window.dispatchEvent(new CustomEvent('projectUpdate', { detail: project }))
    })

    newSocket.on('project:new', (project) => {
      window.dispatchEvent(new CustomEvent('newProject', { detail: project }))
    })

    // Payment events
    newSocket.on('payment:success', (payment) => {
      window.dispatchEvent(new CustomEvent('paymentSuccess', { detail: payment }))
    })

    set({ socket: newSocket })
  },

  // Disconnect socket
  disconnectSocket: () => {
    const { socket } = get()
    if (socket) {
      socket.disconnect()
      set({ socket: null, isConnected: false })
    }
  },

  // Join conversation
  joinConversation: (conversationId) => {
    const { socket } = get()
    if (socket && conversationId) {
      socket.emit('conversation:join', conversationId)
    }
  },

  // Leave conversation
  leaveConversation: (conversationId) => {
    const { socket } = get()
    if (socket && conversationId) {
      socket.emit('conversation:leave', conversationId)
    }
  },

  // Send message
  sendMessage: (messageData) => {
    const { socket } = get()
    if (socket) {
      socket.emit('message:send', messageData)
    }
  },

  // Send typing indicator
  sendTyping: (conversationId, isTyping) => {
    const { socket } = get()
    if (socket) {
      socket.emit('message:typing', { conversationId, isTyping })
    }
  },

  // Mark messages as read
  markAsRead: (conversationId) => {
    const { socket } = get()
    if (socket) {
      socket.emit('message:read', conversationId)
    }
  },

  // Clear notifications
  clearNotifications: () => {
    set({ notifications: [] })
  },

  // Mark notification as read
  markNotificationRead: (notificationId) => {
    set((state) => ({
      notifications: state.notifications.map((notif) =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      ),
    }))
  },

  // Get unread notification count
  getUnreadCount: () => {
    const { notifications } = get()
    return notifications.filter((notif) => !notif.read).length
  },

  // Check if user is online
  isUserOnline: (userId) => {
    const { onlineUsers } = get()
    return onlineUsers.includes(userId)
  },

  // Check if user is typing in conversation
  isUserTyping: (userId, conversationId) => {
    const { typingUsers } = get()
    return typingUsers.get(userId) === conversationId
  },

  // Request notification permission
  requestNotificationPermission: async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission()
      return permission === 'granted'
    }
    return false
  },
}))

export { useSocketStore }
