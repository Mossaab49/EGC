import { IsEmail, IsIn, IsOptional, IsString, MinLength } from 'class-validator'

export class CreateUserDto {
  @IsString()
  @MinLength(2)
  name: string

  @IsEmail()
  email: string

  @IsOptional()
  @IsIn(['Admin', 'Membre'])
  role?: 'Admin' | 'Membre'

  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string
}
