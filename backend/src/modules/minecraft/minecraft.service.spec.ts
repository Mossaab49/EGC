import { MinecraftRequestStatus } from '@prisma/client'
import { PrismaService } from '../../database/prisma.service'
import { MinecraftService } from './minecraft.service'

describe('MinecraftService', () => {
  it('associates the Minecraft name with the user when an admin accepts the request', async () => {
    const request = {
      id: 'request-1',
      userId: '4bd42ce5-f381-4aa6-a14a-fdc51a9a9f41',
      name: 'SteveEGC',
      launcher: 'Officiel',
      status: MinecraftRequestStatus.PENDING,
      createdAt: new Date('2026-07-09T10:00:00Z'),
      updatedAt: new Date('2026-07-09T10:00:00Z'),
    }
    const acceptedRequest = {
      ...request,
      status: MinecraftRequestStatus.ACCEPTED,
    }
    const tx = {
      minecraftRequest: {
        update: jest.fn().mockResolvedValue(acceptedRequest),
      },
      user: {
        update: jest.fn().mockResolvedValue({}),
      },
    }
    const prisma = {
      minecraftRequest: {
        findUnique: jest.fn().mockResolvedValue(request),
      },
      $transaction: jest.fn(async (operation: (client: typeof tx) => unknown) => operation(tx)),
    } as unknown as PrismaService
    const service = new MinecraftService(prisma)

    const result = await service.updateStatus(request.id, { status: 'Acceptee' })

    expect(tx.user.update).toHaveBeenCalledWith({
      where: { id: request.userId },
      data: { minecraftName: request.name },
    })
    expect(result.status).toBe('Acceptee')
  })
})
