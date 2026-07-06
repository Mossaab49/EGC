import { initialMembers } from '../lib/mock-data/index.js'
import { successResponse } from './service-response.js'

let members = initialMembers.map((member) => ({ ...member }))

/**
 * @param {import('../types/domain.js').Member} member
 * @returns {import('../types/domain.js').Member}
 */
const cloneMember = (member) => ({ ...member })

const cloneMembers = () => members.map((member) => ({ ...member }))

/**
 * @returns {Promise<import('../types/domain.js').ApiResponse<import('../types/domain.js').Member[]>>}
 */
export async function getMembers() {
  return Promise.resolve(successResponse(cloneMembers()))
}

/**
 * @param {import('../types/domain.js').Member} member
 * @returns {Promise<import('../types/domain.js').ApiResponse<import('../types/domain.js').Member>>}
 */
export async function createMember(member) {
  const createdMember = { ...member }
  members = [...members, createdMember]
  return Promise.resolve(successResponse({ ...createdMember }))
}

/**
 * @param {string} email
 * @param {Partial<import('../types/domain.js').Member>} patch
 * @returns {Promise<import('../types/domain.js').ApiResponse<import('../types/domain.js').Member | null>>}
 */
export async function updateMember(email, patch) {
  const normalizedEmail = email.toLowerCase()
  /** @type {import('../types/domain.js').Member | null} */
  let updatedMember = null
  members = members.map((member) => {
    if (member.email.toLowerCase() !== normalizedEmail) return member
    updatedMember = { ...member, ...patch, email: patch.email || member.email }
    return updatedMember
  })
  return Promise.resolve(successResponse(updatedMember ? cloneMember(updatedMember) : null))
}

/**
 * @param {string} email
 * @returns {Promise<import('../types/domain.js').ApiResponse<boolean>>}
 */
export async function deleteMember(email) {
  const normalizedEmail = email.toLowerCase()
  const previousLength = members.length
  members = members.filter((member) => member.email.toLowerCase() !== normalizedEmail)
  return Promise.resolve(successResponse(members.length !== previousLength))
}
