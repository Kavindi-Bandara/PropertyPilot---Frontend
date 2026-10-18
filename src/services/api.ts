import axios from 'axios'

export const TOKEN_KEY = 'propertypilot.token'
export const USER_KEY = 'propertypilot.user'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8090/api',
  headers: { 'Content-Type': 'application/json' },
})

// Attach the JWT to every request once the user is logged in.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY) ?? sessionStorage.getItem(TOKEN_KEY)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
