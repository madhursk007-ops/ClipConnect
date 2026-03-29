// ===== Real-time Socket Client for Static Site =====
class RealtimeSocketClient {
  constructor() {
    this.socket = null;
    this.stats = {
      totalUsers: 0,
      editors: 0,
      clients: 0,
      totalProjects: 0,
      completedProjects: 0
    };
    this.activities = [];
    this.onlineUsers = 0;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.apiBase = 'http://localhost:5000/api';
    this.socketUrl = 'http://localhost:5000';
    
    this.init();
  }

  init() {
    this.fetchInitialStats();
    this.connectSocket();
    
    // Fallback polling if socket fails
    setInterval(() => {
      if (!this.socket || !this.socket.connected) {
        this.fetchInitialStats();
      }
    }, 10000);
  }

  connectSocket() {
    if (typeof io === 'undefined') {
      console.log('Socket.io not available, using HTTP polling');
      return;
    }

    this.socket = io(this.socketUrl, {
      transports: ['websocket', 'polling'],
      withCredentials: true
    });

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket.id);
      this.reconnectAttempts = 0;
      this.socket.emit('activity:subscribe');
    });

    this.socket.on('stats:initial', (stats) => {
      this.updateStats(stats);
    });

    this.socket.on('stats:update', (stats) => {
      this.updateStats(stats);
    });

    this.socket.on('activity:new', (activity) => {
      this.addActivity(activity);
    });

    this.socket.on('users:online', (count) => {
      this.updateOnlineUsers(count);
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    this.socket.on('connect_error', () => {
      this.reconnectAttempts++;
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.log('Max reconnection attempts reached, using HTTP polling');
        this.socket.disconnect();
        this.socket = null;
      }
    });
  }

  async fetchInitialStats() {
    try {
      const response = await fetch(`${this.apiBase}/stats`);
      const data = await response.json();
      
      if (data.success) {
        this.updateStats(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      // Use fallback values
      this.useFallbackStats();
    }

    // Fetch online users
    try {
      const response = await fetch(`${this.apiBase}/stats/online`);
      const data = await response.json();
      
      if (data.success) {
        this.updateOnlineUsers(data.count);
      }
    } catch (error) {
      console.error('Failed to fetch online users:', error);
    }
  }

  useFallbackStats() {
    this.updateStats({
      totalUsers: 2847,
      editors: 1245,
      clients: 1602,
      totalProjects: 15243,
      completedProjects: 12856
    });
  }

  updateStats(newStats) {
    const oldStats = { ...this.stats };
    this.stats = { ...this.stats, ...newStats };
    
    // Animate number changes
    Object.keys(newStats).forEach(key => {
      if (newStats[key] !== undefined && oldStats[key] !== undefined) {
        const element = document.getElementById(`stat-${this.camelToKebab(key)}`);
        if (element) {
          this.animateNumber(element, oldStats[key], newStats[key]);
        }
      }
    });

    // Update online indicator pulse
    this.triggerUpdatePulse();
  }

  camelToKebab(str) {
    return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
  }

  animateNumber(element, start, end) {
    const duration = 1000;
    const startTime = performance.now();
    
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (end - start) * easeProgress);
      
      element.textContent = current.toLocaleString();
      element.classList.add('updating');
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setTimeout(() => element.classList.remove('updating'), 300);
      }
    };
    
    requestAnimationFrame(animate);
  }

  updateOnlineUsers(count) {
    this.onlineUsers = count;
    const element = document.getElementById('online-users-count');
    if (element) {
      element.textContent = count;
      element.classList.add('pulse');
      setTimeout(() => element.classList.remove('pulse'), 500);
    }
  }

  addActivity(activity) {
    this.activities.unshift(activity);
    if (this.activities.length > 10) {
      this.activities.pop();
    }
    this.renderActivityFeed();
  }

  renderActivityFeed() {
    const container = document.getElementById('activity-feed');
    if (!container) return;

    container.innerHTML = this.activities.map(activity => {
      const icon = this.getActivityIcon(activity.type);
      const color = this.getActivityColor(activity.type);
      const time = new Date(activity.timestamp).toLocaleTimeString();
      
      return `
        <div class="activity-item ${color}">
          <i class="fas ${icon}"></i>
          <span class="activity-message">${activity.message}</span>
          <span class="activity-time">${time}</span>
        </div>
      `;
    }).join('');
  }

  getActivityIcon(type) {
    const icons = {
      'user_joined': 'fa-user-plus',
      'project_created': 'fa-folder-plus',
      'project_completed': 'fa-check-circle',
      'message_sent': 'fa-comment'
    };
    return icons[type] || 'fa-bolt';
  }

  getActivityColor(type) {
    const colors = {
      'user_joined': 'blue',
      'project_created': 'purple',
      'project_completed': 'green',
      'message_sent': 'yellow'
    };
    return colors[type] || 'primary';
  }

  triggerUpdatePulse() {
    const cards = document.querySelectorAll('.stats-card');
    cards.forEach(card => {
      card.classList.add('update-pulse');
      setTimeout(() => card.classList.remove('update-pulse'), 500);
    });
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.realtimeClient = new RealtimeSocketClient();
});
