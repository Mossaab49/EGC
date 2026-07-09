import { MinecraftPluginRepository } from './minecraft-plugin.repository'
import { MinecraftPluginService } from './minecraft-plugin.service'

describe('MinecraftPluginService', () => {
  const player = {
    id: '4bd42ce5-f381-4aa6-a14a-fdc51a9a9f41',
    minecraftName: 'SteveEGC',
    points: 25,
  }

  it('returns the player point balance', async () => {
    const repository = {
      findPlayer: jest.fn().mockResolvedValue(player),
    } as unknown as MinecraftPluginRepository
    const service = new MinecraftPluginService(repository)

    await expect(service.getPoints('SteveEGC')).resolves.toEqual({
      minecraftName: 'SteveEGC',
      points: 25,
    })
  })

  it('awards points and returns the new balance', async () => {
    const repository = {
      findPlayer: jest.fn().mockResolvedValue(player),
      awardPoints: jest.fn().mockResolvedValue({ ...player, points: 30 }),
    } as unknown as MinecraftPluginRepository
    const service = new MinecraftPluginService(repository)

    await expect(service.awardPoints({
      minecraftName: 'SteveEGC',
      points: 5,
      task: 'Premier diamant',
      eventId: 'event-123',
    })).resolves.toEqual({
      minecraftName: 'SteveEGC',
      points: 30,
      awardedPoints: 5,
      eventId: 'event-123',
      applied: true,
    })
  })

  it('does not award the same event twice', async () => {
    const repository = {
      findPlayer: jest.fn().mockResolvedValue(player),
      awardPoints: jest.fn().mockRejectedValue({ code: 'P2002' }),
    } as unknown as MinecraftPluginRepository
    const service = new MinecraftPluginService(repository)

    await expect(service.awardPoints({
      minecraftName: 'SteveEGC',
      points: 5,
      task: 'Premier diamant',
      eventId: 'event-123',
    })).resolves.toEqual({
      minecraftName: 'SteveEGC',
      points: 25,
      awardedPoints: 0,
      eventId: 'event-123',
      applied: false,
    })
  })
})
