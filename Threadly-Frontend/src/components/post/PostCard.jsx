import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Avatar from '../common/Avatar'
import VerifiedBadge from '../common/VerifiedBadge'
import PostActions from './PostActions'
import CommentList from './CommentList'
import { formatDate } from '../../utils/formatDate'
import { useAuth } from '../../hooks/useAuth'
import { post as P, text } from '../../styles/common'

export default function PostCard({ post, onLike, onBookmark, onAddComment, onAddReply, onDeletePost, compact = false }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [showComments, setShowComments] = useState(false)
  const author = post.userId
  const isOwn = user?._id === (author?._id || author)

  const handleClick = e => {
    if (e.target.closest('button') || e.target.closest('input') || e.target.closest('textarea')) return
    if (!compact) navigate(`/post/${post._id}`)
  }

  return (
    <article onClick={handleClick}
      className={compact ? P.wrapperStatic : P.wrapper}>
      <div className={P.body}>
        {/* Avatar */}
        <div onClick={e => { e.stopPropagation(); navigate(`/profile/${author?.username}`) }}
          className="cursor-pointer shrink-0">
          <Avatar user={author} size="md" />
        </div>

        <div className="flex-1 min-w-0">
          {/* Header row */}
          <div className="flex items-start justify-between gap-1 mb-1">
            <div className="flex items-center gap-1 flex-wrap min-w-0">
              <span className={P.authorName}
                onClick={e => { e.stopPropagation(); navigate(`/profile/${author?.username}`) }}>
                {author?.name || 'Unknown'}
              </span>
              {author?.verified && <VerifiedBadge size={13} />}
              {/* username hidden on very small screens */}
              <span className="hidden xs:inline text-[12px] sm:text-[13px] text-ink-muted truncate">
                @{author?.username}
              </span>
              <span className="text-sand text-xs">·</span>
              <span className={text.metaSm}>{formatDate(post.createdAt)}</span>
            </div>
            {isOwn && (
              <button onClick={e => { e.stopPropagation(); onDeletePost?.(post._id) }}
                className="shrink-0 text-ink-muted hover:text-red-600 text-sm px-1 py-0.5 rounded-lg hover:bg-red-50 transition-colors border-0 bg-transparent cursor-pointer">
                ···
              </button>
            )}
          </div>

          {/* Content */}
          <p className={text.postContent}>{post.content}</p>

          {/* Image */}
          {post.image && (
            <div className={P.image}>
              <img src={post.image} alt="" className="w-full max-h-64 sm:max-h-80 object-cover" />
            </div>
          )}

          {/* Actions */}
          <PostActions post={post} currentUserId={user?._id}
            onLike={onLike} onBookmark={onBookmark}
            onComment={() => setShowComments(v => !v)} />

          {/* Comments */}
          {showComments && (
            <CommentList comments={post.comments} postId={post._id} onAddComment={onAddComment} onAddReply={onAddReply} />
          )}
        </div>
      </div>
    </article>
  )
}
