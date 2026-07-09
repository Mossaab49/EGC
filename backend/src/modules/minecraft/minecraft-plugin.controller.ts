import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common'
import { Throttle } from '@nestjs/throttler'
import { AwardMinecraftPointsDto } from './dto/award-minecraft-points.dto'
import { GetMinecraftPlayerPointsDto } from './dto/get-minecraft-player-points.dto'
import { MinecraftPluginApiKeyGuard } from './guards/minecraft-plugin-api-key.guard'
import {
  MinecraftPluginService,
  MinecraftPointsAwardResponse,
  MinecraftPointsResponse,
} from './minecraft-plugin.service'

@Controller('minecraft/plugin')
@UseGuards(MinecraftPluginApiKeyGuard)
@Throttle({ default: { limit: 300, ttl: 60_000 } })
export class MinecraftPluginController {
  constructor(private readonly service: MinecraftPluginService) {}

  @Get('players/:minecraftName/points')
  getPoints(
    @Param() params: GetMinecraftPlayerPointsDto,
  ): Promise<MinecraftPointsResponse> {
    return this.service.getPoints(params.minecraftName)
  }

  @Post('points')
  awardPoints(
    @Body() dto: AwardMinecraftPointsDto,
  ): Promise<MinecraftPointsAwardResponse> {
    return this.service.awardPoints(dto)
  }
}
