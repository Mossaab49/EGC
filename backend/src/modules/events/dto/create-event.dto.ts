import { IsBoolean, IsIn, IsOptional, IsString, MinLength } from 'class-validator'

export class CreateEventDto {
  @IsOptional()
  @IsString()
  id?: string

  @IsString()
  @MinLength(2)
  title: string

  @IsString()
  date: string

  @IsString()
  venue: string

  @IsString()
  imageUrl: string

  @IsIn(['A venir', 'Passe', 'Brouillon'])
  status: 'A venir' | 'Passe' | 'Brouillon'

  @IsString()
  category: string

  @IsString()
  details: string

  @IsString()
  rules: string

  @IsString()
  postUrl: string

  @IsOptional()
  @IsBoolean()
  isSignupOpen?: boolean
}
