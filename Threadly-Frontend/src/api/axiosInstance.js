import axios from 'axios'
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
})
axiosInstance.interceptors.request.use(config => {
  const token = localStorage.getItem('threadly_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})
axiosInstance.interceptors.response.use(r => r, err => {
  if (err.response?.status === 401) { localStorage.removeItem('threadly_token'); window.location.href = '/login' }
  return Promise.reject(err)
})
export default axiosInstance
