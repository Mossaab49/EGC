import { calculateWordleWinPoints } from './wordle.service'

describe('calculateWordleWinPoints', () => {
  it('returns the maximum score at the start of the Wordle day', () => {
    expect(calculateWordleWinPoints(new Date(2026, 6, 10, 0, 0, 0))).toBe(10)
  })

  it('decreases the score as more time passes since the word changed', () => {
    expect(calculateWordleWinPoints(new Date(2026, 6, 10, 4, 0, 0))).toBe(9)
    expect(calculateWordleWinPoints(new Date(2026, 6, 10, 12, 0, 0))).toBe(7)
  })

  it('keeps the minimum score at five points near the next word change', () => {
    expect(calculateWordleWinPoints(new Date(2026, 6, 10, 20, 0, 0))).toBe(5)
    expect(calculateWordleWinPoints(new Date(2026, 6, 10, 23, 59, 59))).toBe(5)
  })
})
