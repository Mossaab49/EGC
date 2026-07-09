import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common'
import { UserRole } from '@prisma/client'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import { Roles } from '../auth/decorators/roles.decorator'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { AuthenticatedUser } from '../auth/types/auth-response.type'
import { CreateTournamentDto } from './dto/create-tournament.dto'
import { UpdateTournamentDto } from './dto/update-tournament.dto'
import { TournamentResponse, TournamentsService } from './tournaments.service'

@Controller('tournaments')
export class TournamentsController {
  constructor(private readonly tournamentsService: TournamentsService) {}

  @Get()
  findAll(): Promise<TournamentResponse[]> {
    return this.tournamentsService.findAll()
  }

  @Get('mine')
  @UseGuards(JwtAuthGuard)
  findMine(@CurrentUser() user: AuthenticatedUser): Promise<TournamentResponse[]> {
    return this.tournamentsService.findAllForUser(user.id)
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() dto: CreateTournamentDto): Promise<TournamentResponse> {
    return this.tournamentsService.create(dto)
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() dto: UpdateTournamentDto): Promise<TournamentResponse> {
    return this.tournamentsService.update(id, dto)
  }

  @Post(':id/register')
  @UseGuards(JwtAuthGuard)
  register(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser): Promise<TournamentResponse> {
    return this.tournamentsService.register(id, user.id, user.name)
  }

  @Post(':id/cancel')
  @UseGuards(JwtAuthGuard)
  cancel(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser): Promise<TournamentResponse> {
    return this.tournamentsService.cancel(id, user.id)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string): Promise<{ deleted: true }> {
    return this.tournamentsService.remove(id)
  }
}
