import { initialWords } from '../lib/mock-data/index.js'
import { apiRequest } from './api-client.js'
import { successResponse } from './service-response.js'

let wordBank = [...initialWords]

const cloneWordBank = () => [...wordBank]

/**
 * @returns {Promise<import('../types/domain.js').ApiResponse<string[]>>}
 */
export async function getWordBank() {
  try {
    const data = await apiRequest('/wordle/words')
    wordBank = /** @type {string[]} */ (data)
  } catch {
    wordBank = cloneWordBank()
  }

  return successResponse(cloneWordBank())
}

/**
 * @param {string} word
 * @param {string=} token
 * @returns {Promise<import('../types/domain.js').ApiResponse<string[]>>}
 */
export async function addWord(word, token) {
  const cleanWord = word.trim().toUpperCase()
  try {
    const data = await apiRequest('/wordle/words', { method: 'POST', token, body: { word: cleanWord } })
    wordBank = /** @type {string[]} */ (data)
  } catch {
    if (cleanWord.length >= 3 && !wordBank.includes(cleanWord)) {
      wordBank = [...wordBank, cleanWord]
    }
  }
  return successResponse(cloneWordBank())
}

/**
 * @param {string} word
 * @returns {Promise<import('../types/domain.js').ApiResponse<string[]>>}
 */
export async function removeWord(word) {
  if (wordBank.length > 1) {
    wordBank = wordBank.filter((item) => item !== word)
  }
  return Promise.resolve(successResponse(cloneWordBank()))
}

/**
 * @param {string} token
 * @returns {Promise<import('../types/domain.js').ApiResponse<import('../types/domain.js').WordleProgress>>}
 */
export async function getProgress(token) {
  const data = await apiRequest('/wordle/progress', { token })
  return successResponse(/** @type {import('../types/domain.js').WordleProgress} */ (data))
}

/**
 * @param {string} guess
 * @param {string=} token
 * @returns {Promise<import('../types/domain.js').ApiResponse<import('../types/domain.js').WordleAttempt | import('../types/domain.js').WordleProgress>>}
 */
export async function submitGuess(guess, token) {
  const normalizedGuess = guess.trim().toUpperCase()

  if (!token) {
    throw new Error('Session expiree. Reconnecte-toi.')
  }

  const data = await apiRequest('/wordle/guess', { method: 'POST', token, body: { guess: normalizedGuess } })
  return successResponse(/** @type {import('../types/domain.js').WordleProgress} */ (data))
}
