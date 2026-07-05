export const fallbackEnglishGuessWords = ['GAME', 'GAMES', 'MATCH', 'ROUND', 'SCORE', 'PLAYER', 'SERVER', 'STREAM']

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
