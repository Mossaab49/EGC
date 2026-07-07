import { IsString, MinLength } from 'class-validator'

export class CreateMinecraftRequestDto {
  @IsString()
  @MinLength(2)
  name: string

  @IsString()
  @MinLength(2)
  launcher: string
}
