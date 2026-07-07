import { apiRequest } from './api-client.js'
import { successResponse } from './service-response.js'

const DEFAULT_TEMPORARY_PASSWORD = 'EgcTemp12345'

/** @type {import('../types/domain.js').Member[]} */
let membersCache = []

/**
 * @param {import('../types/domain.js').Member} member
 * @returns {import('../types/domain.js').Member}
 */
const cloneMember = (member) => ({ ...member })

/**
 * @param {string} email
 * @returns {import('../types/domain.js').Member | null}
 */
function findCachedMember(email) {
  const normalizedEmail = email.toLowerCase()
  return membersCache.find((member) => member.email.toLowerCase() === normalizedEmail) || null
}

/**
 * @param {Partial<import('../types/domain.js').Member>} patch
 * @returns {Partial<import('../types/domain.js').Member>}
 */
function toUserPatch(patch) {
  const { password, passwordUpdatedAt, mustChangePassword, id, ...userPatch } = patch
  return userPatch
}

/**
 * @param {string | null=} token
 * @returns {Promise<import('../types/domain.js').ApiResponse<import('../types/domain.js').Member[]>>}
 */
export async function getMembers(token = null) {
  if (!token) {
    membersCache = []
    return successResponse([])
  }

  const members = await apiRequest('/users', { token })
  membersCache = members.map(cloneMember)
  return successResponse(membersCache.map(cloneMember))
}

/**
 * @param {import('../types/domain.js').Member} member
 * @param {string | null=} token
 * @returns {Promise<import('../types/domain.js').ApiResponse<import('../types/domain.js').Member>>}
 */
export async function createMember(member, token = null) {
  if (!token) throw new Error('Session admin expiree. Reconnecte-toi.')

  const createdMember = await apiRequest('/users', {
    method: 'POST',
    token,
    body: {
      name: member.name,
      email: member.email,
      role: member.role,
      password: member.password || DEFAULT_TEMPORARY_PASSWORD,
    },
  })

  membersCache = [...membersCache, cloneMember(createdMember)]
  return successResponse(cloneMember(createdMember))
}

/**
 * @param {string} email
 * @param {Partial<import('../types/domain.js').Member>} patch
 * @param {string | null=} token
 * @returns {Promise<import('../types/domain.js').ApiResponse<import('../types/domain.js').Member | null>>}
 */
export async function updateMember(email, patch, token = null) {
  if (!token) throw new Error('Session admin expiree. Reconnecte-toi.')

  const member = findCachedMember(email)
  if (!member?.id) return successResponse(null)

  const updatedMember = await apiRequest(`/users/${member.id}`, {
    method: 'PATCH',
    token,
    body: toUserPatch(patch),
  })

  membersCache = membersCache.map((item) => item.id === updatedMember.id ? cloneMember(updatedMember) : item)
  return successResponse(cloneMember(updatedMember))
}

/**
 * @param {string} email
 * @param {string} password
 * @param {string | null=} token
 * @returns {Promise<import('../types/domain.js').ApiResponse<import('../types/domain.js').Member | null>>}
 */
export async function resetMemberPassword(email, password, token = null) {
  if (!token) throw new Error('Session admin expiree. Reconnecte-toi.')

  const member = findCachedMember(email)
  if (!member?.id) return successResponse(null)

  const response = await apiRequest(`/users/${member.id}/password`, {
    method: 'PATCH',
    token,
    body: { password },
  })

  const updatedMember = response.user
  membersCache = membersCache.map((item) => item.id === updatedMember.id ? cloneMember(updatedMember) : item)
  return successResponse(cloneMember(updatedMember))
}

/**
 * @param {string} email
 * @param {string | null=} token
 * @returns {Promise<import('../types/domain.js').ApiResponse<boolean>>}
 */
export async function deleteMember(email, token = null) {
  if (!token) throw new Error('Session admin expiree. Reconnecte-toi.')

  const member = findCachedMember(email)
  if (!member?.id) return successResponse(false)

  await apiRequest(`/users/${member.id}`, { method: 'DELETE', token })
  membersCache = membersCache.filter((item) => item.id !== member.id)
  return successResponse(true)
}
