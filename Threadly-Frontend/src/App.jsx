import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { DMProvider } from './context/DMContext'           
import ProtectedRoute from './components/layout/ProtectedRoute'
import Sidebar from './components/layout/Sidebar'
import LoginPage          from './pages/LoginPage'
import RegisterPage       from './pages/RegisterPage'
import HomePage           from './pages/HomePage'
import ProfilePage        from './pages/ProfilePage'
import PostDetailPage     from './pages/PostDetailPage'
import SearchPage         from './pages/SearchPage'
import NotificationsPage  from './pages/NotificationsPage'
import BookmarksPage      from './pages/BookmarksPage'
import DMPage             from './pages/DMPage'             

import { useAuth }        from './hooks/useAuth'
import Spinner            from './components/common/Spinner'

function AppLayout() {
  const { pathname } = useLocation()
  const { loading } = useAuth()
  const isAuth = ['/login', '/register'].includes(pathname)
  const isDM = pathname.startsWith('/messages')           

  if (loading) return <Spinner center />

  if (isAuth) return (
    <Routes>
      <Route path="/login"    element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  )

  // DM page gets full screen — no sidebar wrapper
  if (isDM) return (                                      
    <ProtectedRoute>
      <div className="max-w-300 mx-auto h-screen flex">
        <Sidebar />
        <div className="flex-1 min-w-0">
          <Routes>
            <Route path="/messages" element={<DMPage />} />
          </Routes>
        </div>
      </div>
    </ProtectedRoute>
  )

  return (
    <div className="flex max-w-300 mx-auto min-h-screen">
      <Sidebar />
      <main className="flex-1 min-w-0 pb-16 md:pb-0">
        <Routes>
          <Route path="/"                  element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path="/explore"           element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />
          <Route path="/notifications"     element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
          <Route path="/bookmarks"         element={<ProtectedRoute><BookmarksPage /></ProtectedRoute>} />
          <Route path="/profile/:username" element={<ProfilePage />} />
          <Route path="/post/:id"          element={<ProtectedRoute><PostDetailPage /></ProtectedRoute>} />
          <Route path="*"                  element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <DMProvider>                                         
        <HashRouter>
          <AppLayout />
        </HashRouter>
      </DMProvider>                                 
    </AuthProvider>
  )
}