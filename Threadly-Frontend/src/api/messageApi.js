import axiosInstance from './axiosInstance'

export const messageApi = {
  getConversations: () => axiosInstance.get('/messages/conversations'),
  sendMessage: (receiverId, text) => axiosInstance.post('/messages', { receiverId, text }),
  markRead: (otherUserId) => axiosInstance.put(`/messages/${otherUserId}/read`),
}
