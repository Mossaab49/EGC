import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useAuth } from './AuthContext.jsx'
import { loadEnglishDictionary } from '../services/dictionary-service.js'
import * as eventsService from '../services/events-service.js'
import * as membersService from '../services/members-service.js'
import * as minecraftService from '../services/minecraft-service.js'
import * as rankingService from '../services/ranking-service.js'
import * as tournamentsService from '../services/tournaments-service.js'
import * as wordleService from '../services/wordle-service.js'

const AppDataContext = createContext(null)

export function AppDataProvider({ children }) {
  const { token, user } = useAuth()
  const [members, setMembers] = useState([])
  const [events, setEvents] = useState([])
  const [tournaments, setTournaments] = useState([])
  const [wordBank, setWordBank] = useState([])
  const [minecraftRequests, setMinecraftRequests] = useState([])
  const [rankings, setRankings] = useState(/** @type {import('../types/domain.js').Rankings} */ ({ monthly: [], weekly: [] }))
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function loadInitialData() {
      const [membersResponse, eventsResponse, tournamentsResponse, wordBankResponse, minecraftRequestsResponse, rankingsResponse] = await Promise.all([
        membersService.getMembers(token),
        eventsService.getEvents(),
        tournamentsService.getTournaments(token),
        wordleService.getWordBank(),
        user?.role === 'Admin' ? minecraftService.getRequests(token) : Promise.resolve({ ok: true, data: [], error: null }),
        rankingService.getRankings(),
      ])

      if (cancelled) return
      setMembers(membersResponse.data)
      setEvents(eventsResponse.data)
      setTournaments(tournamentsResponse.data)
      setWordBank(wordBankResponse.data)
      setMinecraftRequests(minecraftRequestsResponse.data)
      setRankings(rankingsResponse.data)
      setIsLoading(false)
    }

    loadInitialData()
    return () => { cancelled = true }
  }, [token, user?.role])

  const createMember = useCallback(async (member) => {
    const { data: createdMember } = await membersService.createMember(member, token)
    setMembers((items) => [...items, createdMember])
    return createdMember
  }, [token])

  const updateMember = useCallback(async (email, patch) => {
    const { data: updatedMember } = await membersService.updateMember(email, patch, token)
    if (!updatedMember) return null
    setMembers((items) => items.map((item) => item.email.toLowerCase() === email.toLowerCase() || item.id === updatedMember.id ? updatedMember : item))
    return updatedMember
  }, [token])

  const resetMemberPassword = useCallback(async (email, password) => {
    const { data: updatedMember } = await membersService.resetMemberPassword(email, password, token)
    if (!updatedMember) return null
    setMembers((items) => items.map((item) => item.email.toLowerCase() === email.toLowerCase() || item.id === updatedMember.id ? updatedMember : item))
    return updatedMember
  }, [token])

  const deleteMember = useCallback(async (email) => {
    const { data: wasDeleted } = await membersService.deleteMember(email, token)
    if (wasDeleted) setMembers((items) => items.filter((item) => item.email.toLowerCase() !== email.toLowerCase()))
    return wasDeleted
  }, [token])

  const createEvent = useCallback(async (event) => {
    const { data: createdEvent } = await eventsService.createEvent(event, token)
    setEvents((items) => [...items, createdEvent])
    return createdEvent
  }, [token])

  const updateEvent = useCallback(async (id, patch) => {
    const { data: updatedEvent } = await eventsService.updateEvent(id, patch, token)
    if (!updatedEvent) return null
    setEvents((items) => items.map((item) => item.id === id ? updatedEvent : item))
    return updatedEvent
  }, [token])

  const deleteEvent = useCallback(async (id) => {
    const { data: wasDeleted } = await eventsService.deleteEvent(id, token)
    if (wasDeleted) setEvents((items) => items.filter((item) => item.id !== id))
    return wasDeleted
  }, [token])

  const openEventSignup = useCallback(async (id) => {
    const { data: updatedEvent } = await eventsService.openEventSignup(id, token)
    if (!updatedEvent) return null
    setEvents((items) => items.map((item) => item.id === id ? updatedEvent : { ...item, isSignupOpen: false }))
    return updatedEvent
  }, [token])

  const createTournament = useCallback(async (tournament) => {
    const { data: createdTournament } = await tournamentsService.createTournament(tournament, token)
    setTournaments((items) => [...items, createdTournament])
    return createdTournament
  }, [token])

  const updateTournament = useCallback(async (id, patch) => {
    const { data: updatedTournament } = await tournamentsService.updateTournament(id, patch, token)
    if (!updatedTournament) return null
    setTournaments((items) => items.map((item) => item.id === id ? updatedTournament : item))
    return updatedTournament
  }, [token])

  const deleteTournament = useCallback(async (id) => {
    const { data: wasDeleted } = await tournamentsService.deleteTournament(id, token)
    if (wasDeleted) setTournaments((items) => items.filter((item) => item.id !== id))
    return wasDeleted
  }, [token])

  const registerToTournament = useCallback(async (id) => {
    const { data: updatedTournament } = await tournamentsService.registerToTournament(id, token)
    if (!updatedTournament) return null
    setTournaments((items) => items.map((item) => item.id === id ? updatedTournament : item))
    return updatedTournament
  }, [token])

  const cancelRegistration = useCallback(async (id) => {
    const { data: updatedTournament } = await tournamentsService.cancelRegistration(id, token)
    if (!updatedTournament) return null
    setTournaments((items) => items.map((item) => item.id === id ? updatedTournament : item))
    return updatedTournament
  }, [token])

  const addWord = useCallback(async (word) => {
    const { data: nextWordBank } = await wordleService.addWord(word)
    setWordBank(nextWordBank)
    return nextWordBank
  }, [])

  const removeWord = useCallback(async (word) => {
    const { data: nextWordBank } = await wordleService.removeWord(word)
    setWordBank(nextWordBank)
    return nextWordBank
  }, [])

  const refreshRankings = useCallback(async () => {
    const { data: nextRankings } = await rankingService.getRankings()
    setRankings(nextRankings)
    return nextRankings
  }, [])

  const getTodayWord = useCallback(async () => {
    const { data } = await wordleService.getTodayWord(token || undefined)
    return data
  }, [token])

  const loadWordleProgress = useCallback(async () => {
    if (!token) {
      throw new Error('Session expiree. Reconnecte-toi.')
    }
    const { data } = await wordleService.getProgress(token)
    return data
  }, [token])

  const submitWordleGuess = useCallback(async (guess, answer) => {
    const { data } = await wordleService.submitGuess(guess, answer, token || undefined)
    if (data?.isCorrect) {
      await refreshRankings()
    }
    return data
  }, [refreshRankings, token])
  const loadEnglishGuessWords = useCallback(() => loadEnglishDictionary(), [])

  const submitMinecraftParticipationRequest = useCallback(async (request) => {
    const { data: createdRequest } = await minecraftService.submitParticipationRequest(request, token)
    setMinecraftRequests((items) => [...items.filter((item) => item.id !== createdRequest.id && item.name.toLowerCase() !== createdRequest.name.toLowerCase()), createdRequest])
    return createdRequest
  }, [token])

  const updateMinecraftRequestStatus = useCallback(async (id, status) => {
    const { data: updatedRequest } = await minecraftService.updateRequestStatus(id, status, token)
    if (!updatedRequest) return null
    setMinecraftRequests((items) => items.map((item) => item.id === id ? updatedRequest : item))
    return updatedRequest
  }, [token])

  const deleteTreatedMinecraftRequests = useCallback(async () => {
    const { data: deletedCount } = await minecraftService.deleteTreatedRequests(token)
    setMinecraftRequests((items) => items.filter((item) => item.status === 'En attente'))
    return deletedCount
  }, [token])

  const value = useMemo(() => ({
    isLoading,
    members,
    createMember,
    updateMember,
    resetMemberPassword,
    deleteMember,
    events,
    createEvent,
    updateEvent,
    deleteEvent,
    openEventSignup,
    tournaments,
    createTournament,
    updateTournament,
    deleteTournament,
    registerToTournament,
    cancelRegistration,
    wordBank,
    addWord,
    removeWord,
    getTodayWord,
    loadWordleProgress,
    submitWordleGuess,
    loadEnglishGuessWords,
    minecraftRequests,
    submitMinecraftParticipationRequest,
    updateMinecraftRequestStatus,
    deleteTreatedMinecraftRequests,
    rankings,
    refreshRankings,
  }), [
    addWord,
    cancelRegistration,
    createEvent,
    createMember,
    createTournament,
    deleteEvent,
    deleteMember,
    deleteTournament,
    deleteTreatedMinecraftRequests,
    events,
    getTodayWord,
    isLoading,
    loadWordleProgress,
    loadEnglishGuessWords,
    members,
    minecraftRequests,
    openEventSignup,
    registerToTournament,
    removeWord,
    rankings,
    refreshRankings,
    submitMinecraftParticipationRequest,
    submitWordleGuess,
    tournaments,
    updateEvent,
    updateMember,
    resetMemberPassword,
    updateMinecraftRequestStatus,
    updateTournament,
    wordBank,
  ])

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
}

/**
 * @returns {import('../types/domain.js').AppDataContextValue}
 */
export function useAppData() {
  const context = useContext(AppDataContext)
  if (!context) {
    throw new Error('useAppData must be used inside AppDataProvider')
  }
  return context
}
