import { createContext, useState, useEffect } from 'react'
import { authApi } from '../api/authApi'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('threadly_token')
    if (token) {
      // Try to get current user info
      authApi.getMe()
        .then(response => {
          setUser(response.data)
        })
        .catch(() => {
          // Token invalid, remove it
          localStorage.removeItem('threadly_token')
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    try {
      const response = await authApi.login(email, password)
      const { user, token } = response.data

      // Store token in localStorage
      localStorage.setItem('threadly_token', token)
      setUser(user)
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed')
    }
  }

  const register = async (name, username, email, password) => {
    try {
      const response = await authApi.register(name, username, email, password)
      // Registration successful, but user needs to login
      return { success: true, message: response.data.message }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Registration failed')
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('threadly_token')
  }

  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates }
    setUser(updatedUser)
    localStorage.setItem('threadly_user', JSON.stringify(updatedUser))
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}
