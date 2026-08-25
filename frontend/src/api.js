import axios from 'axios'

/**
 * Common HTTP client for backend requests.
 * Uses '/api' proxy configured in vite.config.js
 */
const api = axios.create({
  baseURL: '/api'
})

// Request interceptor: attaches current admin JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Response interceptor: automatically handles expired or invalid tokens (401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clean up invalid or expired token
      localStorage.removeItem('token')
      // If the admin is currently in the admin panel, redirect to login
      if (window.location.pathname === '/admin') {
        window.location.href = '/admin/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api