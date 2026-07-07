import { Matches, MinLength } from 'class-validator'

export class AddWordDto {
  @MinLength(3)
  @Matches(/^[a-zA-Z]+$/)
  word: string
}
