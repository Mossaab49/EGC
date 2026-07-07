import { apiRequest } from './api-client.js'
import { successResponse } from './service-response.js'

/**
 * @param {import('../types/domain.js').EventItem} event
 * @returns {import('../types/domain.js').EventItem}
 */
const cloneEvent = (event) => ({ ...event })

/**
 * @returns {Promise<import('../types/domain.js').ApiResponse<import('../types/domain.js').EventItem[]>>}
 */
export async function getEvents() {
  const events = await apiRequest('/events')
  return successResponse(events.map(cloneEvent))
}

/**
 * @param {import('../types/domain.js').EventItem} event
 * @param {string | null=} token
 * @returns {Promise<import('../types/domain.js').ApiResponse<import('../types/domain.js').EventItem>>}
 */
export async function createEvent(event, token = null) {
  if (!token) throw new Error('Session admin expiree. Reconnecte-toi.')

  const createdEvent = await apiRequest('/events', {
    method: 'POST',
    token,
    body: event,
  })

  return successResponse(cloneEvent(createdEvent))
}

/**
 * @param {string} id
 * @param {Partial<import('../types/domain.js').EventItem>} patch
 * @param {string | null=} token
 * @returns {Promise<import('../types/domain.js').ApiResponse<import('../types/domain.js').EventItem | null>>}
 */
export async function updateEvent(id, patch, token = null) {
  if (!token) throw new Error('Session admin expiree. Reconnecte-toi.')

  const updatedEvent = await apiRequest(`/events/${id}`, {
    method: 'PATCH',
    token,
    body: patch,
  })

  return successResponse(cloneEvent(updatedEvent))
}

/**
 * @param {string} id
 * @param {string | null=} token
 * @returns {Promise<import('../types/domain.js').ApiResponse<import('../types/domain.js').EventItem | null>>}
 */
export async function openEventSignup(id, token = null) {
  if (!token) throw new Error('Session admin expiree. Reconnecte-toi.')

  const updatedEvent = await apiRequest(`/events/${id}/open-signup`, {
    method: 'PATCH',
    token,
  })

  return successResponse(cloneEvent(updatedEvent))
}

/**
 * @param {string} id
 * @param {string | null=} token
 * @returns {Promise<import('../types/domain.js').ApiResponse<boolean>>}
 */
export async function deleteEvent(id, token = null) {
  if (!token) throw new Error('Session admin expiree. Reconnecte-toi.')

  await apiRequest(`/events/${id}`, { method: 'DELETE', token })
  return successResponse(true)
}
