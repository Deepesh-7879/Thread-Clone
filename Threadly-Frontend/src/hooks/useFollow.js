import { useState, useCallback } from 'react'
import { useAuth } from './useAuth'
import { userApi } from '../api/userApi'

export function useFollow() {
  const { user, updateUser } = useAuth()
  const [loadingIds, setLoadingIds] = useState(new Set())
  const isFollowing = useCallback((id) => user?.following?.includes(id) ?? false, [user])

  const toggleFollow = useCallback(async (targetId) => {
    if (!user) return
    setLoadingIds(prev => new Set([...prev, targetId]))

    try {
      const already = user.following?.includes(targetId)
      const response = already
        ? await userApi.unfollowUser(targetId)
        : await userApi.followUser(targetId)

      // Update user in context with server response if provided.
      const updatedUser = response?.data?.user || response?.data?.currentUser
      if (updatedUser && updatedUser.following) {
        updateUser({ following: updatedUser.following })
      } else {
        updateUser({
          following: already
            ? user.following.filter(id => id !== targetId)
            : [...(user.following || []), targetId]
        })
      }
    } finally {
      setLoadingIds(prev => { const n = new Set(prev); n.delete(targetId); return n })
    }
  }, [user, updateUser])

  return { isFollowing, toggleFollow, loadingIds }
}
