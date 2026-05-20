import { useFollow } from '../../hooks/useFollow'
import { useAuth } from '../../hooks/useAuth'
import { btn } from '../../styles/common'
import { useNavigate } from 'react-router-dom'

export default function FollowButton({ targetUserId, size='md' }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { isFollowing, toggleFollow, loadingIds } = useFollow()

  if (user && user._id === targetUserId) return null

  if (!user) {
    return (
      <button onClick={() => navigate('/login')} className={btn.follow}>
        Follow
      </button>
    )
  }

  const following = isFollowing(targetUserId)
  const loading = loadingIds.has(targetUserId)
  return (
    <button onClick={()=>toggleFollow(targetUserId)} disabled={loading}
      className={following?btn.following:btn.follow}>
      {loading?'…':following?'Following':'Follow'}
    </button>
  )
}
