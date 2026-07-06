import { initialMinecraftRequests } from '../lib/mock-data/index.js'
import { successResponse } from './service-response.js'

let requests = initialMinecraftRequests.map((request) => ({ ...request }))

const cloneRequests = () => requests.map((request) => ({ ...request }))

/**
 * @param {Omit<import('../types/domain.js').MinecraftRequest, 'status'>} request
 * @returns {Promise<import('../types/domain.js').ApiResponse<import('../types/domain.js').MinecraftRequest>>}
 */
export async function submitParticipationRequest(request) {
  const createdRequest = { ...request, status: 'En attente' }
  requests = [...requests.filter((item) => item.name !== createdRequest.name), createdRequest]
  return Promise.resolve(successResponse({ ...createdRequest }))
}

/**
 * @returns {Promise<import('../types/domain.js').ApiResponse<import('../types/domain.js').MinecraftRequest[]>>}
 */
export async function getRequests() {
  return Promise.resolve(successResponse(cloneRequests()))
}

/**
 * @param {string} name
 * @param {import('../types/domain.js').RequestStatus} status
 * @returns {Promise<import('../types/domain.js').ApiResponse<import('../types/domain.js').MinecraftRequest | null>>}
 */
export async function updateRequestStatus(name, status) {
  let updatedRequest = null
  requests = requests.map((request) => {
    if (request.name !== name) return request
    updatedRequest = { ...request, status }
    return updatedRequest
  })
  return Promise.resolve(successResponse(updatedRequest ? { ...updatedRequest } : null))
}
