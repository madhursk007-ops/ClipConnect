const socketIo = require('socket.io');
const { getRealtimeStats } = require('../controllers/statsController');

let io = null;
let connectedUsers = new Map();

// Initialize Socket.io with HTTP server
const initializeSocket = (server) => {
  io = socketIo(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true
    },
    transports: ['websocket', 'polling']
  });

  io.on('connection', async (socket) => {
    console.log('Client connected:', socket.id);
    
    // Track connected user
    const userId = socket.handshake.query.userId;
    if (userId) {
      connectedUsers.set(socket.id, { userId, socketId: socket.id });
    }

    // Send initial stats
    const stats = await getRealtimeStats();
    socket.emit('stats:initial', stats);

    // Send online users count
    io.emit('users:online', connectedUsers.size);

    // Handle activity feed subscription
    socket.on('activity:subscribe', () => {
      socket.join('activity-feed');
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
      connectedUsers.delete(socket.id);
      io.emit('users:online', connectedUsers.size);
    });
  });

  return io;
};

// Get io instance
const getIo = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};

// Emit stats update to all clients
const emitStatsUpdate = async () => {
  if (!io) return;
  
  const stats = await getRealtimeStats();
  io.emit('stats:update', stats);
};

// Emit new activity to activity feed
const emitActivity = (activity) => {
  if (!io) return;
  
  io.to('activity-feed').emit('activity:new', {
    ...activity,
    timestamp: new Date().toISOString()
  });
};

// Emit user joined event
const emitUserJoined = (user) => {
  if (!io) return;
  
  emitActivity({
    type: 'user_joined',
    message: `${user.name || 'A new user'} joined the platform`,
    icon: 'user-plus'
  });
  
  emitStatsUpdate();
};

// Emit project created event
const emitProjectCreated = (project) => {
  if (!io) return;
  
  emitActivity({
    type: 'project_created',
    message: `New project "${project.title}" posted`,
    icon: 'folder-plus'
  });
  
  emitStatsUpdate();
};

// Emit project completed event
const emitProjectCompleted = (project) => {
  if (!io) return;
  
  emitActivity({
    type: 'project_completed',
    message: `Project "${project.title}" completed successfully`,
    icon: 'check-circle'
  });
  
  emitStatsUpdate();
};

// Emit message sent event
const emitMessageSent = (message) => {
  if (!io) return;
  
  emitActivity({
    type: 'message_sent',
    message: `New message in project discussion`,
    icon: 'message-circle'
  });
};

module.exports = {
  initializeSocket,
  getIo,
  emitStatsUpdate,
  emitActivity,
  emitUserJoined,
  emitProjectCreated,
  emitProjectCompleted,
  emitMessageSent,
  getConnectedUsersCount: () => connectedUsers.size
};
