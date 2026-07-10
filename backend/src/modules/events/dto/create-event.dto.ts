import { IsBoolean, IsIn, IsOptional, IsString, IsUrl, MinLength } from 'class-validator'

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

  @IsUrl({ protocols: ['http', 'https'], require_protocol: true })
  postUrl: string

  @IsOptional()
  @IsBoolean()
  isSignupOpen?: boolean
}
