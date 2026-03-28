import axios from 'axios'
import toast from 'react-hot-toast'

// Create axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('auth-storage')
    if (token) {
      try {
        const authData = JSON.parse(token)
        if (authData.state?.token) {
          config.headers.Authorization = `Bearer ${authData.state.token}`
        }
      } catch (error) {
        console.error('Error parsing auth token:', error)
      }
    }

    // Add request timestamp for debugging
    config.metadata = { startTime: new Date() }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Log response time for debugging
    const endTime = new Date()
    const duration = endTime - response.config.metadata.startTime
    console.log(`API Response: ${response.config.method?.toUpperCase()} ${response.config.url} - ${duration}ms`)

    return response
  },
  async (error) => {
    const originalRequest = error.config

    // Handle network errors
    if (!error.response) {
      console.error('Network error:', error)
      toast.error('Network error. Please check your connection.')
      return Promise.reject(error)
    }

    const { status, data } = error.response

    // Handle different status codes
    switch (status) {
      case 401:
        // Token expired or invalid
        if (!originalRequest._retry) {
          originalRequest._retry = true
          
          try {
            // Try to refresh token
            const refreshToken = localStorage.getItem('refreshToken')
            if (refreshToken) {
              const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/auth/refresh`,
                { refreshToken }
              )
              
              const { token: newToken } = response.data.data
              
              // Update stored token
              const authStorage = localStorage.getItem('auth-storage')
              if (authStorage) {
                const authData = JSON.parse(authStorage)
                authData.state.token = newToken
                localStorage.setItem('auth-storage', JSON.stringify(authData))
              }
              
              // Retry original request
              originalRequest.headers.Authorization = `Bearer ${newToken}`
              return api(originalRequest)
            }
          } catch (refreshError) {
            // Refresh failed, logout user
            localStorage.removeItem('auth-storage')
            localStorage.removeItem('refreshToken')
            window.location.href = '/auth/login'
            return Promise.reject(refreshError)
          }
        }
        break

      case 403:
        toast.error('Access denied. You do not have permission to perform this action.')
        break

      case 404:
        toast.error('The requested resource was not found.')
        break

      case 429:
        toast.error('Too many requests. Please try again later.')
        break

      case 500:
        toast.error('Server error. Please try again later.')
        break

      default:
        // Handle validation errors
        if (data.errors && Array.isArray(data.errors)) {
          data.errors.forEach((err) => {
            toast.error(err.message || 'Validation error')
          })
        } else {
          toast.error(data.message || 'An error occurred')
        }
    }

    return Promise.reject(error)
  }
)

// API service methods
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  refreshToken: (refreshToken) => api.post('/auth/refresh', { refreshToken }),
  verifyEmail: (token) => api.post('/auth/verify-email', { token }),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post('/auth/reset-password', { token, password }),
  changePassword: (passwordData) => api.put('/auth/change-password', passwordData),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (profileData) => api.put('/users/profile', profileData),
}

export const userService = {
  getUsers: (params) => api.get('/users', { params }),
  getUserById: (id) => api.get(`/users/${id}`),
  getFeaturedEditors: (params) => api.get('/users/editors/featured', { params }),
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/users/${id}`),
  uploadAvatar: (formData) => api.post('/users/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  toggleAvailability: () => api.put('/users/availability'),
  getPortfolio: (userId) => api.get(`/users/${userId}/portfolio`),
  addPortfolioItem: (item) => api.post('/users/portfolio', item),
  updatePortfolioItem: (id, item) => api.put(`/users/portfolio/${id}`, item),
  deletePortfolioItem: (id) => api.delete(`/users/portfolio/${id}`),
}

export const projectService = {
  getProjects: (params) => api.get('/projects', { params }),
  getProjectById: (id) => api.get(`/projects/${id}`),
  createProject: (projectData) => api.post('/projects', projectData),
  updateProject: (id, projectData) => api.put(`/projects/${id}`, projectData),
  deleteProject: (id) => api.delete(`/projects/${id}`),
  applyToProject: (id, proposalData) => api.post(`/projects/${id}/apply`, proposalData),
  getApplications: (projectId) => api.get(`/projects/${projectId}/applications`),
  acceptApplication: (projectId, applicationId) => api.put(`/projects/${projectId}/applications/${applicationId}/accept`),
  rejectApplication: (projectId, applicationId) => api.put(`/projects/${projectId}/applications/${applicationId}/reject`),
  getMyProjects: (params) => api.get('/projects/my', { params }),
  getProjectMessages: (id) => api.get(`/projects/${id}/messages`),
  sendProjectMessage: (id, messageData) => api.post(`/projects/${id}/messages`, messageData),
}

export const messageService = {
  getConversations: (params) => api.get('/messages/conversations', { params }),
  getConversation: (id) => api.get(`/messages/conversations/${id}`),
  sendMessage: (messageData) => api.post('/messages', messageData),
  markAsRead: (conversationId) => api.put(`/messages/conversations/${conversationId}/read`),
  deleteMessage: (id) => api.delete(`/messages/${id}`),
  getUnreadCount: () => api.get('/messages/unread-count'),
  searchMessages: (query) => api.get('/messages/search', { params: { query } }),
}

export const reviewService = {
  getReviews: (userId, params) => api.get(`/reviews/user/${userId}`, { params }),
  createReview: (reviewData) => api.post('/reviews', reviewData),
  updateReview: (id, reviewData) => api.put(`/reviews/${id}`, reviewData),
  deleteReview: (id) => api.delete(`/reviews/${id}`),
  respondToReview: (id, response) => api.post(`/reviews/${id}/respond`, { response }),
  getMyReviews: (params) => api.get('/reviews/my', { params }),
  getReviewStats: (userId) => api.get(`/reviews/user/${userId}/stats`),
}

export const paymentService = {
  createPaymentIntent: (paymentData) => api.post('/payments/create-intent', paymentData),
  confirmPayment: (paymentIntentId) => api.post('/payments/confirm', { paymentIntentId }),
  getPaymentHistory: (params) => api.get('/payments/history', { params }),
  getPaymentById: (id) => api.get(`/payments/${id}`),
  refundPayment: (id) => api.post(`/payments/${id}/refund`),
  getEarnings: (params) => api.get('/payments/earnings', { params }),
  withdrawEarnings: (amount) => api.post('/payments/withdraw', { amount }),
}

export const notificationService = {
  getNotifications: (params) => api.get('/notifications', { params }),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
  deleteNotification: (id) => api.delete(`/notifications/${id}`),
  getUnreadCount: () => api.get('/notifications/unread-count'),
}

export const uploadService = {
  uploadImage: (file, folder = 'general') => {
    const formData = new FormData()
    formData.append('image', file)
    formData.append('folder', folder)
    return api.post('/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  uploadVideo: (file, folder = 'videos') => {
    const formData = new FormData()
    formData.append('video', file)
    formData.append('folder', folder)
    return api.post('/upload/video', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 300000, // 5 minutes for video uploads
    })
  },
  uploadDocument: (file, folder = 'documents') => {
    const formData = new FormData()
    formData.append('document', file)
    formData.append('folder', folder)
    return api.post('/upload/document', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  deleteFile: (publicId) => api.delete('/upload/file', { data: { publicId } }),
}

export const searchService = {
  searchUsers: (query, filters) => api.get('/search/users', { params: { query, ...filters } }),
  searchProjects: (query, filters) => api.get('/search/projects', { params: { query, ...filters } }),
  getTrendingSearches: () => api.get('/search/trending'),
  saveSearch: (query) => api.post('/search/save', { query }),
  getSearchHistory: () => api.get('/search/history'),
  clearSearchHistory: () => api.delete('/search/history'),
}

// Utility functions
export const handleApiError = (error) => {
  if (error.response?.data?.message) {
    toast.error(error.response.data.message)
  } else if (error.message) {
    toast.error(error.message)
  } else {
    toast.error('An unexpected error occurred')
  }
}

export const createFormData = (data) => {
  const formData = new FormData()
  Object.keys(data).forEach((key) => {
    if (data[key] !== null && data[key] !== undefined) {
      formData.append(key, data[key])
    }
  })
  return formData
}

// Cancel token for cancelling requests
export const createCancelToken = () => {
  return axios.CancelToken.source()
}

export const isCancel = axios.isCancel

export default api
