import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '@services/api'

const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,

      // Actions
      login: async (credentials) => {
        set({ isLoading: true })
        try {
          const response = await api.post('/auth/login', credentials)
          const { user, token, refreshToken } = response.data.data

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          })

          // Set token in api headers
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`

          // Store refresh token
          localStorage.setItem('refreshToken', refreshToken)

          return { success: true, user }
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      register: async (userData) => {
        set({ isLoading: true })
        try {
          const response = await api.post('/auth/register', userData)
          const { user, token, refreshToken } = response.data.data

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          })

          // Set token in api headers
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`

          // Store refresh token
          localStorage.setItem('refreshToken', refreshToken)

          return { success: true, user }
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      logout: async () => {
        try {
          await api.post('/auth/logout')
        } catch (error) {
          console.error('Logout error:', error)
        } finally {
          // Clear state
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          })

          // Clear token from api headers
          delete api.defaults.headers.common['Authorization']

          // Clear refresh token
          localStorage.removeItem('refreshToken')

          // Clear persisted state
          localStorage.removeItem('auth-storage')
        }
      },

      checkAuth: async () => {
        const { token } = get()
        if (!token) {
          set({ isLoading: false })
          return
        }

        set({ isLoading: true })
        try {
          // Set token in api headers
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`

          const response = await api.get('/auth/me')
          const user = response.data.data

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error) {
          // Token is invalid, clear auth
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          })

          delete api.defaults.headers.common['Authorization']
          localStorage.removeItem('refreshToken')
        }
      },

      updateProfile: async (profileData) => {
        set({ isLoading: true })
        try {
          const response = await api.put('/users/profile', profileData)
          const updatedUser = response.data.data

          set({
            user: updatedUser,
            isLoading: false,
          })

          return { success: true, user: updatedUser }
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      changePassword: async (passwordData) => {
        set({ isLoading: true })
        try {
          await api.put('/auth/change-password', passwordData)
          set({ isLoading: false })
          return { success: true }
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      refreshToken: async () => {
        const refreshToken = localStorage.getItem('refreshToken')
        if (!refreshToken) {
          throw new Error('No refresh token available')
        }

        try {
          const response = await api.post('/auth/refresh', {
            refreshToken,
          })

          const { token: newToken, refreshToken: newRefreshToken } = response.data.data

          set({ token: newToken })
          api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
          localStorage.setItem('refreshToken', newRefreshToken)

          return newToken
        } catch (error) {
          // Refresh token is invalid, logout user
          get().logout()
          throw error
        }
      },

      // Social login
      socialLogin: async (provider, token) => {
        set({ isLoading: true })
        try {
          const response = await api.post(`/auth/${provider}`, { token })
          const { user, token: authToken, refreshToken } = response.data.data

          set({
            user,
            token: authToken,
            isAuthenticated: true,
            isLoading: false,
          })

          api.defaults.headers.common['Authorization'] = `Bearer ${authToken}`
          localStorage.setItem('refreshToken', refreshToken)

          return { success: true, user }
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      // Email verification
      verifyEmail: async (token) => {
        try {
          await api.post('/auth/verify-email', { token })
          return { success: true }
        } catch (error) {
          throw error
        }
      },

      // Password reset
      forgotPassword: async (email) => {
        try {
          await api.post('/auth/forgot-password', { email })
          return { success: true }
        } catch (error) {
          throw error
        }
      },

      resetPassword: async (token, password) => {
        try {
          await api.post('/auth/reset-password', { token, password })
          return { success: true }
        } catch (error) {
          throw error
        }
      },

      // Toggle account status
      toggleAvailability: async () => {
        const { user } = get()
        if (!user) return

        try {
          const response = await api.put('/users/availability')
          const updatedUser = response.data.data

          set({ user: updatedUser })
          return { success: true }
        } catch (error) {
          throw error
        }
      },

      // Delete account
      deleteAccount: async (password) => {
        set({ isLoading: true })
        try {
          await api.delete('/users/account', { data: { password } })
          
          // Clear auth state
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          })

          delete api.defaults.headers.common['Authorization']
          localStorage.removeItem('refreshToken')
          localStorage.removeItem('auth-storage')

          return { success: true }
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

export { useAuthStore }
