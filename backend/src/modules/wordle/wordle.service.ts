import { BadRequestException, ConflictException, Injectable } from '@nestjs/common'
import { WordleAttempt } from '@prisma/client'
import { PrismaService } from '../../database/prisma.service'
import { AddWordDto } from './dto/add-word.dto'
import { SubmitGuessDto } from './dto/submit-guess.dto'

const FALLBACK_WORDS = ['ARENA', 'PIXEL', 'SQUAD', 'GAMER', 'CLASH', 'LEVEL']
const MAX_ATTEMPTS = 6
const BASE_WIN_POINTS = 5
const MAX_ELAPSED_TIME_BONUS_POINTS = 5
const WORDLE_DAY_DURATION_MS = 24 * 60 * 60 * 1000

type LetterStatus = 'correct' | 'present' | 'absent'

type WordleAttemptResponse = {
  guess: string
  statuses: LetterStatus[]
  isCorrect: boolean
  points: number
  createdAt: Date
  answer?: string
}

type WordleProgressResponse = {
  puzzleKey: string
  attempts: WordleAttemptResponse[]
  isWon: boolean
  isLost: boolean
  remainingAttempts: number
  wordLength: number
  answer?: string
}

@Injectable()
export class WordleService {
  constructor(private readonly prisma: PrismaService) {}

  async getWords(): Promise<string[]> {
    return this.getWordBank()
  }

  async getTodayWord(): Promise<string> {
    const puzzle = await this.getTodayPuzzle()
    await this.cleanupExpiredAttempts(puzzle.puzzleKey)
    return puzzle.answer
  }

  async getProgress(userId: string): Promise<WordleProgressResponse> {
    const puzzle = await this.getTodayPuzzle()
    await this.cleanupExpiredAttempts(puzzle.puzzleKey)
    const attempts = await this.findAttempts(userId, puzzle.puzzleKey)
    return this.toProgress(puzzle.puzzleKey, puzzle.answer, attempts)
  }

  async addWord(dto: AddWordDto): Promise<string[]> {
    const cleanWord = dto.word.trim().toUpperCase()
    await this.prisma.word.upsert({
      where: { value: cleanWord },
      update: { isActive: true },
      create: { value: cleanWord, isActive: true },
    })
    return this.getWordBank()
  }

  async submitGuess(userId: string, dto: SubmitGuessDto): Promise<WordleProgressResponse> {
    const puzzle = await this.getTodayPuzzle()
    await this.cleanupExpiredAttempts(puzzle.puzzleKey)
    const guess = dto.guess.trim().toUpperCase()

    if (guess.length !== puzzle.answer.length) {
      throw new BadRequestException(`Le mot doit contenir ${puzzle.answer.length} lettres.`)
    }

    const attempts = await this.findAttempts(userId, puzzle.puzzleKey)
    if (attempts.some((attempt) => attempt.guess === guess)) {
      throw new ConflictException('Mot deja essaye.')
    }
    if (attempts.some((attempt) => attempt.isCorrect)) {
      throw new ConflictException('Le mot du jour est deja trouve.')
    }
    if (attempts.length >= MAX_ATTEMPTS) {
      throw new ConflictException('Tu as utilise tes 6 essais du jour.')
    }

    const isCorrect = guess === puzzle.answer
    const points = isCorrect ? calculateWordleWinPoints() : 0

    const nextAttempts = await this.prisma.$transaction(async (tx) => {
      const createdAttempt = await tx.wordleAttempt.create({
        data: {
          userId,
          guess,
          answer: puzzle.answer,
          puzzleKey: puzzle.puzzleKey,
          isCorrect,
          points,
        },
      })

      if (points > 0) {
        await tx.user.update({
          where: { id: userId },
          data: { points: { increment: points } },
        })
        await tx.pointTransaction.create({
          data: {
            userId,
            points,
            source: 'WORDLE',
            reason: 'Mot Wordle trouve',
            referenceId: createdAttempt.id,
          },
        })
      }

      return tx.wordleAttempt.findMany({
        where: { userId, puzzleKey: puzzle.puzzleKey },
        orderBy: { createdAt: 'asc' },
      })
    })

    return this.toProgress(puzzle.puzzleKey, puzzle.answer, nextAttempts)
  }

  private async getWordBank(): Promise<string[]> {
    const rows = await this.prisma.word.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'asc' },
    })
    const words = rows.map((row) => row.value.trim().toUpperCase()).filter((word) => word.length >= 3)
    return words.length ? words : FALLBACK_WORDS
  }

  private async getTodayPuzzle(): Promise<{ puzzleKey: string; answer: string }> {
    const words = await this.getWordBank()
    const puzzleKey = getDailyWordKey()
    const hash = Array.from(puzzleKey).reduce((total, character) => (
      (total * 31 + character.charCodeAt(0)) >>> 0
    ), 0)

    return {
      puzzleKey,
      answer: words[hash % words.length],
    }
  }

  private cleanupExpiredAttempts(currentPuzzleKey: string): Promise<{ count: number }> {
    return this.prisma.wordleAttempt.deleteMany({
      where: {
        OR: [
          { puzzleKey: { not: currentPuzzleKey } },
          { createdAt: { lt: getStartOfToday() } },
        ],
      },
    })
  }

  private findAttempts(userId: string, puzzleKey: string): Promise<WordleAttempt[]> {
    return this.prisma.wordleAttempt.findMany({
      where: { userId, puzzleKey },
      orderBy: { createdAt: 'asc' },
    })
  }

  private toProgress(puzzleKey: string, answer: string, attempts: WordleAttempt[]): WordleProgressResponse {
    const mappedAttempts = attempts.map((attempt) => this.toAttemptResponse(attempt, answer))
    const isWon = mappedAttempts.some((attempt) => attempt.isCorrect)
    const isLost = mappedAttempts.length >= MAX_ATTEMPTS && !isWon

    return {
      puzzleKey,
      attempts: mappedAttempts,
      isWon,
      isLost,
      remainingAttempts: Math.max(0, MAX_ATTEMPTS - mappedAttempts.length),
      wordLength: answer.length,
      ...(isWon || isLost ? { answer } : {}),
    }
  }

  private toAttemptResponse(attempt: WordleAttempt, answer: string): WordleAttemptResponse {
    return {
      guess: attempt.guess,
      statuses: scoreGuess(attempt.guess, answer),
      isCorrect: attempt.isCorrect,
      points: attempt.points,
      createdAt: attempt.createdAt,
      ...(attempt.isCorrect ? { answer } : {}),
    }
  }
}

function getDailyWordKey(date = new Date()): string {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
}

function getStartOfToday(date = new Date()): Date {
  const start = new Date(date)
  start.setHours(0, 0, 0, 0)
  return start
}

export function calculateWordleWinPoints(date = new Date()): number {
  return BASE_WIN_POINTS + calculateElapsedWordleBonus(date)
}

function calculateElapsedWordleBonus(date = new Date()): number {
  const elapsedMs = Math.max(0, date.getTime() - getStartOfToday(date).getTime())
  const elapsedRatio = Math.min(elapsedMs / WORDLE_DAY_DURATION_MS, 1)
  const elapsedBucket = Math.min(
    MAX_ELAPSED_TIME_BONUS_POINTS,
    Math.floor(elapsedRatio * (MAX_ELAPSED_TIME_BONUS_POINTS + 1)),
  )
  return MAX_ELAPSED_TIME_BONUS_POINTS - elapsedBucket
}

function scoreGuess(guess: string, answer: string): LetterStatus[] {
  const result: LetterStatus[] = Array.from({ length: answer.length }, () => 'absent')
  const remaining: Record<string, number> = {}

  for (let index = 0; index < answer.length; index += 1) {
    if (guess[index] === answer[index]) {
      result[index] = 'correct'
    } else {
      remaining[answer[index]] = (remaining[answer[index]] ?? 0) + 1
    }
  }

  for (let index = 0; index < answer.length; index += 1) {
    if (result[index] === 'correct') continue
    const letter = guess[index]
    if (remaining[letter] > 0) {
      result[index] = 'present'
      remaining[letter] -= 1
    }
  }

  return result
}
