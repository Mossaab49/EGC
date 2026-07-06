import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { loadEnglishDictionary } from '../services/dictionary-service.js'
import * as eventsService from '../services/events-service.js'
import * as membersService from '../services/members-service.js'
import * as minecraftService from '../services/minecraft-service.js'
import * as tournamentsService from '../services/tournaments-service.js'
import * as wordleService from '../services/wordle-service.js'

const AppDataContext = createContext(null)

export function AppDataProvider({ children }) {
  const [members, setMembers] = useState([])
  const [events, setEvents] = useState([])
  const [tournaments, setTournaments] = useState([])
  const [wordBank, setWordBank] = useState([])
  const [minecraftRequests, setMinecraftRequests] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function loadInitialData() {
      const [nextMembers, nextEvents, nextTournaments, nextWordBank, nextMinecraftRequests] = await Promise.all([
        membersService.getMembers(),
        eventsService.getEvents(),
        tournamentsService.getTournaments(),
        wordleService.getWordBank(),
        minecraftService.getRequests(),
      ])

      if (cancelled) return
      setMembers(nextMembers)
      setEvents(nextEvents)
      setTournaments(nextTournaments)
      setWordBank(nextWordBank)
      setMinecraftRequests(nextMinecraftRequests)
      setIsLoading(false)
    }

    loadInitialData()
    return () => { cancelled = true }
  }, [])

  const createMember = useCallback(async (member) => {
    const createdMember = await membersService.createMember(member)
    setMembers((items) => [...items, createdMember])
    return createdMember
  }, [])

  const updateMember = useCallback(async (email, patch) => {
    const updatedMember = await membersService.updateMember(email, patch)
    if (!updatedMember) return null
    setMembers((items) => items.map((item) => item.email.toLowerCase() === email.toLowerCase() ? updatedMember : item))
    return updatedMember
  }, [])

  const deleteMember = useCallback(async (email) => {
    const wasDeleted = await membersService.deleteMember(email)
    if (wasDeleted) setMembers((items) => items.filter((item) => item.email.toLowerCase() !== email.toLowerCase()))
    return wasDeleted
  }, [])

  const createEvent = useCallback(async (event) => {
    const createdEvent = await eventsService.createEvent(event)
    setEvents((items) => [...items, createdEvent])
    return createdEvent
  }, [])

  const updateEvent = useCallback(async (id, patch) => {
    const updatedEvent = await eventsService.updateEvent(id, patch)
    if (!updatedEvent) return null
    setEvents((items) => items.map((item) => item.id === id ? updatedEvent : item))
    return updatedEvent
  }, [])

  const deleteEvent = useCallback(async (id) => {
    const wasDeleted = await eventsService.deleteEvent(id)
    if (wasDeleted) setEvents((items) => items.filter((item) => item.id !== id))
    return wasDeleted
  }, [])

  const openEventSignup = useCallback(async (id) => {
    const nextEvents = await Promise.all(events.map((event) => eventsService.updateEvent(event.id, {
      isSignupOpen: event.id === id && event.status !== 'Passe',
    })))
    const cleanEvents = nextEvents.filter(Boolean)
    setEvents(cleanEvents)
    return cleanEvents.find((event) => event.id === id) || null
  }, [events])

  const createTournament = useCallback(async (tournament) => {
    const createdTournament = await tournamentsService.createTournament(tournament)
    setTournaments((items) => [...items, createdTournament])
    return createdTournament
  }, [])

  const updateTournament = useCallback(async (id, patch) => {
    const updatedTournament = await tournamentsService.updateTournament(id, patch)
    if (!updatedTournament) return null
    setTournaments((items) => items.map((item) => item.id === id ? updatedTournament : item))
    return updatedTournament
  }, [])

  const deleteTournament = useCallback(async (id) => {
    const wasDeleted = await tournamentsService.deleteTournament(id)
    if (wasDeleted) setTournaments((items) => items.filter((item) => item.id !== id))
    return wasDeleted
  }, [])

  const registerToTournament = useCallback(async (id) => {
    const updatedTournament = await tournamentsService.registerToTournament(id)
    if (!updatedTournament) return null
    setTournaments((items) => items.map((item) => item.id === id ? updatedTournament : item))
    return updatedTournament
  }, [])

  const cancelRegistration = useCallback(async (id) => {
    const updatedTournament = await tournamentsService.cancelRegistration(id)
    if (!updatedTournament) return null
    setTournaments((items) => items.map((item) => item.id === id ? updatedTournament : item))
    return updatedTournament
  }, [])

  const addWord = useCallback(async (word) => {
    const nextWordBank = await wordleService.addWord(word)
    setWordBank(nextWordBank)
    return nextWordBank
  }, [])

  const removeWord = useCallback(async (word) => {
    const nextWordBank = await wordleService.removeWord(word)
    setWordBank(nextWordBank)
    return nextWordBank
  }, [])

  const getTodayWord = useCallback(() => wordleService.getTodayWord(), [])
  const submitWordleGuess = useCallback((guess, answer) => wordleService.submitGuess(guess, answer), [])
  const loadEnglishGuessWords = useCallback(() => loadEnglishDictionary(), [])

  const submitMinecraftParticipationRequest = useCallback(async (request) => {
    const createdRequest = await minecraftService.submitParticipationRequest(request)
    setMinecraftRequests((items) => [...items.filter((item) => item.name !== createdRequest.name), createdRequest])
    return createdRequest
  }, [])

  const updateMinecraftRequestStatus = useCallback(async (name, status) => {
    const updatedRequest = await minecraftService.updateRequestStatus(name, status)
    if (!updatedRequest) return null
    setMinecraftRequests((items) => items.map((item) => item.name === name ? updatedRequest : item))
    return updatedRequest
  }, [])

  const value = useMemo(() => ({
    isLoading,
    members,
    createMember,
    updateMember,
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
    submitWordleGuess,
    loadEnglishGuessWords,
    minecraftRequests,
    submitMinecraftParticipationRequest,
    updateMinecraftRequestStatus,
  }), [
    addWord,
    cancelRegistration,
    createEvent,
    createMember,
    createTournament,
    deleteEvent,
    deleteMember,
    deleteTournament,
    events,
    getTodayWord,
    isLoading,
    loadEnglishGuessWords,
    members,
    minecraftRequests,
    openEventSignup,
    registerToTournament,
    removeWord,
    submitMinecraftParticipationRequest,
    submitWordleGuess,
    tournaments,
    updateEvent,
    updateMember,
    updateMinecraftRequestStatus,
    updateTournament,
    wordBank,
  ])

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
}

export function useAppData() {
  const context = useContext(AppDataContext)
  if (!context) {
    throw new Error('useAppData must be used inside AppDataProvider')
  }
  return context
}
