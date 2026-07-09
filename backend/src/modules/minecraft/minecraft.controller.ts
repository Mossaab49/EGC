import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common'
import { Throttle } from '@nestjs/throttler'
import { UserRole } from '@prisma/client'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import { Roles } from '../auth/decorators/roles.decorator'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { AuthenticatedUser } from '../auth/types/auth-response.type'
import { CreateMinecraftRequestDto } from './dto/create-minecraft-request.dto'
import { UpdateMinecraftRequestStatusDto } from './dto/update-minecraft-request-status.dto'
import { MinecraftRequestResponse, MinecraftService } from './minecraft.service'

@Controller('minecraft')
export class MinecraftController {
  constructor(private readonly minecraftService: MinecraftService) {}

  @Get('requests')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  findAll(): Promise<MinecraftRequestResponse[]> {
    return this.minecraftService.findAll()
  }

  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @Post('requests')
  @UseGuards(JwtAuthGuard)
  create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateMinecraftRequestDto,
  ): Promise<MinecraftRequestResponse> {
    return this.minecraftService.create(user.id, dto)
  }

  @Patch('requests/:id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  updateStatus(@Param('id') id: string, @Body() dto: UpdateMinecraftRequestStatusDto): Promise<MinecraftRequestResponse> {
    return this.minecraftService.updateStatus(id, dto)
  }

  @Delete('requests/treated')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  deleteTreated(): Promise<{ deleted: number }> {
    return this.minecraftService.deleteTreated()
  }
}
