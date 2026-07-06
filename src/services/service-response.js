/**
 * Builds a consistent service success response.
 *
 * @template T
 * @param {T} data
 * @returns {import('../types/domain.js').ApiResponse<T>}
 */
export function successResponse(data) {
  return { ok: true, data, error: null }
}
