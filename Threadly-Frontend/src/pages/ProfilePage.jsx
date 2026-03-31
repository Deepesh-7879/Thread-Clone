import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Avatar from '../components/common/Avatar'
import VerifiedBadge from '../components/common/VerifiedBadge'
import PostCard from '../components/post/PostCard'
import FollowButton from '../components/user/FollowButton'
import Modal from '../components/common/Modal'
import Spinner from '../components/common/Spinner'
import { usePosts } from '../hooks/usePosts'
import { useAuth } from '../hooks/useAuth'
import { userApi } from '../api/userApi'
import { postApi } from '../api/postApi'
import { profile, text, btn, input, misc } from '../styles/common'

export default function ProfilePage() {
  const { username } = useParams()
  const { user: currentUser, updateUser } = useAuth()
  const { posts, loading, toggleLike, toggleBookmark, addComment, deletePost } = usePosts()
  const [profileUser, setProfileUser] = useState(null)
  const [profilePosts, setProfilePosts] = useState([])
  const [profileLoading, setProfileLoading] = useState(true)
  const [editOpen, setEditOpen] = useState(false)
  const [editForm, setEditForm] = useState({ name: currentUser?.name || '', bio: currentUser?.bio || '' })
  const [activeTab, setActiveTab] = useState('posts')

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setProfileLoading(true)
        const response = await userApi.getUserByUsername(username)
        const { user } = response.data
        setProfileUser(user)
        
        // Fetch posts by this user
        if (user._id) {
          const postsResponse = await postApi.getUserPosts(user._id)
          const formattedPosts = (postsResponse.data || []).map(p => ({
            ...p,
            userId: {
              _id: p.author?._id || p.author,
              name: p.author?.displayName || p.author?.username || 'Unknown',
              username: p.author?.username,
              verified: p.author?.verified || false,
              profilePicture: p.author?.profilePicture
            }
          }))
          setProfilePosts(formattedPosts)
        }
      } catch (error) {
        console.error('Error fetching profile:', error)
        setProfileUser(null)
        setProfilePosts([])
      } finally {
        setProfileLoading(false)
      }
    }

    if (username) {
      fetchProfile()
    }
  }, [username])

  const isOwn = profileUser?._id === currentUser?._id || profileUser?.username === currentUser?.username
  
  // Use actual profile posts from backend
  const userPosts = profilePosts;

  const handleLike = async (postId) => {
    setProfilePosts(prev => prev.map(p => {
      if (p._id === postId) {
        const isLiked = p.likes?.includes(currentUser?._id);
        return {
          ...p,
          likes: isLiked ? p.likes.filter(id => id !== currentUser?._id) : [...(p.likes || []), currentUser?._id]
        };
      }
      return p;
    }));
    try {
      if (currentUser) {
        await postApi.likePost(postId);
      }
    } catch (err) { }
  }

  const handleBookmark = (postId) => {
    setProfilePosts(prev => prev.map(p => {
      if (p._id === postId) {
        const isBookmarked = p.bookmarks?.includes(currentUser?._id);
        return {
          ...p,
          bookmarks: isBookmarked ? p.bookmarks.filter(id => id !== currentUser?._id) : [...(p.bookmarks || []), currentUser?._id]
        };
      }
      return p;
    }));
  }

  const handleAddComment = async (postId, comment) => {
    const newComment = {
      _id: Date.now().toString(),
      user: { _id: currentUser?._id, name: currentUser?.name || 'User', username: currentUser?.username, profilePicture: currentUser?.profilePicture },
      content: comment,
      createdAt: new Date().toISOString()
    };
    setProfilePosts(prev => prev.map(p => p._id === postId ? { ...p, comments: [...(p.comments || []), newComment] } : p));
    try {
      await postApi.addComment(postId, comment);
    } catch (err) { }
  }

  const handleDeletePost = async (postId) => {
    setProfilePosts(prev => prev.filter(p => p._id !== postId));
    try {
      await postApi.deletePost(postId);
    } catch (err) { }
  }

  const PALETTE = ['#c2603b', '#3b7ac2', '#3b8c5a', '#8c3b7a', '#7a8c3b']
  const bannerColor = PALETTE[(profileUser?._id?.charCodeAt?.(1) || 0) % PALETTE.length]

  const handleEditSave = async () => {
    updateUser({ name: editForm.name, bio: editForm.bio })
    setProfileUser(prev => ({ ...prev, name: editForm.name, bio: editForm.bio }))
    setEditOpen(false)
  }

  if (profileLoading) return <div><Navbar title="Profile" showBack /><Spinner center /></div>
  if (!profileUser) return <div><Navbar title="Profile" showBack /><div className={misc.emptyState}>User not found</div></div>

  return (
    <div>
      <Navbar title={profileUser?.name || 'Profile'} showBack />

      {/* Banner */}
      <div className={profile.banner} style={{ background: `linear-gradient(135deg,${bannerColor}28,${bannerColor}55)` }}>
        <div className="absolute -bottom-7 left-4 sm:left-5">
          <Avatar user={profileUser} size="lg" className="border-[3px] border-cream" />
        </div>
        <div className="absolute top-3 right-3 sm:right-4">
          {isOwn
            ? <button className={btn.secondarySm} onClick={() => setEditOpen(true)}>Edit Profile</button>
            : <FollowButton targetUserId={profileUser?._id} size="sm" />}
        </div>
      </div>

      {/* Info */}
      <div className={profile.info}>
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h2 className="font-display text-[19px] sm:text-[22px] font-bold text-ink flex items-center gap-1.5 flex-wrap">
              {profileUser?.name}
              {profileUser?.verified && <VerifiedBadge />}
            </h2>
            <div className={`${text.username} mb-2`}>@{profileUser?.username}</div>
          </div>
        </div>
        {profileUser?.bio && <p className={`${text.bodyMd} mb-3`}>{profileUser.bio}</p>}
        <div className="flex gap-4 sm:gap-6 flex-wrap">
          <span><strong className={text.stat}>{profileUser?.following?.length || 0}</strong> <span className={text.statLabel}>Following</span></span>
          <span><strong className={text.stat}>{profileUser?.followers?.length || 0}</strong> <span className={text.statLabel}>Followers</span></span>
          <span><strong className={text.stat}>{userPosts.length}</strong> <span className={text.statLabel}>Posts</span></span>
        </div>
      </div>

      {/* Tabs */}
      <div className={profile.tabBar}>
        {['posts', 'likes'].map(tab => (
          <button key={tab} className={activeTab === tab ? profile.tabActive : profile.tab}
            onClick={() => setActiveTab(tab)}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Posts */}
      {profileLoading ? <Spinner center /> : userPosts.length === 0 ? (
        <div className={misc.emptyState}>
          <span className={misc.emptyIcon}>◻</span>
          <span className="text-[15px]">No posts yet</span>
        </div>
      ) : userPosts.map(p => (
        <PostCard key={p._id} post={p}
          onLike={handleLike}
          onBookmark={handleBookmark}
          onAddComment={handleAddComment}
          onDeletePost={isOwn ? handleDeletePost : null} />
      ))}

      {/* Edit Modal */}
      <Modal isOpen={editOpen} onClose={() => setEditOpen(false)} title="Edit Profile">
        <div className="flex flex-col gap-4">
          {[{ key: 'name', label: 'Display Name' }, { key: 'bio', label: 'Bio', multi: true }].map(f => (
            <div key={f.key}>
              <label className={text.label}>{f.label}</label>
              {f.multi
                ? <textarea value={editForm[f.key]} onChange={e => setEditForm(p => ({ ...p, [f.key]: e.target.value }))} rows={3} className={input.textarea} />
                : <input type="text" value={editForm[f.key]} onChange={e => setEditForm(p => ({ ...p, [f.key]: e.target.value }))} className={input.base} />}
            </div>
          ))}
          <div className="flex gap-2.5 mt-1">
            <button className={btn.secondaryLg} onClick={() => setEditOpen(false)}>Cancel</button>
            <button className={btn.primaryLg} onClick={handleEditSave}>Save</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
