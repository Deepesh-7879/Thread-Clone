import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Avatar from '../components/common/Avatar'
import VerifiedBadge from '../components/common/VerifiedBadge'
import PostCard from '../components/post/PostCard'
import FollowButton from '../components/user/FollowButton'
import UserCard from '../components/user/UserCard'
import Modal from '../components/common/Modal'
import Spinner from '../components/common/Spinner'
import { usePosts } from '../hooks/usePosts'
import { useAuth } from '../hooks/useAuth'
import { userApi } from '../api/userApi'
import { postApi } from '../api/postApi'
import { profile, text, btn, input, misc } from '../styles/common'

export default function ProfilePage() {
  const { username } = useParams()
  const navigate = useNavigate()
  const { user: currentUser, updateUser } = useAuth()
  const { posts, loading, toggleLike, toggleBookmark, sharePost, addComment, deletePost } = usePosts()
  const [profileUser, setProfileUser] = useState(null)
  const [profilePosts, setProfilePosts] = useState([])
  const [profileLoading, setProfileLoading] = useState(true)
  const [editOpen, setEditOpen] = useState(false)
  const [editForm, setEditForm] = useState({ name: currentUser?.name || '', bio: currentUser?.bio || '' })
  const [activeTab, setActiveTab] = useState('posts')
  const [followModal, setFollowModal] = useState({ isOpen: false, type: 'followers' })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [shareCopied, setShareCopied] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    setFollowModal(prev => ({ ...prev, isOpen: false }));
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
    if (!currentUser) {
      navigate('/login')
      return
    }
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

  const handleBookmark = async (postId) => {
    if (!currentUser) {
      navigate('/login')
      return
    }
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
    try {
      if (currentUser) {
        await postApi.bookmarkPost(postId);
      }
    } catch (err) { }
  }

  const handleShare = async (postId) => {
    if (!currentUser) return
    setProfilePosts(prev => prev.map(p => {
      if (p._id === postId) {
        const isShared = p.shares?.includes(currentUser?._id);
        return {
          ...p,
          shares: isShared ? p.shares.filter(id => id !== currentUser?._id) : [...(p.shares || []), currentUser?._id]
        };
      }
      return p;
    }));
    try {
      if (currentUser) {
        await postApi.sharePost(postId);
      }
    } catch (err) { }
  }

  const handleAddComment = async (postId, comment) => {
    if (!currentUser) {
      navigate('/login')
      return
    }
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

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleEditSave = async () => {
    setUploadingImage(true)
    try {
      // Upload profile image if changed
      if (imageFile) {
        const formData = new FormData()
        formData.append('image', imageFile)
        const imgRes = await userApi.uploadProfilePicture(formData)
        const newImageUrl = imgRes.data.profileImage
        updateUser({ name: editForm.name, bio: editForm.bio, profileImage: newImageUrl })
        setProfileUser(prev => ({ ...prev, name: editForm.name, bio: editForm.bio, profileImage: newImageUrl }))
      } else {
        updateUser({ name: editForm.name, bio: editForm.bio })
        setProfileUser(prev => ({ ...prev, name: editForm.name, bio: editForm.bio }))
      }
      await userApi.updateProfile({ name: editForm.name, bio: editForm.bio })
    } catch (err) {
      console.error('Error saving profile:', err)
    } finally {
      setUploadingImage(false)
      setImageFile(null)
      setImagePreview(null)
      setEditOpen(false)
    }
  }

  const handleShareProfile = async () => {
    const profileUrl = `${window.location.origin}/profile/${profileUser?.username}`
    if (navigator.share) {
      try {
        await navigator.share({ title: `${profileUser?.name} on Threadly`, text: `Check out ${profileUser?.name}'s profile on Threadly!`, url: profileUrl })
      } catch (e) { /* user cancelled */ }
    } else {
      await navigator.clipboard.writeText(profileUrl)
      setShareCopied(true)
      setTimeout(() => setShareCopied(false), 2000)
    }
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
        <div className="absolute top-3 right-3 sm:right-4 flex items-center gap-2">
          <button className={btn.secondarySm} onClick={handleShareProfile}
            title="Share Profile" style={{ position: 'relative' }}>
            {shareCopied ? '✓ Copied!' : '↗ Share'}
          </button>
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
          <span className="cursor-pointer hover:opacity-80 transition-opacity" onClick={() => {
            if (!currentUser) {
              navigate('/login')
            } else {
              setFollowModal({ isOpen: true, type: 'following' })
            }
          }}>
            <strong className={text.stat}>{profileUser?.following?.length || 0}</strong> <span className={text.statLabel}>Following</span>
          </span>
          <span className="cursor-pointer hover:opacity-80 transition-opacity" onClick={() => {
            if (!currentUser) {
              navigate('/login')
            } else {
              setFollowModal({ isOpen: true, type: 'followers' })
            }
          }}>
            <strong className={text.stat}>{profileUser?.followers?.length || 0}</strong> <span className={text.statLabel}>Followers</span>
          </span>
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
          onShare={handleShare}
          onAddComment={handleAddComment}
          onDeletePost={isOwn ? handleDeletePost : null} />
      ))}

      {/* Edit Modal */}
      <Modal isOpen={editOpen} onClose={() => { setEditOpen(false); setImageFile(null); setImagePreview(null) }} title="Edit Profile">
        <div className="flex flex-col gap-4">
          {/* Profile Image Upload */}
          <div className="flex flex-col items-center gap-2">
            <div className="relative cursor-pointer group" onClick={() => fileInputRef.current?.click()}>
              {imagePreview ? (
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-accent">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                </div>
              ) : (
                <Avatar user={profileUser} size="xl" />
              )}
              <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white text-lg">📷</span>
              </div>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            <span className="text-xs text-ink-muted">Click to change photo</span>
          </div>
          {[{ key: 'name', label: 'Display Name' }, { key: 'bio', label: 'Bio', multi: true }].map(f => (
            <div key={f.key}>
              <label className={text.label}>{f.label}</label>
              {f.multi
                ? <textarea value={editForm[f.key]} onChange={e => setEditForm(p => ({ ...p, [f.key]: e.target.value }))} rows={3} className={input.textarea} />
                : <input type="text" value={editForm[f.key]} onChange={e => setEditForm(p => ({ ...p, [f.key]: e.target.value }))} className={input.base} />}
            </div>
          ))}
          <div className="flex gap-2.5 mt-1">
            <button className={btn.secondaryLg} onClick={() => { setEditOpen(false); setImageFile(null); setImagePreview(null) }}>Cancel</button>
            <button className={btn.primaryLg} onClick={handleEditSave} disabled={uploadingImage}>
              {uploadingImage ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Followers/Following Modal */}
      <Modal isOpen={followModal.isOpen} onClose={() => setFollowModal(p => ({ ...p, isOpen: false }))} title={followModal.type === 'followers' ? 'Followers' : 'Following'}>
        <div className="flex flex-col max-h-[60vh] overflow-y-auto no-scrollbar">
          {followModal.type === 'followers' ? (
            profileUser?.followers?.length > 0 ? (
              profileUser.followers.map(u => <UserCard key={u._id} user={u} compact />)
            ) : <div className="p-4 text-center text-ink-light">No followers yet</div>
          ) : (
            profileUser?.following?.length > 0 ? (
              profileUser.following.map(u => <UserCard key={u._id} user={u} compact />)
            ) : <div className="p-4 text-center text-ink-light">Not following anyone yet</div>
          )}
        </div>
      </Modal>
    </div>
  )
}
