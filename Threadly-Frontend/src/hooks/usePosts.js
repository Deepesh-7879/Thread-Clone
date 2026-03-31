import { useState, useEffect, useCallback } from 'react'
import { postApi } from '../api/postApi'

export function usePosts() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true)
        const response = await postApi.getAllPosts()
        
        // Transform the backend response to match the frontend structure expected by components
        const formattedPosts = (response.data || []).map(p => ({
          _id: p._id,
          userId: {
            _id: p.author?._id || p.author,
            name: p.author?.displayName || p.author?.username || 'Unknown',
            username: p.author?.username,
            verified: p.author?.verified || false,
            profilePicture: p.author?.profilePicture
          },
          content: p.content,
          image: p.image || null,
          likes: p.likes || [],
          comments: p.comments || [],
          bookmarks: p.bookmarks || [],
          createdAt: p.createdAt || new Date().toISOString()
        }))
        
        setPosts(formattedPosts)
      } catch (error) {
        console.error('Error fetching posts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  const createPost = useCallback(async (content, image, currentUser) => {
    if (!content.trim() || !currentUser) return null

    try {
      // Call backend API with content and optional image
      const response = await postApi.createPost(content, image instanceof File ? image : null)
      const newPost = response.data

      // Transform backend response to match frontend structure
      // Backend returns: { _id, author (User obj or ID), content, image, likes, comments, createdAt, updatedAt }
      // Frontend expects: { _id, userId: {_id, name, username, verified}, content, image, likes, comments, bookmarks, createdAt }
      const transformedPost = {
        _id: newPost._id,
        userId: {
          _id: typeof newPost.author === 'object' ? newPost.author._id : newPost.author,
          name: typeof newPost.author === 'object' ? (newPost.author.displayName || newPost.author.name || 'Unknown') : currentUser.name,
          username: typeof newPost.author === 'object' ? newPost.author.username : currentUser.username,
          verified: typeof newPost.author === 'object' ? (newPost.author.verified || false) : (currentUser.verified || false)
        },
        content: newPost.content,
        image: newPost.image || null,
        likes: newPost.likes || [],
        comments: newPost.comments || [],
        bookmarks: newPost.bookmarks || [],
        createdAt: newPost.createdAt || new Date().toISOString()
      }

      // Add to local state
      setPosts(prev => [transformedPost, ...prev])
      return transformedPost
    } catch (error) {
      console.error('Error creating post:', error)
      // Fallback: create locally if API fails
      const np = {
        _id: 'p' + Date.now(),
        userId: {
          _id: currentUser._id,
          name: currentUser.name,
          username: currentUser.username,
          verified: currentUser.verified
        },
        content,
        image: image instanceof File ? URL.createObjectURL(image) : (image || null),
        likes: [],
        comments: [],
        bookmarks: [],
        createdAt: new Date().toISOString()
      }
      setPosts(prev => [np, ...prev])
      return np
    }
  }, [])

  const toggleLike = useCallback(async (postId, userId) => {
    // Optimistic UI update
    setPosts(prev =>
      prev.map(p =>
        p._id !== postId
          ? p
          : {
            ...p,
            likes: p.likes.includes(userId)
              ? p.likes.filter(id => id !== userId)
              : [...p.likes, userId]
          }
      )
    )
    
    try {
      if (userId) {
        await postApi.likePost(postId)
      }
    } catch (error) {
      console.error('Error toggling like:', error)
    }
  }, [])

  const toggleBookmark = useCallback((postId, userId) => {
    // Basic local state bookmark since the API doesn't seem fully implemented for it yet
    setPosts(prev =>
      prev.map(p =>
        p._id !== postId
          ? p
          : {
            ...p,
            bookmarks: p.bookmarks.includes(userId)
              ? p.bookmarks.filter(id => id !== userId)
              : [...p.bookmarks, userId]
          }
      )
    )
  }, [])

  const addComment = useCallback(async (postId, comment, currentUser) => {
    // The current hook argument `comment` is just text. We need to formulate it
    const newComment = {
      _id: Date.now().toString(),
      user: { 
        _id: currentUser?._id, 
        name: currentUser?.name || 'User', 
        username: currentUser?.username,
        profilePicture: currentUser?.profilePicture
      },
      content: comment,
      createdAt: new Date().toISOString()
    }
    
    // Optimistic check
    setPosts(prev =>
      prev.map(p =>
        p._id === postId ? { ...p, comments: [...p.comments, newComment] } : p
      )
    )
    
    try {
      await postApi.addComment(postId, comment)
    } catch (error) {
      console.error('Error adding comment:', error)
    }
  }, [])

  const deletePost = useCallback(async (postId) => {
    setPosts(prev => prev.filter(p => p._id !== postId))
    try {
      await postApi.deletePost(postId)
    } catch (error) {
      console.error('Error deleting post:', error)
    }
  }, [])

  return {
    posts,
    loading,
    createPost,
    toggleLike,
    toggleBookmark,
    addComment,
    deletePost
  }
}
