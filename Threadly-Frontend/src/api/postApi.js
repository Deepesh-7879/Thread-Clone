import axiosInstance from './axiosInstance'

export const postApi = {
  // Create post with optional image
  createPost: (content, imageFile) => {
    const formData = new FormData()
    formData.append('content', content)
    if (imageFile instanceof File) {
      formData.append('images', imageFile)
    }
    return axiosInstance.post('/posts', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  
  // Get all posts
  getAllPosts: () => axiosInstance.get('/posts/all'),
  
  // Get posts by user ID
  getUserPosts: (userId) => axiosInstance.get(`/posts/user/${userId}`),
  
  // Get feed (posts from users you follow)
  getFeed: () => axiosInstance.get('/posts/feed'),
  
  // Get single post
  getPostById: (id) => axiosInstance.get(`/posts/${id}`),
  
  // Delete post
  deletePost: (id) => axiosInstance.delete(`/posts/${id}`),
  
  // Like post
  likePost: (id) => axiosInstance.post(`/posts/${id}/like`),
  
  // Add comment to post
  addComment: (postId, content) => axiosInstance.post(`/posts/${postId}/comment`, { content }),
  
  // Add reply to comment
  addReply: (postId, commentId, content) => axiosInstance.post(`/posts/${postId}/comment/${commentId}/reply`, { content }),
}
