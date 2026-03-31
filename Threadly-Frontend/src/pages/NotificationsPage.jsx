import { useState, useEffect } from 'react'
import Navbar from '../components/layout/Navbar'
import Spinner from '../components/common/Spinner'
import { card } from '../styles/common'
import { notificationApi } from '../api/notificationApi'

const TYPE_BG = { like:'bg-red-50', follow:'bg-accent-light', comment:'bg-brand-blue-light', message:'bg-cream-dark' }
const TYPE_ICON = { like:'❤️', follow:'👤', comment:'💬', message:'✉️' }

function formatTime(ts) {
  const d = new Date(ts), now = new Date()
  const diff = Math.floor((now - d) / 1000)
  if (diff < 60) return 'now'
  if (diff < 3600) return Math.floor(diff / 60) + 'm'
  if (diff < 86400) return Math.floor(diff / 3600) + 'h'
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAndMarkRead = async () => {
      try {
        setLoading(true)
        const res = await notificationApi.getNotifications()
        setNotifications(res.data)
        
        // Mark as read immediately when viewed locally as well
        const hasUnread = res.data.some(n => !n.read)
        if (hasUnread) {
          await notificationApi.markReadAll()
        }
      } catch (err) {
        console.error("Failed to fetch notifications", err)
      } finally {
        setLoading(false)
      }
    }
    fetchAndMarkRead()
  }, [])

  const getNotifText = (n) => {
    const name = n.senderId?.displayName || n.senderId?.username || 'Someone'
    switch(n.type) {
      case 'like': return `${name} liked your post`
      case 'follow': return `${name} started following you`
      case 'comment': return `${name} replied to your post`
      case 'message': return `${name} sent you a message`
      default: return `${name} interacted with you`
    }
  }

  return (
    <div>
      <Navbar title="Notifications" />
      {loading ? (
        <Spinner center />
      ) : notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-ink-muted">
          <span className="text-5xl opacity-20">🔔</span>
          <p className="text-sm">No notifications yet</p>
        </div>
      ) : (
        notifications.map(n => (
          <div key={n._id} className={n.read ? card.notifRead : card.notifUnread}>
            <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-base sm:text-lg shrink-0 ${TYPE_BG[n.type] || 'bg-cream-dark'}`}>
              {TYPE_ICON[n.type] || '🔔'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start gap-2">
                <p className="text-[13px] sm:text-[14px] text-ink leading-snug font-medium">
                  {getNotifText(n)}
                </p>
                <span className="text-xs text-ink-muted shrink-0">{formatTime(n.createdAt)}</span>
              </div>
              {n.text && <p className="text-[12px] sm:text-[13px] text-ink-muted mt-0.5 truncate italic">{n.text}</p>}
            </div>
            {!n.read && <div className="w-2 h-2 rounded-full bg-accent shrink-0 mt-1" />}
          </div>
        ))
      )}
    </div>
  )
}
