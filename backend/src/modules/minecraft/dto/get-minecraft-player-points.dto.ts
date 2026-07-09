import { Matches } from 'class-validator'

export class GetMinecraftPlayerPointsDto {
  @Matches(/^[A-Za-z0-9_]{3,16}$/, {
    message: 'minecraftName must be a valid Minecraft username',
  })
  minecraftName: string
}
