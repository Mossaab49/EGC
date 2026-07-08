const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api/v1'

/**
 * @param {unknown} value
 * @returns {value is Record<string, unknown>}
 */
function isRecord(value) {
  return typeof value === 'object' && value !== null
}

/**
 * @param {unknown} payload
 * @returns {string}
 */
function getErrorMessage(payload) {
  if (!isRecord(payload)) {
    return 'Une erreur est survenue.'
  }

  if (typeof payload.error === 'string') {
    return payload.error
  }

  if (Array.isArray(payload.message)) {
    return payload.message.join(' ')
  }

  if (typeof payload.message === 'string') {
    return payload.message
  }

  return 'Une erreur est survenue.'
}

/**
 * @typedef {object} RequestOptions
 * @property {string=} method
 * @property {unknown=} body
 * @property {string=} token
 */

/**
 * Sends a JSON request to the backend API and unwraps the shared ApiResponse shape.
 *
 * @template T
 * @param {string} path
 * @param {RequestOptions=} options
 * @returns {Promise<T>}
 */
export async function apiRequest(path, options = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  })

  const payload = await response.json().catch(() => null)
  if (!response.ok || (isRecord(payload) && payload.ok === false)) {
    throw new Error(getErrorMessage(payload))
  }

  return isRecord(payload) && 'data' in payload ? /** @type {T} */ (payload.data) : /** @type {T} */ (payload)
}
