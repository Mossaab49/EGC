import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'
import { CreateTournamentDto } from './dto/create-tournament.dto'
import { UpdateTournamentDto } from './dto/update-tournament.dto'
import { TournamentsService } from './tournaments.service'

@Controller('tournaments')
export class TournamentsController {
  constructor(private readonly tournamentsService: TournamentsService) {}

  @Get()
  findAll() {
    return this.tournamentsService.findAll()
  }

  @Post()
  create(@Body() dto: CreateTournamentDto) {
    return this.tournamentsService.create(dto)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTournamentDto) {
    return this.tournamentsService.update(id, dto)
  }

  @Post(':id/register')
  register(@Param('id') id: string) {
    return this.tournamentsService.register(id)
  }

  @Post(':id/cancel')
  cancel(@Param('id') id: string) {
    return this.tournamentsService.cancel(id)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tournamentsService.remove(id)
  }
}
