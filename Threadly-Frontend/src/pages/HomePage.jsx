import { useMemo, useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import CreatePostForm from '../components/post/CreatePostForm'
import PostCard from '../components/post/PostCard'
import Spinner from '../components/common/Spinner'
import UserCard from '../components/user/UserCard'
import Avatar from '../components/common/Avatar'
import { usePosts } from '../hooks/usePosts'
import { useAuth } from '../hooks/useAuth'
import { userApi } from '../api/userApi'
import { card, text } from '../styles/common'

export default function HomePage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { posts, loading, createPost, toggleLike, toggleBookmark, sharePost, addComment, addReply, deletePost } = usePosts()
  const [searchParams] = useSearchParams()
  const shouldFocus = searchParams.get('new_post')

  const [suggestedUsers, setSuggestedUsers] = useState([])

  // Pick random posts from other users for the trending/recent section
  const trendingPosts = useMemo(() => {
    if (!posts.length) return []
    const otherPosts = posts.filter(p => p.userId?._id !== user?._id && p.content)
    const shuffled = [...otherPosts].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, 5)
  }, [posts, user?._id])

  useEffect(() => {
    const fetchSuggested = async () => {
      try {
        const res = await userApi.getSuggestedUsers()
        setSuggestedUsers(res.data.slice(0, 3))
      } catch (error) {
        console.error("Failed to fetch suggested users:", error)
      }
    }
    fetchSuggested()
  }, [])

  const handleCreatePost = async (content, image) => {
    if (user) {
      createPost(content, image, user)
    }
  }

  return (
    <div className="flex min-h-screen">
      <div className="flex-1 min-w-0 border-r border-cream-border">
        <Navbar title="Home" />
        <CreatePostForm onPost={handleCreatePost} shouldFocus={shouldFocus} />
        {loading ? <Spinner center /> : posts.map((p, i) => (
          <div key={p._id} style={{ animation: `fadeUp 0.3s ease ${i * 0.05}s both` }}>
            <PostCard post={p}
              onLike={id => toggleLike(id, user?._id)}
              onBookmark={id => toggleBookmark(id, user?._id)}
              onShare={id => sharePost(id, user?._id)}
              onAddComment={(postId, comment) => addComment(postId, comment, user)}
              onAddReply={(postId, commentId, txt) => addReply(postId, commentId, txt, user)}
              onDeletePost={deletePost} />
          </div>
        ))}
      </div>

      <aside className="hidden xl:flex w-75 shrink-0 p-5 flex-col gap-5">
        <div className={card.section}>
          <div className="px-4 py-3 border-b border-cream-border">
            <h3 className={text.h3}>Who to follow</h3>
          </div>
          <div className="px-4">
            {suggestedUsers.map(u => <UserCard key={u._id} user={u} compact />)}
          </div>
        </div>
        <div className={card.section}>
          <div className="px-4 py-3 border-b border-cream-border">
            <h3 className={text.h3}>Trending Posts</h3>
          </div>
          {trendingPosts.length === 0 ? (
            <div className="px-4 py-5 text-center text-ink-muted text-sm">No posts yet</div>
          ) : trendingPosts.map((p) => (
            <div key={p._id}
              className="px-4 py-3 hover:bg-cream-dark transition-colors cursor-pointer border-b border-cream-border last:border-0"
              onClick={() => navigate(`/post/${p._id}`)}>
              <div className="flex items-center gap-2 mb-1.5">
                <Avatar user={p.userId} size="xs" />
                <span className="font-semibold text-[13px] text-ink truncate">{p.userId?.name || 'Unknown'}</span>
                <span className="text-[11px] text-ink-muted">@{p.userId?.username}</span>
              </div>
              <p className="text-[13px] text-ink-light leading-snug line-clamp-2" style={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>
                {p.content}
              </p>
              <div className="flex items-center gap-3 mt-1.5">
                <span className="text-[11px] text-ink-muted flex items-center gap-0.5">♡ {p.likes?.length || 0}</span>
                <span className="text-[11px] text-ink-muted flex items-center gap-0.5">💬 {p.comments?.length || 0}</span>
              </div>
            </div>
          ))}
        </div>
      </aside>
    </div>
  )
}