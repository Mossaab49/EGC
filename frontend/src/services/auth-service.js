import { apiRequest } from './api-client.js'

/**
 * @param {'ADMIN' | 'MEMBER'} role
 * @returns {import('../types/domain.js').UserRole}
 */
function toUiRole(role) {
  return role === 'ADMIN' ? 'Admin' : 'Membre'
}

/**
 * @param {import('../types/domain.js').BackendAuthUser} user
 * @returns {import('../types/domain.js').AuthUser}
 */
function toAuthUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: toUiRole(user.role),
    mustChangePassword: user.mustChangePassword,
  }
}

/**
 * Authenticates a user against the NestJS API.
 *
 * @param {string} email
 * @param {string} password
 * @returns {Promise<import('../types/domain.js').AuthSession>}
 */
export async function login(email, password) {
  const data = await apiRequest('/auth/login', {
    method: 'POST',
    body: { email, password },
  })

  return {
    accessToken: data.accessToken,
    user: toAuthUser(data.user),
  }
}

/**
 * Fetches the current authenticated profile.
 *
 * @param {string} token
 * @returns {Promise<import('../types/domain.js').AuthUser>}
 */
export async function getMe(token) {
  const user = await apiRequest('/auth/me', { token })
  return toAuthUser(user)
}

/**
 * Changes the current user's password.
 *
 * @param {string} token
 * @param {string} currentPassword
 * @param {string} newPassword
 * @returns {Promise<import('../types/domain.js').AuthUser>}
 */
export async function changePassword(token, currentPassword, newPassword) {
  const user = await apiRequest('/auth/change-password', {
    method: 'POST',
    token,
    body: { currentPassword, newPassword },
  })

  return toAuthUser(user)
}
