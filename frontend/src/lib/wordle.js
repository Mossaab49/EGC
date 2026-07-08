export const fallbackEnglishGuessWords = ['GAME', 'GAMES', 'MATCH', 'ROUND', 'SCORE', 'PLAYER', 'SERVER', 'STREAM']

/**
 * @param {Date=} date
 * @returns {string}
 */
export function getDailyWordKey(date = new Date()) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
}

/**
 * Picks one stable Wordle answer for the current local calendar day.
 *
 * @param {string[]} words
 * @param {Date=} date
 * @returns {string}
 */
export function getDailyWord(words, date = new Date()) {
  const playableWords = words.filter((word) => word.length >= 3)
  if (!playableWords.length) return 'ARENA'

  const dateKey = getDailyWordKey(date)
  const hash = Array.from(dateKey).reduce((total, character) => (
    (total * 31 + character.charCodeAt(0)) >>> 0
  ), 0)

  return playableWords[hash % playableWords.length]
}

export function parseWordList(text) {
  return text
    .split(/\s+/)
    .map((word) => word.trim().toUpperCase())
    .filter((word) => /^[A-Z]+$/.test(word))
}

/**
 * Scores a Wordle guess with duplicate-letter handling:
 * exact matches consume letters first, then misplaced matches consume the
 * remaining counts. This avoids showing duplicated guesses as yellow.
 */
export function scoreGuess(guess, answer) {
  const result = Array.from({ length: answer.length }, () => 'absent delayed')
  const remaining = {}

  for (let index = 0; index < answer.length; index += 1) {
    const answerLetter = answer[index]
    const guessLetter = guess[index]
    if (guessLetter === answerLetter) {
      result[index] = 'correct delayed'
    } else {
      remaining[answerLetter] = (remaining[answerLetter] || 0) + 1
    }
  }

  for (let index = 0; index < answer.length; index += 1) {
    const guessLetter = guess[index]
    if (result[index] === 'correct delayed') continue
    if (remaining[guessLetter] > 0) {
      result[index] = 'present delayed'
      remaining[guessLetter] -= 1
    }
  }

  return result
}

export function buildWordleRows({ guesses, currentGuess, answer, isWon, isLost }) {
  return Array.from({ length: 6 }, (_, index) => {
    if (guesses[index]) return guesses[index]
    if (index === guesses.length && !isWon && !isLost) return currentGuess.padEnd(answer.length, ' ')
    return ' '.repeat(answer.length)
  })
}
