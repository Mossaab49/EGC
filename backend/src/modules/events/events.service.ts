import { Injectable, NotFoundException } from '@nestjs/common'
import { Event, EventStatus } from '@prisma/client'
import { PrismaService } from '../../database/prisma.service'
import { CreateEventDto } from './dto/create-event.dto'
import { UpdateEventDto } from './dto/update-event.dto'

type UiEventStatus = 'A venir' | 'Passe' | 'Brouillon'

export type EventResponse = {
  id: string
  title: string
  date: string
  venue: string
  imageUrl: string
  status: UiEventStatus
  category: string
  details: string
  rules: string
  postUrl: string
  isSignupOpen: boolean
}

@Injectable()
export class EventsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<EventResponse[]> {
    const events = await this.prisma.event.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return events.map((event) => this.toEventResponse(event))
  }

  async create(dto: CreateEventDto): Promise<EventResponse> {
    const event = await this.prisma.event.create({
      data: {
        id: dto.id,
        title: dto.title,
        dateLabel: dto.date,
        venue: dto.venue,
        imageUrl: dto.imageUrl,
        status: this.toDbStatus(dto.status),
        category: dto.category,
        details: dto.details,
        rules: dto.rules,
        postUrl: dto.postUrl,
        isSignupOpen: false,
      },
    })

    return this.toEventResponse(event)
  }

  async update(id: string, dto: UpdateEventDto): Promise<EventResponse> {
    await this.requireEvent(id)

    const event = await this.prisma.event.update({
      where: { id },
      data: {
        title: dto.title,
        dateLabel: dto.date,
        venue: dto.venue,
        imageUrl: dto.imageUrl,
        status: dto.status ? this.toDbStatus(dto.status) : undefined,
        category: dto.category,
        details: dto.details,
        rules: dto.rules,
        postUrl: dto.postUrl,
        isSignupOpen: dto.isSignupOpen,
      },
    })

    return this.toEventResponse(event)
  }

  async openSignup(id: string): Promise<EventResponse> {
    const target = await this.requireEvent(id)

    const [, event] = await this.prisma.$transaction([
      this.prisma.event.updateMany({ data: { isSignupOpen: false } }),
      this.prisma.event.update({
        where: { id },
        data: { isSignupOpen: target.status !== EventStatus.PAST },
      }),
    ])

    return this.toEventResponse(event)
  }

  async remove(id: string): Promise<{ deleted: true }> {
    await this.requireEvent(id)
    await this.prisma.event.delete({ where: { id } })
    return { deleted: true }
  }

  private async requireEvent(id: string): Promise<Event> {
    const event = await this.prisma.event.findUnique({ where: { id } })
    if (!event) throw new NotFoundException('Event not found')
    return event
  }

  private toEventResponse(event: Event): EventResponse {
    return {
      id: event.id,
      title: event.title,
      date: event.dateLabel,
      venue: event.venue,
      imageUrl: event.imageUrl,
      status: this.toUiStatus(event.status),
      category: event.category,
      details: event.details,
      rules: event.rules,
      postUrl: event.postUrl,
      isSignupOpen: event.isSignupOpen,
    }
  }

  private toDbStatus(status: UiEventStatus): EventStatus {
    if (status === 'Passe') return EventStatus.PAST
    if (status === 'Brouillon') return EventStatus.DRAFT
    return EventStatus.UPCOMING
  }

  private toUiStatus(status: EventStatus): UiEventStatus {
    if (status === EventStatus.PAST) return 'Passe'
    if (status === EventStatus.DRAFT) return 'Brouillon'
    return 'A venir'
  }
}
