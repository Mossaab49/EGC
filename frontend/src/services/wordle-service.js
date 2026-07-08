import { getDailyWord, scoreGuess } from '../lib/wordle.js'
import { initialWords } from '../lib/mock-data/index.js'
import { apiRequest } from './api-client.js'
import { successResponse } from './service-response.js'

let wordBank = [...initialWords]

const cloneWordBank = () => [...wordBank]

/**
 * @param {string=} token
 * @returns {Promise<import('../types/domain.js').ApiResponse<string>>}
 */
export async function getTodayWord(token) {
  if (token) {
    const data = await apiRequest('/wordle/today', { token })
    return successResponse(/** @type {string} */ (data))
  }

  return Promise.resolve(successResponse(getDailyWord(wordBank)))
}

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
 * @returns {Promise<import('../types/domain.js').ApiResponse<string[]>>}
 */
export async function addWord(word) {
  const cleanWord = word.trim().toUpperCase()
  try {
    const data = await apiRequest('/wordle/words', { method: 'POST', body: { word: cleanWord } })
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
 * @param {string} answer
 * @param {string=} token
 * @returns {Promise<import('../types/domain.js').ApiResponse<import('../types/domain.js').WordleAttempt | import('../types/domain.js').WordleProgress>>}
 */
export async function submitGuess(guess, answer, token) {
  const normalizedGuess = guess.trim().toUpperCase()
  const normalizedAnswer = answer.trim().toUpperCase()

  if (token) {
    const data = await apiRequest('/wordle/guess', { method: 'POST', token, body: { guess: normalizedGuess } })
    return successResponse(/** @type {import('../types/domain.js').WordleProgress} */ (data))
  }

  const statuses = scoreGuess(normalizedGuess, normalizedAnswer).map((status) => status.split(' ')[0])
  return Promise.resolve(successResponse({
    guess: normalizedGuess,
    answer: normalizedAnswer,
    statuses: /** @type {import('../types/domain.js').WordleLetterStatus[]} */ (statuses),
    isCorrect: normalizedGuess === normalizedAnswer,
  }))
}
