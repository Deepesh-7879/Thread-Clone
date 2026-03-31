import { useFollow } from '../../hooks/useFollow'
import { useAuth } from '../../hooks/useAuth'
import { btn } from '../../styles/common'
export default function FollowButton({ targetUserId, size='md' }) {
  const { user } = useAuth()
  const { isFollowing, toggleFollow, loadingIds } = useFollow()
  if (!user||user._id===targetUserId) return null
  const following = isFollowing(targetUserId)
  const loading = loadingIds.has(targetUserId)
  return (
    <button onClick={()=>toggleFollow(targetUserId)} disabled={loading}
      className={following?btn.following:btn.follow}>
      {loading?'…':following?'Following':'Follow'}
    </button>
  )
}
