import { Injectable, NotFoundException } from '@nestjs/common'
import { AwardMinecraftPointsDto } from './dto/award-minecraft-points.dto'
import {
  MinecraftPlayer,
  MinecraftPluginRepository,
} from './minecraft-plugin.repository'

export type MinecraftPointsResponse = {
  minecraftName: string
  points: number
}

export type MinecraftPointsAwardResponse = MinecraftPointsResponse & {
  awardedPoints: number
  eventId: string
  applied: boolean
}

@Injectable()
export class MinecraftPluginService {
  constructor(private readonly repository: MinecraftPluginRepository) {}

  async getPoints(minecraftName: string): Promise<MinecraftPointsResponse> {
    const player = await this.requirePlayer(minecraftName)
    return this.toPointsResponse(player)
  }

  async awardPoints(dto: AwardMinecraftPointsDto): Promise<MinecraftPointsAwardResponse> {
    const player = await this.requirePlayer(dto.minecraftName)

    try {
      const updatedPlayer = await this.repository.awardPoints(
        player.id,
        dto.points,
        dto.task.trim(),
        dto.eventId,
      )
      return {
        ...this.toPointsResponse(updatedPlayer),
        awardedPoints: dto.points,
        eventId: dto.eventId,
        applied: true,
      }
    } catch (error) {
      if (!this.isUniqueConstraintError(error)) throw error

      const currentPlayer = await this.requirePlayer(dto.minecraftName)
      return {
        ...this.toPointsResponse(currentPlayer),
        awardedPoints: 0,
        eventId: dto.eventId,
        applied: false,
      }
    }
  }

  private async requirePlayer(minecraftName: string): Promise<MinecraftPlayer> {
    const player = await this.repository.findPlayer(minecraftName)
    if (!player?.minecraftName) {
      throw new NotFoundException('Minecraft player not found')
    }
    return player
  }

  private toPointsResponse(player: MinecraftPlayer): MinecraftPointsResponse {
    return {
      minecraftName: player.minecraftName!,
      points: player.points,
    }
  }

  private isUniqueConstraintError(error: unknown): boolean {
    if (typeof error !== 'object' || error === null || !('code' in error)) return false
    return (error as { code?: unknown }).code === 'P2002'
  }
}
