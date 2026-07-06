import { initialEvents } from '../lib/mock-data/index.js'
import { successResponse } from './service-response.js'

let events = initialEvents.map((event) => ({ ...event }))

/**
 * @param {import('../types/domain.js').EventItem} event
 * @returns {import('../types/domain.js').EventItem}
 */
const cloneEvent = (event) => ({ ...event })

const cloneEvents = () => events.map((event) => ({ ...event }))

/**
 * @returns {Promise<import('../types/domain.js').ApiResponse<import('../types/domain.js').EventItem[]>>}
 */
export async function getEvents() {
  return Promise.resolve(successResponse(cloneEvents()))
}

/**
 * @param {import('../types/domain.js').EventItem} event
 * @returns {Promise<import('../types/domain.js').ApiResponse<import('../types/domain.js').EventItem>>}
 */
export async function createEvent(event) {
  const createdEvent = { ...event }
  events = [...events, createdEvent]
  return Promise.resolve(successResponse({ ...createdEvent }))
}

/**
 * @param {string} id
 * @param {Partial<import('../types/domain.js').EventItem>} patch
 * @returns {Promise<import('../types/domain.js').ApiResponse<import('../types/domain.js').EventItem | null>>}
 */
export async function updateEvent(id, patch) {
  /** @type {import('../types/domain.js').EventItem | null} */
  let updatedEvent = null
  events = events.map((event) => {
    if (event.id !== id) return event
    updatedEvent = { ...event, ...patch, id }
    return updatedEvent
  })
  return Promise.resolve(successResponse(updatedEvent ? cloneEvent(updatedEvent) : null))
}

/**
 * @param {string} id
 * @returns {Promise<import('../types/domain.js').ApiResponse<boolean>>}
 */
export async function deleteEvent(id) {
  const previousLength = events.length
  events = events.filter((event) => event.id !== id)
  return Promise.resolve(successResponse(events.length !== previousLength))
}
