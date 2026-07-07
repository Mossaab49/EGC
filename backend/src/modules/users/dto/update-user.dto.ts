import { IsEmail, IsIn, IsNumber, IsOptional, IsString, MinLength } from 'class-validator'

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string

  @IsOptional()
  @IsEmail()
  email?: string

  @IsOptional()
  @IsIn(['Admin', 'Membre'])
  role?: 'Admin' | 'Membre'

  @IsOptional()
  @IsNumber()
  points?: number

  @IsOptional()
  @IsIn(['Actif', 'Invite'])
  status?: 'Actif' | 'Invite'
}
