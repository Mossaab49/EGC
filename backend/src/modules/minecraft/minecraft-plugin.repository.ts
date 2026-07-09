import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../database/prisma.service'

export type MinecraftPlayer = {
  id: string
  minecraftName: string | null
  points: number
}

@Injectable()
export class MinecraftPluginRepository {
  constructor(private readonly prisma: PrismaService) {}

  findPlayer(minecraftName: string): Promise<MinecraftPlayer | null> {
    return this.prisma.user.findFirst({
      where: {
        minecraftName: { equals: minecraftName, mode: 'insensitive' },
      },
      select: {
        id: true,
        minecraftName: true,
        points: true,
      },
    })
  }

  async awardPoints(
    playerId: string,
    points: number,
    task: string,
    eventId: string,
  ): Promise<MinecraftPlayer> {
    return this.prisma.$transaction(async (tx) => {
      await tx.pointTransaction.create({
        data: {
          userId: playerId,
          points,
          source: 'MINECRAFT',
          reason: task,
          referenceId: eventId,
        },
      })

      return tx.user.update({
        where: { id: playerId },
        data: { points: { increment: points } },
        select: {
          id: true,
          minecraftName: true,
          points: true,
        },
      })
    })
  }
}
