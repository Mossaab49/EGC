import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common'
import { UserRole } from '@prisma/client'
import { Roles } from '../auth/decorators/roles.decorator'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { CreateEventDto } from './dto/create-event.dto'
import { UpdateEventDto } from './dto/update-event.dto'
import { EventResponse, EventsService } from './events.service'

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  findAll(): Promise<EventResponse[]> {
    return this.eventsService.findAll()
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() dto: CreateEventDto): Promise<EventResponse> {
    return this.eventsService.create(dto)
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() dto: UpdateEventDto): Promise<EventResponse> {
    return this.eventsService.update(id, dto)
  }

  @Patch(':id/open-signup')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  openSignup(@Param('id') id: string): Promise<EventResponse> {
    return this.eventsService.openSignup(id)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string): Promise<{ deleted: true }> {
    return this.eventsService.remove(id)
  }
}
