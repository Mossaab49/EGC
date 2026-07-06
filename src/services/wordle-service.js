import { scoreGuess } from '../lib/wordle.js'
import { initialWords } from '../lib/mock-data/index.js'

let wordBank = [...initialWords]

const cloneWordBank = () => [...wordBank]

/**
 * @returns {Promise<string>}
 */
export async function getTodayWord() {
  return Promise.resolve(wordBank[0] || 'ARENA')
}

/**
 * @returns {Promise<string[]>}
 */
export async function getWordBank() {
  return Promise.resolve(cloneWordBank())
}

/**
 * @param {string} word
 * @returns {Promise<string[]>}
 */
export async function addWord(word) {
  const cleanWord = word.trim().toUpperCase()
  if (cleanWord.length >= 3 && !wordBank.includes(cleanWord)) {
    wordBank = [...wordBank, cleanWord]
  }
  return Promise.resolve(cloneWordBank())
}

/**
 * @param {string} word
 * @returns {Promise<string[]>}
 */
export async function removeWord(word) {
  if (wordBank.length > 1) {
    wordBank = wordBank.filter((item) => item !== word)
  }
  return Promise.resolve(cloneWordBank())
}

/**
 * @param {string} guess
 * @param {string} answer
 * @returns {Promise<import('../types/domain.js').WordleAttempt>}
 */
export async function submitGuess(guess, answer) {
  const normalizedGuess = guess.trim().toUpperCase()
  const normalizedAnswer = answer.trim().toUpperCase()
  return Promise.resolve({
    guess: normalizedGuess,
    answer: normalizedAnswer,
    statuses: scoreGuess(normalizedGuess, normalizedAnswer),
    isCorrect: normalizedGuess === normalizedAnswer,
  })
}
