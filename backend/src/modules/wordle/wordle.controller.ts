import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { AuthenticatedUser } from '../auth/types/auth-response.type'
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

  @UseGuards(JwtAuthGuard)
  @Get('progress')
  getProgress(@CurrentUser() user: AuthenticatedUser) {
    return this.wordleService.getProgress(user.id)
  }

  @Post('words')
  addWord(@Body() dto: AddWordDto) {
    return this.wordleService.addWord(dto)
  }

  @UseGuards(JwtAuthGuard)
  @Post('guess')
  submitGuess(@CurrentUser() user: AuthenticatedUser, @Body() dto: SubmitGuessDto) {
    return this.wordleService.submitGuess(user.id, dto)
  }
}
