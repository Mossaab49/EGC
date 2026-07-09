import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { Tournament, TournamentStatus } from '@prisma/client'
import { PrismaService } from '../../database/prisma.service'
import { CreateTournamentDto } from './dto/create-tournament.dto'
import { UpdateTournamentDto } from './dto/update-tournament.dto'

type UiTournamentStatus = 'Actif' | 'Brouillon' | 'Termine'

export type TournamentResponse = {
  id: string
  title: string
  game: string
  date: string
  capacity: number
  registered: number
  status: UiTournamentStatus
  reward: string
  format: string
  imageUrl: string
  isRegistered?: boolean
}

@Injectable()
export class TournamentsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<TournamentResponse[]> {
    const tournaments = await this.prisma.tournament.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return tournaments.map((tournament) => this.toTournamentResponse(tournament))
  }

  async findAllForUser(userId: string): Promise<TournamentResponse[]> {
    const tournaments = await this.prisma.tournament.findMany({
      include: {
        entries: {
          where: { userId },
          select: { id: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return tournaments.map((tournament) => ({
      ...this.toTournamentResponse(tournament),
      isRegistered: tournament.entries.length > 0,
    }))
  }

  async create(dto: CreateTournamentDto): Promise<TournamentResponse> {
    const tournament = await this.prisma.tournament.create({
      data: {
        id: dto.id,
        title: dto.title,
        game: dto.game,
        dateLabel: dto.date,
        capacity: dto.capacity,
        registered: Math.min(dto.registered ?? 0, dto.capacity),
        status: this.toDbStatus(dto.status),
        reward: dto.reward,
        format: dto.format,
        imageUrl: dto.imageUrl,
      },
    })

    return this.toTournamentResponse(tournament)
  }

  async update(id: string, dto: UpdateTournamentDto): Promise<TournamentResponse> {
    await this.requireTournament(id)

    const tournament = await this.prisma.tournament.update({
      where: { id },
      data: {
        title: dto.title,
        game: dto.game,
        dateLabel: dto.date,
        capacity: dto.capacity,
        registered: dto.registered,
        status: dto.status ? this.toDbStatus(dto.status) : undefined,
        reward: dto.reward,
        format: dto.format,
        imageUrl: dto.imageUrl,
      },
    })

    if (tournament.registered > tournament.capacity) {
      const normalizedTournament = await this.prisma.tournament.update({
        where: { id },
        data: { registered: tournament.capacity },
      })
      return this.toTournamentResponse(normalizedTournament)
    }

    return this.toTournamentResponse(tournament)
  }

  async register(id: string, userId: string, userName: string): Promise<TournamentResponse> {
    const tournament = await this.requireTournament(id)
    if (tournament.status !== TournamentStatus.ACTIVE) {
      throw new BadRequestException('Tournament registration is closed')
    }
    if (tournament.registered >= tournament.capacity) {
      throw new BadRequestException('Tournament is full')
    }

    try {
      const updatedTournament = await this.prisma.$transaction(async (tx) => {
        await tx.tournamentEntry.create({
          data: {
            tournamentId: id,
            userId,
            userName,
          },
        })

        return tx.tournament.update({
          where: { id },
          data: { registered: { increment: 1 } },
        })
      })

      return { ...this.toTournamentResponse(updatedTournament), isRegistered: true }
    } catch (error) {
      if (this.isPrismaErrorCode(error, 'P2002')) {
        throw new ConflictException('User is already registered to this tournament')
      }
      throw error
    }
  }

  async cancel(id: string, userId: string): Promise<TournamentResponse> {
    await this.requireTournament(id)

    const entry = await this.prisma.tournamentEntry.findUnique({
      where: { userId_tournamentId: { userId, tournamentId: id } },
    })

    if (!entry) {
      throw new BadRequestException('User is not registered to this tournament')
    }

    const updatedTournament = await this.prisma.$transaction(async (tx) => {
      await tx.tournamentEntry.delete({ where: { id: entry.id } })
      return tx.tournament.update({
        where: { id },
        data: { registered: { decrement: 1 } },
      })
    })

    if (updatedTournament.registered < 0) {
      const normalizedTournament = await this.prisma.tournament.update({
        where: { id },
        data: { registered: 0 },
      })
      return { ...this.toTournamentResponse(normalizedTournament), isRegistered: false }
    }

    return { ...this.toTournamentResponse(updatedTournament), isRegistered: false }
  }

  async remove(id: string): Promise<{ deleted: true }> {
    await this.requireTournament(id)
    await this.prisma.tournament.delete({ where: { id } })
    return { deleted: true }
  }

  private async requireTournament(id: string): Promise<Tournament> {
    const tournament = await this.prisma.tournament.findUnique({ where: { id } })
    if (!tournament) throw new NotFoundException('Tournament not found')
    return tournament
  }

  private toTournamentResponse(tournament: Tournament): TournamentResponse {
    return {
      id: tournament.id,
      title: tournament.title,
      game: tournament.game,
      date: tournament.dateLabel,
      capacity: tournament.capacity,
      registered: tournament.registered,
      status: this.toUiStatus(tournament.status),
      reward: tournament.reward,
      format: tournament.format,
      imageUrl: tournament.imageUrl,
    }
  }

  private toDbStatus(status: UiTournamentStatus): TournamentStatus {
    if (status === 'Actif') return TournamentStatus.ACTIVE
    if (status === 'Termine') return TournamentStatus.FINISHED
    return TournamentStatus.DRAFT
  }

  private toUiStatus(status: TournamentStatus): UiTournamentStatus {
    if (status === TournamentStatus.ACTIVE) return 'Actif'
    if (status === TournamentStatus.FINISHED) return 'Termine'
    return 'Brouillon'
  }

  private isPrismaErrorCode(error: unknown, code: string): boolean {
    return typeof error === 'object' && error !== null && 'code' in error && error.code === code
  }
}
