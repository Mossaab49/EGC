import { Matches, MinLength } from 'class-validator'

export class SubmitGuessDto {
  @MinLength(3)
  @Matches(/^[a-zA-Z]+$/)
  guess: string
}
