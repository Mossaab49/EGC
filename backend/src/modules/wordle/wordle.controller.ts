import { Body, Controller, Get, Post } from '@nestjs/common'
import { AddWordDto } from './dto/add-word.dto'
import { SubmitGuessDto } from './dto/submit-guess.dto'
import { WordleService } from './wordle.service'

@Controller('wordle')
export class WordleController {
  constructor(private readonly wordleService: WordleService) {}

  @Get('words')
  getWords() {
    return this.wordleService.getWords()
  }

  @Get('today')
  getTodayWord() {
    return this.wordleService.getTodayWord()
  }

  @Post('words')
  addWord(@Body() dto: AddWordDto) {
    return this.wordleService.addWord(dto)
  }

  @Post('guess')
  submitGuess(@Body() dto: SubmitGuessDto) {
    return this.wordleService.submitGuess(dto)
  }
}
