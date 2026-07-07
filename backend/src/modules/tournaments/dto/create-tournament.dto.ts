import { IsIn, IsNumber, IsOptional, IsString, Min, MinLength } from 'class-validator'

export class CreateTournamentDto {
  @IsOptional()
  @IsString()
  id?: string

  @IsString()
  @MinLength(2)
  title: string

  @IsString()
  game: string

  @IsString()
  date: string

  @IsNumber()
  @Min(1)
  capacity: number

  @IsOptional()
  @IsNumber()
  @Min(0)
  registered?: number

  @IsIn(['Actif', 'Brouillon', 'Termine'])
  status: 'Actif' | 'Brouillon' | 'Termine'

  @IsString()
  reward: string

  @IsString()
  format: string

  @IsString()
  imageUrl: string
}
