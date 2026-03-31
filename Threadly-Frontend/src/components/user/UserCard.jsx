import { useNavigate } from 'react-router-dom'
import Avatar from '../common/Avatar'
import VerifiedBadge from '../common/VerifiedBadge'
import FollowButton from './FollowButton'
import { text } from '../../styles/common'

export default function UserCard({ user, compact = false }) {
  const navigate = useNavigate()
  return (
    <div className="flex items-start gap-3 py-3 sm:py-3.5 border-b border-cream-border cursor-pointer"
      onClick={() => navigate(`/profile/${user.username}`)}>
      <Avatar user={user} size={compact ? 'sm' : 'md'} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1 mb-0.5 flex-wrap">
          <span className="font-bold text-[14px] sm:text-[15px] text-ink truncate">{user.name}</span>
          {user.verified && <VerifiedBadge size={13} />}
        </div>
        <div className={text.username}>@{user.username}</div>
        {!compact && user.bio && (
          <p className="text-[12px] sm:text-[13px] text-ink-light mt-1 line-clamp-2">{user.bio}</p>
        )}
      </div>
      <div onClick={e => e.stopPropagation()} className="shrink-0">
        <FollowButton targetUserId={user._id} size="sm" />
      </div>
    </div>
  )
}
