import { useState } from 'react'
import Avatar from '../common/Avatar'
import { formatDate } from '../../utils/formatDate'
import { useAuth } from '../../hooks/useAuth'
import { input, btn, text } from '../../styles/common'

export default function CommentList({ comments = [], postId, onAddComment }) {
  const { user } = useAuth()
  const [txt, setTxt] = useState('')
  const [sub, setSub] = useState(false)

  const handle = async e => {
    e.preventDefault()
    if (!txt.trim() || sub) return
    setSub(true)
    await onAddComment?.(postId, { _id: 'c' + Date.now(), userId: user, content: txt.trim(), createdAt: new Date().toISOString() })
    setTxt(''); setSub(false)
  }

  return (
    <div className="mt-3">
      {comments.map(c => (
        <div key={c._id} className="flex gap-2 sm:gap-2.5 py-2.5 border-b border-cream-border">
          <Avatar user={c.userId || { name: 'User', username: 'user' }} size="xs" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
              <span className="font-semibold text-[13px] text-ink">{c.userId?.name || 'User'}</span>
              <span className={text.metaSm}>· {formatDate(c.createdAt)}</span>
            </div>
            <p className="text-[13px] sm:text-[14px] text-ink-light">{c.content}</p>
          </div>
        </div>
      ))}
      {user && (
        <form onSubmit={handle} className="flex gap-2 mt-3 items-center">
          <Avatar user={user} size="xs" />
          <input value={txt} onChange={e => setTxt(e.target.value)}
            placeholder="Write a comment..." className={input.comment} />
          <button type="submit" disabled={!txt.trim() || sub}
            className={`${btn.primarySm} ${(!txt.trim() || sub) ? 'opacity-50' : ''} shrink-0`}>Post</button>
        </form>
      )}
    </div>
  )
}
