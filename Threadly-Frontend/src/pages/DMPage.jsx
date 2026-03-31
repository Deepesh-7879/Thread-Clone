import { useState, useEffect, useRef, useContext } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { DMContext } from '../context/DMContext'
import { useAuth } from '../hooks/useAuth'
import Avatar from '../components/common/Avatar'
import VerifiedBadge from '../components/common/VerifiedBadge'
import Navbar from '../components/layout/Navbar'

function formatTime(ts) {
  const d = new Date(ts), now = new Date()
  const diff = Math.floor((now - d) / 1000)
  if (diff < 60) return 'now'
  if (diff < 3600) return Math.floor(diff / 60) + 'm'
  if (diff < 86400) return Math.floor(diff / 3600) + 'h'
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

// ── Conversation list panel
function ConvoList({ convos, activeId, onSelect, getUser, currentUserId, unreadCount }) {
  return (
    <div className="w-full md:w-75 lg:w-85 shrink-0 border-r border-cream-border flex flex-col h-full">
      <div className="px-4 py-3.5 border-b border-cream-border flex items-center justify-between">
        <h2 className="font-display text-lg font-bold text-ink">Messages</h2>
        {unreadCount > 0 && (
          <span className="bg-accent text-white text-xs font-bold px-2 py-0.5 rounded-full">{unreadCount}</span>
        )}
      </div>
      <div className="flex-1 overflow-y-auto">
        {convos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2 text-ink-muted">
            <span className="text-4xl opacity-20">✉</span>
            <span className="text-sm">No messages yet</span>
          </div>
        ) : convos.map(c => {
          const other = getUser(c.with)
          const last = c.messages[c.messages.length - 1]
          const unread = c.messages.filter(m => !m.read && m.senderId !== currentUserId).length
          const isActive = c.id === activeId
          return (
            <div key={c.id} onClick={() => onSelect(c.id)}
              className={`flex items-center gap-3 px-4 py-3.5 cursor-pointer border-b border-cream-border transition-colors
                ${isActive ? 'bg-accent-light' : 'hover:bg-cream-dark'}`}>
              <Avatar user={other} size="md" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-[14px] text-ink truncate">{other?.name}</span>
                    {other?.verified && <VerifiedBadge size={12} />}
                  </div>
                  <span className="text-xs text-ink-muted shrink-0">{last ? formatTime(last.ts) : ''}</span>
                </div>
                <div className="flex items-center justify-between gap-1">
                  <p className="text-[13px] text-ink-muted truncate">
                    {last ? (last.senderId === currentUserId ? 'You: ' : '') + last.text : 'Start a conversation'}
                  </p>
                  {unread > 0 && (
                    <span className="bg-accent text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shrink-0">{unread}</span>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Chat window
function ChatWindow({ convo, currentUser, getUser, onSend, onBack }) {
  const [txt, setTxt] = useState('')
  const bottomRef = useRef()
  const other = getUser(convo.with)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [convo.messages])

  const send = () => {
    if (!txt.trim()) return
    onSend(convo.id, currentUser._id, txt.trim())
    setTxt('')
  }

  const handleKey = e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Header */}
      <div className="px-4 py-3 border-b border-cream-border flex items-center gap-3 bg-cream shrink-0">
        <button onClick={onBack}
          className="md:hidden text-ink-muted hover:text-ink border-0 bg-transparent cursor-pointer text-lg mr-1">←</button>
        <Avatar user={other} size="sm" />
        <div>
          <div className="flex items-center gap-1">
            <span className="font-bold text-[15px] text-ink">{other?.name}</span>
            {other?.verified && <VerifiedBadge size={13} />}
          </div>
          <span className="text-xs text-ink-muted">@{other?.username}</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
        {convo.messages.length === 0 && (
          <div className="flex flex-col items-center justify-center flex-1 gap-2 text-ink-muted py-12">
            <Avatar user={other} size="xl" />
            <p className="font-bold text-ink mt-2">{other?.name}</p>
            <p className="text-sm">Send a message to start the conversation</p>
          </div>
        )}
        {convo.messages.map((m, i) => {
          const isMe = m.senderId === currentUser._id
          const showTime = i === 0 || (new Date(m.ts) - new Date(convo.messages[i-1].ts)) > 300000
          return (
            <div key={m.id}>
              {showTime && (
                <div className="text-center text-xs text-ink-muted my-1">{formatTime(m.ts)}</div>
              )}
              <div className={`flex ${isMe ? 'justify-end' : 'justify-start'} items-end gap-2`}>
                {!isMe && <Avatar user={other} size="xs" />}
                
                {isMe && (
                  <span className="text-[10px] text-ink-muted mb-0.5">{m.read ? '✓✓' : '✓'}</span>
                )}
                <div className={`max-w-[70%] sm:max-w-[60%] px-4 py-2.5 rounded-2xl text-[14px] leading-relaxed
                  ${isMe
                    ? 'bg-accent text-white rounded-br-sm'
                    : 'bg-white border border-cream-border text-ink rounded-bl-sm'}`}>
                  {m.text}
                </div>
                
                {isMe && <Avatar user={currentUser} size="xs" />}
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-cream-border bg-cream shrink-0">
        <div className="flex items-end gap-2 bg-cream-dark border border-cream-border rounded-2xl px-4 py-2 focus-within:border-accent transition-colors">
          <textarea value={txt} onChange={e => setTxt(e.target.value)} onKeyDown={handleKey}
            placeholder="Write a message..." rows={1}
            className="flex-1 bg-transparent border-none outline-none text-[14px] text-ink resize-none placeholder:text-ink-muted max-h-24 leading-relaxed" />
          <button onClick={send} disabled={!txt.trim()}
            className="bg-accent hover:bg-accent-hover disabled:bg-sand text-white rounded-xl px-3 py-1.5 text-sm font-bold border-0 cursor-pointer transition-colors shrink-0 disabled:cursor-not-allowed">
            Send
          </button>
        </div>
        <p className="text-[11px] text-ink-muted mt-1.5 px-1">Enter to send · Shift+Enter for new line</p>
      </div>
    </div>
  )
}

// ── New Message modal — pick a user to DM
function NewMessageModal({ onClose, onSelect, users, existingWithIds }) {
  const [q, setQ] = useState('')
  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(q.toLowerCase()) ||
    u.username.toLowerCase().includes(q.toLowerCase())
  )
  return (
    <div className="fixed inset-0 bg-ink/40 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-5"
      onClick={onClose}>
      <div className="bg-cream rounded-t-3xl sm:rounded-3xl w-full sm:max-w-110 border border-cream-border shadow-lg"
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-cream-border">
          <h3 className="font-display text-base font-semibold text-ink">New Message</h3>
          <button onClick={onClose} className="text-ink-muted hover:text-ink border-0 bg-transparent cursor-pointer text-lg">✕</button>
        </div>
        <div className="px-4 py-3">
          <div className="flex items-center gap-2 bg-cream-dark border border-cream-border rounded-xl px-3 py-2 focus-within:border-accent transition-colors">
            <span className="text-ink-muted text-sm">◎</span>
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search people..."
              className="flex-1 bg-transparent border-none outline-none text-[14px] text-ink placeholder:text-ink-muted" autoFocus />
          </div>
        </div>
        <div className="max-h-72 overflow-y-auto pb-4">
          {filtered.map(u => (
            <div key={u._id} onClick={() => onSelect(u._id)}
              className="flex items-center gap-3 px-4 py-3 hover:bg-cream-dark cursor-pointer transition-colors">
              <Avatar user={u} size="md" />
              <div>
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-[14px] text-ink">{u.name}</span>
                  {u.verified && <VerifiedBadge size={12} />}
                  {existingWithIds.includes(u._id) && (
                    <span className="text-[10px] bg-cream-dark text-ink-muted px-1.5 py-0.5 rounded-full ml-1">existing</span>
                  )}
                </div>
                <span className="text-xs text-ink-muted">@{u.username}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Main DM Page
export default function DMPage() {
  const { convos, activeId, setActiveId, getUser, getOrCreate, sendMessage, markRead, unreadCount, friends } = useContext(DMContext)
  const { user } = useAuth()
  const navigate = useNavigate()
  const [showNew, setShowNew] = useState(false)
  const [mobileView, setMobileView] = useState('list') // 'list' | 'chat'

  const activeConvo = convos.find(c => c.id === activeId)

  const handleSelect = (id) => {
    setActiveId(id)
    markRead(id)
    setMobileView('chat')
  }

  const handleNewDM = (userId) => {
    setShowNew(false)
    const id = getOrCreate(userId)
    markRead(id)
    setMobileView('chat')
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Mobile: show navbar only on list view */}
      {mobileView === 'list' && (
        <div className="md:hidden">
          <Navbar title="Messages" showBack />
        </div>
      )}

      <div className="flex flex-1 min-h-0">
        {/* Convo list — full screen on mobile when mobileView=list */}
        <div className={`${mobileView === 'list' ? 'flex' : 'hidden'} md:flex flex-col w-full md:w-75 lg:w-85 shrink-0 border-r border-cream-border h-full`}>
          <div className="px-4 py-3.5 border-b border-cream-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button onClick={() => navigate(-1)}
                className="hidden md:block text-ink-muted hover:text-ink border-0 bg-transparent cursor-pointer text-lg mr-1">←</button>
              <h2 className="font-display text-lg font-bold text-ink">Messages</h2>
              {unreadCount > 0 && (
                <span className="bg-accent text-white text-xs font-bold px-2 py-0.5 rounded-full">{unreadCount}</span>
              )}
            </div>
            <button onClick={() => setShowNew(true)}
              className="bg-accent hover:bg-accent-hover text-white text-lg font-bold w-9 h-9 rounded-xl flex items-center justify-center border-0 cursor-pointer transition-colors"
              title="New message">✏</button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {convos.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-2 text-ink-muted">
                <span className="text-4xl opacity-20">✉</span>
                <span className="text-sm">No messages yet</span>
                <button onClick={() => setShowNew(true)}
                  className="mt-2 bg-accent hover:bg-accent-hover text-white text-sm font-bold px-4 py-2 rounded-xl border-0 cursor-pointer transition-colors">
                  Start a conversation
                </button>
              </div>
            ) : convos.map(c => {
              const other = getUser(c.with)
              const last = c.messages[c.messages.length - 1]
              const unread = c.messages.filter(m => !m.read && m.senderId !== user?._id).length
              const isActive = c.id === activeId
              return (
                <div key={c.id} onClick={() => handleSelect(c.id)}
                  className={`flex items-center gap-3 px-4 py-3.5 cursor-pointer border-b border-cream-border transition-colors
                    ${isActive ? 'bg-accent-light' : 'hover:bg-cream-dark'}`}>
                  <Avatar user={other} size="md" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <div className="flex items-center gap-1 min-w-0">
                        <span className={`text-[14px] truncate ${unread ? 'font-bold text-ink' : 'font-semibold text-ink'}`}>{other?.name}</span>
                        {other?.verified && <VerifiedBadge size={12} />}
                      </div>
                      <span className="text-xs text-ink-muted shrink-0">{last ? formatTime(last.ts) : ''}</span>
                    </div>
                    <div className="flex items-center justify-between gap-1">
                      <p className={`text-[13px] truncate ${unread ? 'font-semibold text-ink' : 'text-ink-muted'}`}>
                        {last ? (last.senderId === user?._id ? 'You: ' : '') + last.text : 'Start a conversation'}
                      </p>
                      {unread > 0 && (
                        <span className="bg-accent text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shrink-0">{unread}</span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Chat window */}
        <div className={`${mobileView === 'chat' ? 'flex' : 'hidden'} md:flex flex-1 flex-col min-h-0`}>
          {activeConvo ? (
            <ChatWindow
              convo={activeConvo}
              currentUser={user}
              getUser={getUser}
              onSend={sendMessage}
              onBack={() => setMobileView('list')} />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 text-ink-muted p-8 text-center">
              <span className="text-6xl opacity-10">✉</span>
              <h3 className="font-display text-xl font-semibold text-ink">Your Messages</h3>
              <p className="text-sm max-w-xs">Select a conversation or start a new one</p>
              <button onClick={() => setShowNew(true)}
                className="mt-2 bg-accent hover:bg-accent-hover text-white font-bold px-5 py-2.5 rounded-xl border-0 cursor-pointer transition-colors text-sm">
                New Message
              </button>
            </div>
          )}
        </div>
      </div>

      {/* New message modal */}
      {showNew && (
        <NewMessageModal
          onClose={() => setShowNew(false)}
          onSelect={handleNewDM}
          users={friends}
          existingWithIds={convos.map(c => c.with)} />
      )}
    </div>
  )
}