import { initialTournaments } from '../lib/mock-data/index.js'
import { successResponse } from './service-response.js'

let tournaments = initialTournaments.map((tournament) => ({ ...tournament }))

/**
 * @param {import('../types/domain.js').Tournament} tournament
 * @returns {import('../types/domain.js').Tournament}
 */
const cloneTournament = (tournament) => ({ ...tournament })

const cloneTournaments = () => tournaments.map((tournament) => ({ ...tournament }))

/**
 * @returns {Promise<import('../types/domain.js').ApiResponse<import('../types/domain.js').Tournament[]>>}
 */
export async function getTournaments() {
  return Promise.resolve(successResponse(cloneTournaments()))
}

/**
 * @param {import('../types/domain.js').Tournament} tournament
 * @returns {Promise<import('../types/domain.js').ApiResponse<import('../types/domain.js').Tournament>>}
 */
export async function createTournament(tournament) {
  const createdTournament = { ...tournament }
  tournaments = [...tournaments, createdTournament]
  return Promise.resolve(successResponse({ ...createdTournament }))
}

/**
 * @param {string} id
 * @param {Partial<import('../types/domain.js').Tournament>} patch
 * @returns {Promise<import('../types/domain.js').ApiResponse<import('../types/domain.js').Tournament | null>>}
 */
export async function updateTournament(id, patch) {
  /** @type {import('../types/domain.js').Tournament | null} */
  let updatedTournament = null
  tournaments = tournaments.map((tournament) => {
    if (tournament.id !== id) return tournament
    updatedTournament = { ...tournament, ...patch, id }
    return updatedTournament
  })
  return Promise.resolve(successResponse(updatedTournament ? cloneTournament(updatedTournament) : null))
}

/**
 * @param {string} id
 * @returns {Promise<import('../types/domain.js').ApiResponse<import('../types/domain.js').Tournament | null>>}
 */
export async function registerToTournament(id) {
  const target = tournaments.find((tournament) => tournament.id === id)
  if (!target || target.registered >= target.capacity) return Promise.resolve(successResponse(null))
  return updateTournament(id, { registered: target.registered + 1 })
}

/**
 * @param {string} id
 * @returns {Promise<import('../types/domain.js').ApiResponse<import('../types/domain.js').Tournament | null>>}
 */
export async function cancelRegistration(id) {
  const target = tournaments.find((tournament) => tournament.id === id)
  if (!target || target.registered <= 0) return Promise.resolve(successResponse(null))
  return updateTournament(id, { registered: target.registered - 1 })
}

/**
 * @param {string} id
 * @returns {Promise<import('../types/domain.js').ApiResponse<boolean>>}
 */
export async function deleteTournament(id) {
  const previousLength = tournaments.length
  tournaments = tournaments.filter((tournament) => tournament.id !== id)
  return Promise.resolve(successResponse(tournaments.length !== previousLength))
}
