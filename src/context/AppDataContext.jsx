import React, { createContext, useContext, useMemo, useState } from 'react'
import {
  initialEvents,
  initialMembers,
  initialMinecraftRequests,
  initialTournaments,
  initialWords,
} from '../lib/mock-data/index.js'

const AppDataContext = createContext(null)

export function AppDataProvider({ children }) {
  const [members, setMembers] = useState(initialMembers)
  const [events, setEvents] = useState(initialEvents)
  const [tournaments, setTournaments] = useState(initialTournaments)
  const [wordBank, setWordBank] = useState(initialWords)
  const [minecraftRequests, setMinecraftRequests] = useState(initialMinecraftRequests)

  const value = useMemo(() => ({
    members,
    setMembers,
    events,
    setEvents,
    tournaments,
    setTournaments,
    wordBank,
    setWordBank,
    minecraftRequests,
    setMinecraftRequests,
  }), [events, members, minecraftRequests, tournaments, wordBank])

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
}

export function useAppData() {
  const context = useContext(AppDataContext)
  if (!context) {
    throw new Error('useAppData must be used inside AppDataProvider')
  }
  return context
}
