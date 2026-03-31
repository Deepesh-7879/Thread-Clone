import { useMemo } from 'react'
import Navbar from '../components/layout/Navbar'
import CreatePostForm from '../components/post/CreatePostForm'
import PostCard from '../components/post/PostCard'
import Spinner from '../components/common/Spinner'
import UserCard from '../components/user/UserCard'
import { usePosts } from '../hooks/usePosts'
import { useAuth } from '../hooks/useAuth'
import { card, input, text } from '../styles/common'

// ── Full pool — backend will replace this with real API data
const ALL_USERS = [
  { _id:'u2', name:'Priya Nair',   username:'priyanair',  bio:'UI/UX Designer',         verified:false, followers:[], following:[] },
  { _id:'u3', name:'Rahul Mehta',  username:'rahulmehta', bio:'Backend engineer',        verified:true,  followers:[], following:[] },
  { _id:'u4', name:'Sneha Iyer',   username:'snehaiyer',  bio:'ML Engineer',             verified:false, followers:[], following:[] },
  { _id:'u5', name:'Dev Kapoor',   username:'devkapoor',  bio:'Startup founder',         verified:true,  followers:[], following:[] },
  { _id:'u6', name:'Ananya Rao',   username:'ananyarao',  bio:'Open source contributor', verified:false, followers:[], following:[] },
  { _id:'u7', name:'Karan Mehta',  username:'karanm',     bio:'React developer',         verified:true,  followers:[], following:[] },
]

const ALL_TRENDING = [
  { tag:'#ReactJS',      count:'12.4k posts' },
  { tag:'#MongoDB',      count:'8.1k posts'  },
  { tag:'#OpenSource',   count:'22k posts'   },
  { tag:'#WebDev',       count:'45k posts'   },
  { tag:'#NodeJS',       count:'9.3k posts'  },
  { tag:'#TailwindCSS',  count:'6.1k posts'  },
  { tag:'#TypeScript',   count:'18k posts'   },
  { tag:'#SystemDesign', count:'5.7k posts'  },
  { tag:'#AI',           count:'31k posts'   },
  { tag:'#DevOps',       count:'4.2k posts'  },
]

// Shuffle array and pick first n items
function pickRandom(arr, n) {
  return [...arr].sort(() => Math.random() - 0.5).slice(0, n)
}

export default function HomePage() {
  const { user } = useAuth()
  const { posts, loading, createPost, toggleLike, toggleBookmark, addComment, deletePost } = usePosts()

  // Re-randomized on every mount (every login / page refresh)
  const suggestedUsers = useMemo(() => pickRandom(ALL_USERS, 3), [])
  const trendingTopics = useMemo(() => pickRandom(ALL_TRENDING, 4), [])

  const handleCreatePost = async (content, image) => {
    if (user) {
      createPost(content, image, user)
    }
  }

  return (
    <div className="flex min-h-screen">
      <div className="flex-1 min-w-0 border-r border-cream-border">
        <Navbar title="Home" />
        <CreatePostForm onPost={handleCreatePost} />
        {loading ? <Spinner center /> : posts.map((p, i) => (
          <div key={p._id} style={{ animation: `fadeUp 0.3s ease ${i * 0.05}s both` }}>
            <PostCard post={p}
              onLike={id => toggleLike(id, user?._id)}
              onBookmark={id => toggleBookmark(id, user?._id)}
              onAddComment={(postId, comment) => addComment(postId, comment, user)}
              onDeletePost={deletePost} />
          </div>
        ))}
      </div>

      <aside className="hidden xl:flex w-75 shrink-0 p-5 flex-col gap-5">
        <div className={input.searchWrapper}>
          <span className="text-ink-muted text-sm">◎</span>
          <input placeholder="Search Threadly" className={input.search} />
        </div>
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
            <h3 className={text.h3}>Trending</h3>
          </div>
          {trendingTopics.map((t, i) => (
            <div key={i} className="px-4 py-2.5 hover:bg-cream-dark transition-colors cursor-pointer border-b border-cream-border last:border-0">
              <div className="font-bold text-[14px] text-accent">{t.tag}</div>
              <div className={text.metaSm}>{t.count}</div>
            </div>
          ))}
        </div>
      </aside>
    </div>
  )
}