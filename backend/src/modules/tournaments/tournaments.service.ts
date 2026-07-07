import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { CreateTournamentDto } from './dto/create-tournament.dto'
import { UpdateTournamentDto } from './dto/update-tournament.dto'

type TournamentRecord = Omit<CreateTournamentDto, 'registered'> & {
  id: string
  registered: number
}

const tournaments: TournamentRecord[] = []

@Injectable()
export class TournamentsService {
  async findAll() {
    return tournaments
  }

  async create(dto: CreateTournamentDto) {
    const tournament: TournamentRecord = {
      ...dto,
      id: dto.id ?? `tournament-${Date.now()}`,
      registered: Math.min(dto.registered ?? 0, dto.capacity),
    }
    tournaments.push(tournament)
    return tournament
  }

  async update(id: string, dto: UpdateTournamentDto) {
    const tournament = await this.requireTournament(id)
    Object.assign(tournament, dto)
    tournament.registered = Math.min(tournament.registered ?? 0, tournament.capacity)
    return tournament
  }

  async register(id: string) {
    const tournament = await this.requireTournament(id)
    if (tournament.registered >= tournament.capacity) {
      throw new BadRequestException('Tournament is full')
    }
    tournament.registered += 1
    return tournament
  }

  async cancel(id: string) {
    const tournament = await this.requireTournament(id)
    tournament.registered = Math.max(0, tournament.registered - 1)
    return tournament
  }

  async remove(id: string) {
    const index = tournaments.findIndex((tournament) => tournament.id === id)
    if (index === -1) throw new NotFoundException('Tournament not found')
    tournaments.splice(index, 1)
    return { deleted: true }
  }

  private async requireTournament(id: string) {
    const tournament = tournaments.find((item) => item.id === id)
    if (!tournament) throw new NotFoundException('Tournament not found')
    return tournament
  }
}
