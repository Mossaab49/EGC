import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common'
import { Throttle } from '@nestjs/throttler'
import { CreateMinecraftRequestDto } from './dto/create-minecraft-request.dto'
import { UpdateMinecraftRequestStatusDto } from './dto/update-minecraft-request-status.dto'
import { MinecraftService } from './minecraft.service'

@Controller('minecraft')
export class MinecraftController {
  constructor(private readonly minecraftService: MinecraftService) {}

  @Get('requests')
  findAll() {
    return this.minecraftService.findAll()
  }

  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @Post('requests')
  create(@Body() dto: CreateMinecraftRequestDto) {
    return this.minecraftService.create(dto)
  }

  @Patch('requests/:id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateMinecraftRequestStatusDto) {
    return this.minecraftService.updateStatus(id, dto)
  }
}
