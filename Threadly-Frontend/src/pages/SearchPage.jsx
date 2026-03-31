import { useState, useEffect } from 'react'
import Navbar from '../components/layout/Navbar'
import UserCard from '../components/user/UserCard'
import PostCard from '../components/post/PostCard'
import Spinner from '../components/common/Spinner'
import { usePosts } from '../hooks/usePosts'
import { useAuth } from '../hooks/useAuth'
import { userApi } from '../api/userApi'
import { input, profile, misc } from '../styles/common'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [tab, setTab] = useState('users')
  const { user } = useAuth()
  const { posts, loading, toggleLike, toggleBookmark, addComment, addReply } = usePosts()

  const [users, setUsers] = useState([])
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [usersError, setUsersError] = useState(null)

  useEffect(() => {
    let cancelled = false
    const timer = setTimeout(async () => {
      setLoadingUsers(true)
      setUsersError(null)

      try {
        const response = await userApi.searchUsers(query)
        if (cancelled) return
        setUsers(response.data || [])
      } catch (error) {
        if (cancelled) return
        setUsersError(error)
      } finally {
        if (!cancelled) setLoadingUsers(false)
      }
    }, 250)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [query])

  return (
    <div>
      <Navbar title="Search" />
      <div className="px-3 sm:px-5 py-3 border-b border-cream-border sticky top-13 sm:top-14 bg-cream/90 backdrop-blur-md z-10">
        <div className={input.searchWrapper}>
          <span className="text-ink-muted text-sm">◎</span>
          <input value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Search people, posts..." className={input.search} autoFocus />
          {query && (
            <button onClick={() => setQuery('')} className="text-ink-muted border-0 bg-transparent cursor-pointer text-sm">✕</button>
          )}
        </div>
      </div>
      <div className={profile.tabBar}>
        {['users', 'posts'].map(t => (
          <button key={t} className={tab === t ? profile.tabActive : profile.tab} onClick={() => setTab(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>
      {tab === 'users' ? (
        <div className="px-3 sm:px-5">
          {loadingUsers ? (
            <Spinner center />
          ) : usersError ? (
            <div className={misc.emptyState}><span>Unable to load users</span></div>
          ) : users.length === 0 ? (
            <div className={misc.emptyState}><span>No users found</span></div>
          ) : (
            users.map(u => <UserCard key={u._id} user={u} />)
          )}
        </div>
      ) : loading ? <Spinner center /> : posts.length === 0 ? (
        <div className={misc.emptyState}><span>No posts found</span></div>
      ) : posts.map(p => (
        <PostCard key={p._id} post={p}
          onLike={id => toggleLike(id, user?._id)}
          onBookmark={id => toggleBookmark(id, user?._id)}
          onAddComment={(postId, comment) => addComment(postId, comment, user)}
          onAddReply={(postId, commentId, txt) => addReply(postId, commentId, txt, user)} />
      ))}
    </div>
  )
}
