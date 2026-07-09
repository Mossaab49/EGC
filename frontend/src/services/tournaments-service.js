import { apiRequest } from './api-client.js'
import { successResponse } from './service-response.js'

/**
 * @param {import('../types/domain.js').Tournament} tournament
 * @returns {import('../types/domain.js').Tournament}
 */
const cloneTournament = (tournament) => ({ ...tournament })

/**
 * @param {string | null=} token
 * @returns {Promise<import('../types/domain.js').ApiResponse<import('../types/domain.js').Tournament[]>>}
 */
export async function getTournaments(token = null) {
  const tournaments = await apiRequest(token ? '/tournaments/mine' : '/tournaments', {
    token: token || undefined,
  })
  return successResponse(tournaments.map(cloneTournament))
}

/**
 * @param {import('../types/domain.js').Tournament} tournament
 * @param {string | null=} token
 * @returns {Promise<import('../types/domain.js').ApiResponse<import('../types/domain.js').Tournament>>}
 */
export async function createTournament(tournament, token = null) {
  if (!token) throw new Error('Session admin expiree. Reconnecte-toi.')

  const createdTournament = await apiRequest('/tournaments', {
    method: 'POST',
    token,
    body: tournament,
  })

  return successResponse(cloneTournament(createdTournament))
}

/**
 * @param {string} id
 * @param {Partial<import('../types/domain.js').Tournament>} patch
 * @param {string | null=} token
 * @returns {Promise<import('../types/domain.js').ApiResponse<import('../types/domain.js').Tournament | null>>}
 */
export async function updateTournament(id, patch, token = null) {
  if (!token) throw new Error('Session admin expiree. Reconnecte-toi.')

  const updatedTournament = await apiRequest(`/tournaments/${id}`, {
    method: 'PATCH',
    token,
    body: patch,
  })

  return successResponse(cloneTournament(updatedTournament))
}

/**
 * @param {string} id
 * @param {string | null=} token
 * @returns {Promise<import('../types/domain.js').ApiResponse<import('../types/domain.js').Tournament | null>>}
 */
export async function registerToTournament(id, token = null) {
  if (!token) throw new Error('Connecte-toi avant de t inscrire au tournoi.')

  const updatedTournament = await apiRequest(`/tournaments/${id}/register`, {
    method: 'POST',
    token,
  })

  return successResponse(cloneTournament(updatedTournament))
}

/**
 * @param {string} id
 * @param {string | null=} token
 * @returns {Promise<import('../types/domain.js').ApiResponse<import('../types/domain.js').Tournament | null>>}
 */
export async function cancelRegistration(id, token = null) {
  if (!token) throw new Error('Connecte-toi avant d annuler ton inscription.')

  const updatedTournament = await apiRequest(`/tournaments/${id}/cancel`, {
    method: 'POST',
    token,
  })

  return successResponse(cloneTournament(updatedTournament))
}

/**
 * @param {string} id
 * @param {string | null=} token
 * @returns {Promise<import('../types/domain.js').ApiResponse<boolean>>}
 */
export async function deleteTournament(id, token = null) {
  if (!token) throw new Error('Session admin expiree. Reconnecte-toi.')

  await apiRequest(`/tournaments/${id}`, { method: 'DELETE', token })
  return successResponse(true)
}
