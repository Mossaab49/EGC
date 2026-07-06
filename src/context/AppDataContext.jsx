import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { loadEnglishDictionary } from '../services/dictionary-service.js'
import * as eventsService from '../services/events-service.js'
import * as membersService from '../services/members-service.js'
import * as minecraftService from '../services/minecraft-service.js'
import * as tournamentsService from '../services/tournaments-service.js'
import * as wordleService from '../services/wordle-service.js'

/** @type {import('react').Context<import('../types/domain.js').AppDataContextValue | null>} */
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
      const [membersResponse, eventsResponse, tournamentsResponse, wordBankResponse, minecraftRequestsResponse] = await Promise.all([
        membersService.getMembers(),
        eventsService.getEvents(),
        tournamentsService.getTournaments(),
        wordleService.getWordBank(),
        minecraftService.getRequests(),
      ])

      if (cancelled) return
      setMembers(membersResponse.data)
      setEvents(eventsResponse.data)
      setTournaments(tournamentsResponse.data)
      setWordBank(wordBankResponse.data)
      setMinecraftRequests(minecraftRequestsResponse.data)
      setIsLoading(false)
    }

    loadInitialData()
    return () => { cancelled = true }
  }, [])

  const createMember = useCallback(async (member) => {
    const { data: createdMember } = await membersService.createMember(member)
    setMembers((items) => [...items, createdMember])
    return createdMember
  }, [])

  const updateMember = useCallback(async (email, patch) => {
    const { data: updatedMember } = await membersService.updateMember(email, patch)
    if (!updatedMember) return null
    setMembers((items) => items.map((item) => item.email.toLowerCase() === email.toLowerCase() ? updatedMember : item))
    return updatedMember
  }, [])

  const deleteMember = useCallback(async (email) => {
    const { data: wasDeleted } = await membersService.deleteMember(email)
    if (wasDeleted) setMembers((items) => items.filter((item) => item.email.toLowerCase() !== email.toLowerCase()))
    return wasDeleted
  }, [])

  const createEvent = useCallback(async (event) => {
    const { data: createdEvent } = await eventsService.createEvent(event)
    setEvents((items) => [...items, createdEvent])
    return createdEvent
  }, [])

  const updateEvent = useCallback(async (id, patch) => {
    const { data: updatedEvent } = await eventsService.updateEvent(id, patch)
    if (!updatedEvent) return null
    setEvents((items) => items.map((item) => item.id === id ? updatedEvent : item))
    return updatedEvent
  }, [])

  const deleteEvent = useCallback(async (id) => {
    const { data: wasDeleted } = await eventsService.deleteEvent(id)
    if (wasDeleted) setEvents((items) => items.filter((item) => item.id !== id))
    return wasDeleted
  }, [])

  const openEventSignup = useCallback(async (id) => {
    const responses = await Promise.all(events.map((event) => eventsService.updateEvent(event.id, {
      isSignupOpen: event.id === id && event.status !== 'Passe',
    })))
    const cleanEvents = responses.map((response) => response.data).filter(Boolean)
    setEvents(cleanEvents)
    return cleanEvents.find((event) => event.id === id) || null
  }, [events])

  const createTournament = useCallback(async (tournament) => {
    const { data: createdTournament } = await tournamentsService.createTournament(tournament)
    setTournaments((items) => [...items, createdTournament])
    return createdTournament
  }, [])

  const updateTournament = useCallback(async (id, patch) => {
    const { data: updatedTournament } = await tournamentsService.updateTournament(id, patch)
    if (!updatedTournament) return null
    setTournaments((items) => items.map((item) => item.id === id ? updatedTournament : item))
    return updatedTournament
  }, [])

  const deleteTournament = useCallback(async (id) => {
    const { data: wasDeleted } = await tournamentsService.deleteTournament(id)
    if (wasDeleted) setTournaments((items) => items.filter((item) => item.id !== id))
    return wasDeleted
  }, [])

  const registerToTournament = useCallback(async (id) => {
    const { data: updatedTournament } = await tournamentsService.registerToTournament(id)
    if (!updatedTournament) return null
    setTournaments((items) => items.map((item) => item.id === id ? updatedTournament : item))
    return updatedTournament
  }, [])

  const cancelRegistration = useCallback(async (id) => {
    const { data: updatedTournament } = await tournamentsService.cancelRegistration(id)
    if (!updatedTournament) return null
    setTournaments((items) => items.map((item) => item.id === id ? updatedTournament : item))
    return updatedTournament
  }, [])

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

  const getTodayWord = useCallback(async () => {
    const { data } = await wordleService.getTodayWord()
    return data
  }, [])
  const submitWordleGuess = useCallback(async (guess, answer) => {
    const { data } = await wordleService.submitGuess(guess, answer)
    return data
  }, [])
  const loadEnglishGuessWords = useCallback(() => loadEnglishDictionary(), [])

  const submitMinecraftParticipationRequest = useCallback(async (request) => {
    const { data: createdRequest } = await minecraftService.submitParticipationRequest(request)
    setMinecraftRequests((items) => [...items.filter((item) => item.name !== createdRequest.name), createdRequest])
    return createdRequest
  }, [])

  const updateMinecraftRequestStatus = useCallback(async (name, status) => {
    const { data: updatedRequest } = await minecraftService.updateRequestStatus(name, status)
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
