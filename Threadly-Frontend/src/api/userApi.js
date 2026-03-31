import axiosInstance from './axiosInstance'
export const userApi = {
  getUserByUsername: (username) => axiosInstance.get(`/users/${username}`),
  updateProfile:     (data)     => axiosInstance.put('/users/profile', data),
  followUser:        (userId)   => axiosInstance.post(`/users/${userId}/follow`),
  unfollowUser:      (userId)   => axiosInstance.post(`/users/${userId}/unfollow`),
  searchUsers:       (query='') => axiosInstance.get('/users/search', { params: { q: query } }),
  getSuggestedUsers: ()         => axiosInstance.get('/users/suggested'),
  uploadProfilePicture: (formData) => axiosInstance.post('/users/profile-picture', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}
