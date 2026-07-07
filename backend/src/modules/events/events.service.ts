import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateEventDto } from './dto/create-event.dto'
import { UpdateEventDto } from './dto/update-event.dto'

type EventRecord = CreateEventDto & { id: string; isSignupOpen: boolean }

const events: EventRecord[] = []

@Injectable()
export class EventsService {
  async findAll() {
    return events
  }

  async create(dto: CreateEventDto) {
    const event: EventRecord = {
      ...dto,
      id: dto.id ?? `event-${Date.now()}`,
      isSignupOpen: false,
    }
    events.push(event)
    return event
  }

  async update(id: string, dto: UpdateEventDto) {
    const event = await this.requireEvent(id)
    Object.assign(event, dto)
    return event
  }

  async openSignup(id: string) {
    const target = await this.requireEvent(id)
    for (const event of events) {
      event.isSignupOpen = event.id === target.id && event.status !== 'Passe'
    }
    return target
  }

  async remove(id: string) {
    const index = events.findIndex((event) => event.id === id)
    if (index === -1) throw new NotFoundException('Event not found')
    events.splice(index, 1)
    return { deleted: true }
  }

  private async requireEvent(id: string) {
    const event = events.find((item) => item.id === id)
    if (!event) throw new NotFoundException('Event not found')
    return event
  }
}
