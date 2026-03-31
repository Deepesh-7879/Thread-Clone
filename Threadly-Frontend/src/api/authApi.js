import axiosInstance from './axiosInstance'
export const authApi = {
  login:    (email, password) => axiosInstance.post('/auth-api/login', { email, password }),
  register: (name, username, email, password) => axiosInstance.post('/auth-api/register', { name, username, email, password }),
  getMe:    () => axiosInstance.get('/auth-api/me'),
}
