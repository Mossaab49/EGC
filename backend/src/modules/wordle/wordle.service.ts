import { Injectable } from '@nestjs/common'
import { AddWordDto } from './dto/add-word.dto'
import { SubmitGuessDto } from './dto/submit-guess.dto'

const words = ['ARENA', 'PIXEL', 'SQUAD', 'GAMER', 'CLASH', 'LEVEL']

@Injectable()
export class WordleService {
  async getWords() {
    return words
  }

  async getTodayWord() {
    return words[0]
  }

  async addWord(dto: AddWordDto) {
    const cleanWord = dto.word.trim().toUpperCase()
    if (!words.includes(cleanWord)) words.push(cleanWord)
    return words
  }

  async submitGuess(dto: SubmitGuessDto) {
    const guess = dto.guess.trim().toUpperCase()
    const answer = dto.answer.trim().toUpperCase()
    return {
      guess,
      answer,
      statuses: scoreGuess(guess, answer),
      isCorrect: guess === answer,
    }
  }
}

function scoreGuess(guess: string, answer: string) {
  const result = Array.from({ length: answer.length }, () => 'absent')
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
