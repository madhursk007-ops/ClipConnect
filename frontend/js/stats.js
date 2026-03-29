// ===== Real-time Stats Component =====
class StatsManager {
  constructor() {
    this.apiBase = 'http://localhost:5000/api';
    this.stats = {
      totalUsers: 0,
      editors: 0,
      clients: 0,
      totalProjects: 0,
      completedProjects: 0,
      activeProjects: 0
    };
    this.animatedStats = {};
    this.init();
  }

  init() {
    this.fetchStats();
    // Poll for updates every 10 seconds
    setInterval(() => this.fetchStats(), 10000);
  }

  async fetchStats() {
    try {
      const response = await fetch(`${this.apiBase}/stats`);
      const data = await response.json();

      if (data.success) {
        this.stats = data.data;
        this.updateDisplay();
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      // Use fallback values if API fails
      this.useFallbackStats();
    }
  }

  useFallbackStats() {
    // Only use fallback on first load, preserve existing values
    if (this.stats.totalUsers === 0) {
      this.stats = {
        totalUsers: 2847,
        editors: 1245,
        clients: 1602,
        totalProjects: 15243,
        completedProjects: 12856,
        activeProjects: 2387
      };
      this.updateDisplay();
    }
  }

  updateDisplay() {
    // Map all stat elements to their corresponding data keys
    const statElements = [
      { key: 'totalUsers', element: 'stat-total-users' },
      { key: 'editors', element: 'stat-editors' },
      { key: 'editors', element: 'stat-editors-main' },
      { key: 'clients', element: 'stat-clients' },
      { key: 'totalProjects', element: 'stat-projects' },
      { key: 'completedProjects', element: 'stat-completed' },
      { key: 'completedProjects', element: 'stat-completed-main' }
    ];

    statElements.forEach(({ key, element }) => {
      const el = document.getElementById(element);
      if (el) {
        this.animateNumber(el, this.stats[key] || 0);
      }
    });

    // Update hero stats if they exist
    this.updateHeroStats();
  }

  updateHeroStats() {
    // Update specific hero stat elements
    const editorsEl = document.getElementById('stat-editors');
    const completedEl = document.getElementById('stat-completed');
    
    if (editorsEl) {
      this.animateNumber(editorsEl, this.stats.editors || 2847);
    }
    if (completedEl) {
      this.animateNumber(completedEl, this.stats.completedProjects || 15243);
    }
  }

  animateNumber(element, targetValue) {
    const startValue = parseInt(element.textContent.replace(/,/g, '')) || 0;
    const duration = 1500;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out quart
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.round(startValue + (targetValue - startValue) * easeProgress);
      
      element.textContent = currentValue.toLocaleString();
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }
}

// Initialize stats manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.statsManager = new StatsManager();
});
