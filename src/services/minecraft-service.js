import { initialMinecraftRequests } from '../lib/mock-data/index.js'
import { successResponse } from './service-response.js'

let requests = initialMinecraftRequests.map((request) => ({ ...request }))

/**
 * @param {import('../types/domain.js').MinecraftRequest} request
 * @returns {import('../types/domain.js').MinecraftRequest}
 */
const cloneRequest = (request) => ({ ...request })

const cloneRequests = () => requests.map((request) => ({ ...request }))

/**
 * @param {Omit<import('../types/domain.js').MinecraftRequest, 'status'>} request
 * @returns {Promise<import('../types/domain.js').ApiResponse<import('../types/domain.js').MinecraftRequest>>}
 */
export async function submitParticipationRequest(request) {
  const createdRequest = /** @type {import('../types/domain.js').MinecraftRequest} */ ({ ...request, status: 'En attente' })
  requests = [...requests.filter((item) => item.name !== createdRequest.name), createdRequest]
  return Promise.resolve(successResponse(cloneRequest(createdRequest)))
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
  /** @type {import('../types/domain.js').MinecraftRequest | null} */
  let updatedRequest = null
  requests = requests.map((request) => {
    if (request.name !== name) return request
    updatedRequest = { ...request, status }
    return updatedRequest
  })
  return Promise.resolve(successResponse(updatedRequest ? cloneRequest(updatedRequest) : null))
}
