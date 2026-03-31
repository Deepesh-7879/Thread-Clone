import axiosInstance from './axiosInstance'

export const notificationApi = {
  getNotifications: () => axiosInstance.get('/notifications'),
  markReadAll: () => axiosInstance.put('/notifications/read'),
}
