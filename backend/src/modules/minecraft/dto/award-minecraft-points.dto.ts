import { IsInt, IsString, Matches, Max, MaxLength, Min, MinLength } from 'class-validator'

export class AwardMinecraftPointsDto {
  @Matches(/^[A-Za-z0-9_]{3,16}$/, {
    message: 'minecraftName must be a valid Minecraft username',
  })
  minecraftName: string

  @IsInt()
  @Min(1)
  @Max(10_000)
  points: number

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  task: string

  @IsString()
  @MinLength(8)
  @MaxLength(128)
  @Matches(/^[A-Za-z0-9._:-]+$/)
  eventId: string
}
