import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'
import { CreateEventDto } from './dto/create-event.dto'
import { UpdateEventDto } from './dto/update-event.dto'
import { EventsService } from './events.service'

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  findAll() {
    return this.eventsService.findAll()
  }

  @Post()
  create(@Body() dto: CreateEventDto) {
    return this.eventsService.create(dto)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateEventDto) {
    return this.eventsService.update(id, dto)
  }

  @Patch(':id/open-signup')
  openSignup(@Param('id') id: string) {
    return this.eventsService.openSignup(id)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventsService.remove(id)
  }
}
