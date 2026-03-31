import { createContext, useState, useCallback, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { userApi } from '../api/userApi'
import { messageApi } from '../api/messageApi'

export const DMContext = createContext(null)

export function DMProvider({ children }) {
  const { user } = useAuth()
  const [convos, setConvos] = useState([])
  const [activeId, setActiveId] = useState(null)
  const [friends, setFriends] = useState([])
  
  useEffect(() => {
    const fetchData = async () => {
      if (!user?._id) return
      try {
        const [profileRes, convosRes] = await Promise.all([
          userApi.getUserByUsername(user.username),
          messageApi.getConversations()
        ])
        
        const profile = profileRes.data?.user
        
        if (profile) {
          const uniqueFriends = new Map()
          if (Array.isArray(profile.followers)) {
             profile.followers.forEach(f => {
               if (typeof f === 'object' && f._id) uniqueFriends.set(f._id, { ...f, name: f.displayName || f.name || f.username || 'Unknown' })
             })
          }
          if (Array.isArray(profile.following)) {
             profile.following.forEach(f => {
               if (typeof f === 'object' && f._id) uniqueFriends.set(f._id, { ...f, name: f.displayName || f.name || f.username || 'Unknown' })
             })
          }
          setFriends(Array.from(uniqueFriends.values()))
        }

        if (convosRes.data) {
          setConvos(convosRes.data)
        }
      } catch (error) {
        console.error("Failed to fetch DM data", error)
      }
    }
    fetchData()
  }, [user])

  const getUser = (id) => friends.find(u => u._id === id) || { _id: id, name: 'Unknown User', username: 'unknown' }

  const getOrCreate = useCallback((withUserId) => {
    const existing = convos.find(c => c.with === withUserId)
    if (existing) { setActiveId(existing.id); return existing.id }
    
    // For new conversations, we use the other user's ID as the convo ID
    // so it matches the backend pattern where `with` and `id` are the other user's ID
    const newConvo = { id: withUserId, with: withUserId, messages: [] }
    setConvos(prev => [...prev, newConvo])
    setActiveId(newConvo.id)
    return newConvo.id
  }, [convos])

  const sendMessage = useCallback(async (convoId, senderId, text) => {
    // optimistic update
    const tempId = 'm' + Date.now()
    setConvos(prev => prev.map(c =>
      c.id !== convoId ? c : {
        ...c,
        messages: [...c.messages, {
          id: tempId, senderId, text,
          ts: new Date().toISOString(), read: false
        }]
      }
    ))

    try {
      const res = await messageApi.sendMessage(convoId, text)
      // update with actual DB payload
      setConvos(prev => prev.map(c =>
        c.id !== convoId ? c : {
          ...c,
          messages: c.messages.map(m => m.id === tempId ? { ...m, id: res.data.id, ts: res.data.ts } : m)
        }
      ))
    } catch (err) {
      console.error("Failed to send message", err)
    }
  }, [])

  const markRead = useCallback(async (convoId) => {
    // Optimistic UI update
    setConvos(prev => prev.map(c =>
      c.id !== convoId ? c : {
        ...c, messages: c.messages.map(m => m.senderId !== user?._id ? { ...m, read: true } : m)
      }
    ))
    
    // API request
    try {
      await messageApi.markRead(convoId)
    } catch (err) {
      console.error("Failed to mark read", err)
    }
  }, [user])

  const unreadCount = convos.reduce((acc, c) =>
    acc + c.messages.filter(m => m.read === false && m.senderId !== user?._id).length, 0)

  return (
    <DMContext.Provider value={{ convos, activeId, setActiveId, getUser, getOrCreate, sendMessage, markRead, unreadCount, friends }}>
      {children}
    </DMContext.Provider>
  )
}