import { IsOptional, IsString, MinLength } from 'class-validator'

export class CreateMinecraftRequestDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string

  @IsOptional()
  @IsString()
  @MinLength(2)
  launcher?: string

  @IsOptional()
  @IsString()
  @MinLength(2)
  'pseudo-minecraft'?: string

  @IsOptional()
  @IsString()
  @MinLength(2)
  'launcher-utilise'?: string
}
