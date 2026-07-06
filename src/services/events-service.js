import { initialEvents } from '../lib/mock-data/index.js'

let events = initialEvents.map((event) => ({ ...event }))

const cloneEvents = () => events.map((event) => ({ ...event }))

/**
 * @returns {Promise<import('../types/domain.js').EventItem[]>}
 */
export async function getEvents() {
  return Promise.resolve(cloneEvents())
}

/**
 * @param {import('../types/domain.js').EventItem} event
 * @returns {Promise<import('../types/domain.js').EventItem>}
 */
export async function createEvent(event) {
  const createdEvent = { ...event }
  events = [...events, createdEvent]
  return Promise.resolve({ ...createdEvent })
}

/**
 * @param {string} id
 * @param {Partial<import('../types/domain.js').EventItem>} patch
 * @returns {Promise<import('../types/domain.js').EventItem | null>}
 */
export async function updateEvent(id, patch) {
  let updatedEvent = null
  events = events.map((event) => {
    if (event.id !== id) return event
    updatedEvent = { ...event, ...patch, id }
    return updatedEvent
  })
  return Promise.resolve(updatedEvent ? { ...updatedEvent } : null)
}

/**
 * @param {string} id
 * @returns {Promise<boolean>}
 */
export async function deleteEvent(id) {
  const previousLength = events.length
  events = events.filter((event) => event.id !== id)
  return Promise.resolve(events.length !== previousLength)
}
