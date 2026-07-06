import React, { createContext, useContext, useMemo, useState } from 'react'

/** @type {import('react').Context<import('../types/domain.js').AuthContextValue | null>} */
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  /** @type {[import('../types/domain.js').AuthUser | null, import('react').Dispatch<import('react').SetStateAction<import('../types/domain.js').AuthUser | null>>]} */
  const [user, setUser] = useState(null)

  /** @type {import('../types/domain.js').AuthContextValue} */
  const value = useMemo(() => ({
    user,
    login: (profile) => setUser(profile),
    logout: () => setUser(null),
  }), [user])

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
