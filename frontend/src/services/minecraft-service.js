import { apiRequest } from './api-client.js'
import { successResponse } from './service-response.js'

/**
 * @param {import('../types/domain.js').MinecraftRequest} request
 * @returns {import('../types/domain.js').MinecraftRequest}
 */
const cloneRequest = (request) => ({ ...request })

/**
 * @param {Omit<import('../types/domain.js').MinecraftRequest, 'id' | 'status' | 'createdAt' | 'updatedAt'>} request
 * @param {string | null=} token
 * @returns {Promise<import('../types/domain.js').ApiResponse<import('../types/domain.js').MinecraftRequest>>}
 */
export async function submitParticipationRequest(request, token = null) {
  if (!token) throw new Error('Connecte-toi pour envoyer une demande Minecraft.')

  const createdRequest = await apiRequest('/minecraft/requests', {
    method: 'POST',
    token,
    body: request,
  })

  return successResponse(cloneRequest(createdRequest))
}

/**
 * @param {string | null=} token
 * @returns {Promise<import('../types/domain.js').ApiResponse<import('../types/domain.js').MinecraftRequest[]>>}
 */
export async function getRequests(token = null) {
  if (!token) return successResponse([])

  const requests = await apiRequest('/minecraft/requests', { token })
  return successResponse(requests.map(cloneRequest))
}

/**
 * @param {string} id
 * @param {import('../types/domain.js').RequestStatus} status
 * @param {string | null=} token
 * @returns {Promise<import('../types/domain.js').ApiResponse<import('../types/domain.js').MinecraftRequest | null>>}
 */
export async function updateRequestStatus(id, status, token = null) {
  if (!token) throw new Error('Session admin expiree. Reconnecte-toi.')

  const updatedRequest = await apiRequest(`/minecraft/requests/${id}/status`, {
    method: 'PATCH',
    token,
    body: { status },
  })

  return successResponse(cloneRequest(updatedRequest))
}

/**
 * @param {string | null=} token
 * @returns {Promise<import('../types/domain.js').ApiResponse<number>>}
 */
export async function deleteTreatedRequests(token = null) {
  if (!token) throw new Error('Session admin expiree. Reconnecte-toi.')

  const result = await apiRequest('/minecraft/requests/treated', {
    method: 'DELETE',
    token,
  })

  return successResponse(result.deleted || 0)
}
