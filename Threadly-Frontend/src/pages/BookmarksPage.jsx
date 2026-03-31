import Navbar from '../components/layout/Navbar'
import PostCard from '../components/post/PostCard'
import Spinner from '../components/common/Spinner'
import { usePosts } from '../hooks/usePosts'
import { useAuth } from '../hooks/useAuth'
import { misc } from '../styles/common'

export default function BookmarksPage() {
  const { user } = useAuth()
  const { posts, loading, toggleLike, toggleBookmark, addComment, addReply, deletePost } = usePosts()
  const bookmarked = posts.filter(p => p.bookmarks?.includes(user?._id))

  return (
    <div>
      <Navbar title="Bookmarks" />
      {loading ? <Spinner center /> : bookmarked.length === 0 ? (
        <div className={misc.emptyState}>
          <span className={misc.emptyIcon}>◇</span>
          <span className="text-[15px] sm:text-[16px] font-semibold text-ink">No bookmarks yet</span>
          <span className="text-[13px] sm:text-[14px]">Save posts you want to come back to</span>
        </div>
      ) : bookmarked.map(p => (
        <PostCard key={p._id} post={p}
          onLike={id => toggleLike(id, user?._id)}
          onBookmark={id => toggleBookmark(id, user?._id)}
          onAddComment={(postId, comment) => addComment(postId, comment, user)} 
          onAddReply={(postId, commentId, txt) => addReply(postId, commentId, txt, user)}
          onDeletePost={deletePost} />
      ))}
    </div>
  )
}
