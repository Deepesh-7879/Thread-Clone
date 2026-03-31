import { useState } from 'react'
import { post as postCls } from '../../styles/common'
function ActionBtn({ icon, activeIcon, count, active, onClick, activeColor, title }) {
  const [anim, setAnim] = useState(false)
  const handle = e => { e.stopPropagation(); setAnim(true); setTimeout(()=>setAnim(false),400); onClick() }
  return (
    <button onClick={handle} title={title} className={postCls.actionBtn}
      style={{color:active?activeColor:undefined}}
      onMouseEnter={e=>{e.currentTarget.style.color=activeColor;e.currentTarget.style.backgroundColor=activeColor+'14'}}
      onMouseLeave={e=>{e.currentTarget.style.color=active?activeColor:'';e.currentTarget.style.backgroundColor=''}}>
      <span style={{fontSize:17,display:'inline-block',animation:anim&&active?'heartPop 0.4s ease':undefined}}>{active&&activeIcon?activeIcon:icon}</span>
      {count!=null&&<span>{count>999?`${(count/1000).toFixed(1)}k`:count}</span>}
    </button>
  )
}
export default function PostActions({ post, currentUserId, onLike, onComment, onBookmark }) {
  const liked = post.likes?.includes(currentUserId)
  const bookmarked = post.bookmarks?.includes(currentUserId)
  return (
    <div className="flex items-center gap-1 mt-2.5">
      <ActionBtn icon="💬" count={post.comments?.length||0} active={false} onClick={onComment} activeColor="#3b7ac2" title="Comment"/>
      <ActionBtn icon="🤍" activeIcon="❤️" count={post.likes?.length||0} active={liked} onClick={()=>onLike(post._id)} activeColor="#e05577" title="Like"/>
      <ActionBtn icon="🔖" activeIcon="🔖" count={null} active={bookmarked} onClick={()=>onBookmark(post._id)} activeColor="#c2603b" title="Bookmark"/>
      <ActionBtn icon="↗" count={null} active={false} onClick={()=>{}} activeColor="#3b8c5a" title="Share"/>
    </div>
  )
}
