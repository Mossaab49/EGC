import React, { createContext, useContext, useMemo, useState } from 'react'
import { changePassword as changePasswordRequest, login as loginRequest } from '../services/auth-service.js'

const AuthContext = createContext(null)
const AUTH_STORAGE_KEY = 'egc.auth.session'

/**
 * @returns {import('../types/domain.js').AuthSession | null}
 */
function readStoredSession() {
  try {
    const stored = window.localStorage.getItem(AUTH_STORAGE_KEY)
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const storedSession = readStoredSession()
  const [user, setUser] = useState(/** @type {import('../types/domain.js').AuthUser | null} */ (storedSession?.user || null))
  const [token, setToken] = useState(/** @type {string | null} */ (storedSession?.accessToken || null))

  /** @type {import('../types/domain.js').AuthContextValue} */
  const value = useMemo(() => ({
    user,
    token,
    login: async (email, password) => {
      const session = await loginRequest(email, password)
      setUser(session.user)
      setToken(session.accessToken)
      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session))
      return session.user
    },
    changePassword: async (currentPassword, newPassword) => {
      if (!token) {
        throw new Error('Session expiree. Reconnecte-toi.')
      }
      const updatedUser = await changePasswordRequest(token, currentPassword, newPassword)
      setUser(updatedUser)
      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ accessToken: token, user: updatedUser }))
      return updatedUser
    },
    logout: () => {
      setUser(null)
      setToken(null)
      window.localStorage.removeItem(AUTH_STORAGE_KEY)
    },
  }), [token, user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * @returns {import('../types/domain.js').AuthContextValue}
 */
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }
  return context
}
