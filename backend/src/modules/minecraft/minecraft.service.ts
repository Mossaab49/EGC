import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { MinecraftRequest, MinecraftRequestStatus } from '@prisma/client'
import { PrismaService } from '../../database/prisma.service'
import { CreateMinecraftRequestDto } from './dto/create-minecraft-request.dto'
import { UpdateMinecraftRequestStatusDto } from './dto/update-minecraft-request-status.dto'

type UiMinecraftRequestStatus = 'Acceptee' | 'Refusee' | 'En attente'

export type MinecraftRequestResponse = {
  id: string
  name: string
  launcher: string
  status: UiMinecraftRequestStatus
  createdAt: Date
  updatedAt: Date
}

@Injectable()
export class MinecraftService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<MinecraftRequestResponse[]> {
    const requests = await this.prisma.minecraftRequest.findMany({
      orderBy: [{ status: 'desc' }, { createdAt: 'desc' }],
    })

    return requests.map((request) => this.toResponse(request))
  }

  async create(userId: string, dto: CreateMinecraftRequestDto): Promise<MinecraftRequestResponse> {
    const name = (dto.name || dto['pseudo-minecraft'] || '').trim()
    const launcher = (dto.launcher || dto['launcher-utilise'] || '').trim()
    if (name.length < 2 || launcher.length < 2) {
      throw new BadRequestException('Pseudo Minecraft et launcher sont obligatoires.')
    }
    const existingPendingRequest = await this.prisma.minecraftRequest.findFirst({
      where: {
        userId,
        status: MinecraftRequestStatus.PENDING,
      },
    })

    const request = existingPendingRequest
      ? await this.prisma.minecraftRequest.update({
        where: { id: existingPendingRequest.id },
        data: { name, launcher, status: MinecraftRequestStatus.PENDING },
      })
      : await this.prisma.minecraftRequest.create({
        data: { userId, name, launcher, status: MinecraftRequestStatus.PENDING },
      })

    return this.toResponse(request)
  }

  async updateStatus(id: string, dto: UpdateMinecraftRequestStatusDto): Promise<MinecraftRequestResponse> {
    const existingRequest = await this.requireRequest(id)
    const status = this.toDbStatus(dto.status)

    if (status === MinecraftRequestStatus.ACCEPTED && !existingRequest.userId) {
      throw new BadRequestException(
        "Cette ancienne demande n'est associee a aucun utilisateur. Le membre doit la renvoyer.",
      )
    }

    try {
      const request = await this.prisma.$transaction(async (tx) => {
        const updatedRequest = await tx.minecraftRequest.update({
          where: { id },
          data: { status },
        })

        if (status === MinecraftRequestStatus.ACCEPTED && existingRequest.userId) {
          await tx.user.update({
            where: { id: existingRequest.userId },
            data: { minecraftName: existingRequest.name },
          })
        }

        return updatedRequest
      })

      return this.toResponse(request)
    } catch (error) {
      if (this.isUniqueConstraintError(error)) {
        throw new ConflictException('Ce pseudo Minecraft est deja associe a un autre membre.')
      }
      throw error
    }
  }

  async deleteTreated(): Promise<{ deleted: number }> {
    const result = await this.prisma.minecraftRequest.deleteMany({
      where: { status: { in: [MinecraftRequestStatus.ACCEPTED, MinecraftRequestStatus.REJECTED] } },
    })

    return { deleted: result.count }
  }

  private async requireRequest(id: string): Promise<MinecraftRequest> {
    const request = await this.prisma.minecraftRequest.findUnique({ where: { id } })
    if (!request) throw new NotFoundException('Minecraft request not found')
    return request
  }

  private toResponse(request: MinecraftRequest): MinecraftRequestResponse {
    return {
      id: request.id,
      name: request.name,
      launcher: request.launcher,
      status: this.toUiStatus(request.status),
      createdAt: request.createdAt,
      updatedAt: request.updatedAt,
    }
  }

  private toUiStatus(status: MinecraftRequestStatus): UiMinecraftRequestStatus {
    if (status === MinecraftRequestStatus.ACCEPTED) return 'Acceptee'
    if (status === MinecraftRequestStatus.REJECTED) return 'Refusee'
    return 'En attente'
  }

  private toDbStatus(status: UiMinecraftRequestStatus): MinecraftRequestStatus {
    if (status === 'Acceptee') return MinecraftRequestStatus.ACCEPTED
    if (status === 'Refusee') return MinecraftRequestStatus.REJECTED
    return MinecraftRequestStatus.PENDING
  }

  private isUniqueConstraintError(error: unknown): boolean {
    if (typeof error !== 'object' || error === null || !('code' in error)) return false
    return (error as { code?: unknown }).code === 'P2002'
  }
}
