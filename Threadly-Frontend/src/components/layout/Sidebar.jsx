import { useNavigate, useLocation } from 'react-router-dom'
import { useContext } from 'react'
import Avatar from '../common/Avatar'
import { useAuth } from '../../hooks/useAuth'
import { DMContext } from '../../context/DMContext'       
import { nav, text, btn } from '../../styles/common'

const NAV = [
  {path:'/',         icon:'⌂', label:'Home'},
  {path:'/explore',  icon:'⌕', label:'Explore'},
  {path:'/notifications', icon:'✦ ', label:'Notifications'},
{path:'/messages', icon:'✉︎', label:'Messages'},
  {path:'/bookmarks',icon:'☆', label:'Bookmarks'},
  {path:'/profile/me',icon:'☻',label:'Profile'},
]

export default function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()
  const { unreadCount } = useContext(DMContext)         

  const isActive = p =>
    p === '/profile/me' ? location.pathname.startsWith('/profile')
    : p === '/' ? location.pathname === '/'
    : location.pathname.startsWith(p)

  const go = p => p === '/profile/me' ? navigate(`/profile/${user?.username}`) : navigate(p)

  return (
    <>
      {/* Desktop & tablet sidebar */}
      <aside className={nav.sidebar}>
        <div className="px-2 lg:px-3 pb-4 sm:pb-5 cursor-pointer" onClick={() => navigate('/')}>
          <span className="font-display font-bold text-accent tracking-tight">
            <span className="hidden lg:inline text-2xl">thread<span className="text-bark">ly</span></span>
            <span className="lg:hidden text-xl">T</span>
          </span>
        </div>

        <nav className="flex flex-col gap-0.5 flex-1">
          {NAV.map(item => (
            <button key={item.path} onClick={() => go(item.path)}
              className={`${isActive(item.path) ? nav.itemActive : nav.item} relative`}>
              <span className="text-[20px] w-6 text-center leading-none shrink-0">{item.icon}</span>
              <span className="hidden lg:inline text-[15px]">{item.label}</span>
              {/* Unread badge on Messages */}
              {item.path === '/messages' && unreadCount > 0 && (
                <span className="absolute top-1.5 left-7 lg:static lg:ml-auto bg-accent text-white text-[10px] font-bold min-w-4.5 h-4.5 rounded-full flex items-center justify-center px-1">
                  {unreadCount}
                </span>
              )}
              {isActive(item.path) && item.path !== '/messages' && <span className={nav.dot} />}
            </button>
          ))}
        </nav>

        <button className={btn.sidebarPost} onClick={() => navigate('/')}>
          <span className="lg:hidden text-xl leading-none">+</span>
          <span className="hidden lg:inline text-[15px]">+ New Post</span>
        </button>

        {user && (
          <div className="flex items-center gap-2 px-2 py-2.5 rounded-xl hover:bg-cream-dark transition-colors cursor-pointer mt-2 border-t border-cream-border pt-3"
            onClick={() => navigate(`/profile/${user.username}`)}>
            <Avatar user={user} size="sm" />
            <div className="flex-1 min-w-0 hidden lg:block">
              <div className="font-bold text-[13px] text-ink truncate">{user.name}</div>
              <div className="text-xs text-ink-muted">@{user.username}</div>
            </div>
            <button onClick={e => { e.stopPropagation(); logout() }}
              className="hidden lg:block text-ink-muted hover:text-red-600 transition-colors text-sm border-0 bg-transparent cursor-pointer"
              title="Logout">⏻</button>
          </div>
        )}
      </aside>

      {/* Mobile bottom nav */}
      <nav className={nav.mobileBar}>
        {NAV.map(item => (
          <button key={item.path} onClick={() => go(item.path)}
            className={`relative flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl border-0 cursor-pointer transition-all min-w-11
              ${isActive(item.path) ? 'text-accent' : 'text-ink-muted'}`}>
            <span className="text-[22px] leading-none">{item.icon}</span>
            <span className="text-[10px] font-medium">{item.label}</span>
            {item.path === '/messages' && unreadCount > 0 && (
              <span className="absolute top-0.5 right-1 bg-accent text-white text-[9px] font-bold min-w-3.5 h-3.5 rounded-full flex items-center justify-center px-0.5">
                {unreadCount}
              </span>
            )}
          </button>
        ))}
      </nav>
    </>
  )
}