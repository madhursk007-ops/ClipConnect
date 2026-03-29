import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,

      // Actions
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setToken: (token) => set({ token }),
      login: (user, token) => set({ user, token, isAuthenticated: true, isLoading: false }),
      logout: () => set({ user: null, token: null, isAuthenticated: false, isLoading: false }),
      setLoading: (isLoading) => set({ isLoading }),
      updateUser: (updates) => set((state) => ({ 
        user: state.user ? { ...state.user, ...updates } : null 
      })),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token, user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);

export const useStatsStore = create((set, get) => ({
  stats: {
    totalUsers: 0,
    editors: 0,
    clients: 0,
    totalProjects: 0,
    completedProjects: 0,
  },
  activities: [],
  onlineUsers: 0,
  
  setStats: (stats) => set({ stats }),
  updateStat: (key, value) => set((state) => ({
    stats: { ...state.stats, [key]: value }
  })),
  addActivity: (activity) => set((state) => ({
    activities: [activity, ...state.activities].slice(0, 10)
  })),
  setOnlineUsers: (count) => set({ onlineUsers: count }),
}));

export const useUIStore = create((set) => ({
  theme: 'dark',
  sidebarOpen: false,
  currentModal: null,
  notifications: [],
  
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  openModal: (modal) => set({ currentModal: modal }),
  closeModal: () => set({ currentModal: null }),
  addNotification: (notification) => set((state) => ({
    notifications: [{ id: Date.now(), ...notification }, ...state.notifications].slice(0, 5)
  })),
  removeNotification: (id) => set((state) => ({
    notifications: state.notifications.filter((n) => n.id !== id)
  })),
}));

export const useProjectStore = create((set) => ({
  projects: [],
  currentProject: null,
  filters: {
    status: '',
    category: '',
    search: '',
  },
  
  setProjects: (projects) => set({ projects }),
  setCurrentProject: (project) => set({ currentProject: project }),
  addProject: (project) => set((state) => ({ projects: [project, ...state.projects] })),
  updateProject: (id, updates) => set((state) => ({
    projects: state.projects.map((p) => p._id === id ? { ...p, ...updates } : p)
  })),
  setFilters: (filters) => set((state) => ({ filters: { ...state.filters, ...filters } })),
}));
