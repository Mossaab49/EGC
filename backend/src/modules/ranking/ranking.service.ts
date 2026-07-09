import { Injectable } from '@nestjs/common'
import { UserRole } from '@prisma/client'
import { PrismaService } from '../../database/prisma.service'

type RankingPeriod = 'monthly' | 'weekly'
type RankingTone = 'gold' | 'purple' | 'blue'
type RankingRow = [string, string, string, number, RankingTone]

type WeeklyPointsRow = {
  userId: string
  name: string
  points: number
}

@Injectable()
export class RankingService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(period: RankingPeriod): Promise<RankingRow[]> {
    return period === 'weekly' ? this.findWeekly() : this.findMonthly()
  }

  private async findMonthly(): Promise<RankingRow[]> {
    const users = await this.prisma.user.findMany({
      where: { role: UserRole.MEMBER },
      orderBy: [{ points: 'desc' }, { name: 'asc' }],
      take: 20,
      select: { name: true, points: true },
    })

    return users.map((user, index) => this.toRankingRow(user.name, user.points, index))
  }

  private async findWeekly(): Promise<RankingRow[]> {
    const { start, end } = getCurrentWeekWindow()
    const [users, groupedTransactions] = await Promise.all([
      this.prisma.user.findMany({
        where: { role: UserRole.MEMBER },
        orderBy: { name: 'asc' },
        take: 20,
        select: { id: true, name: true },
      }),
      this.prisma.pointTransaction.groupBy({
        by: ['userId'],
        where: {
          createdAt: { gte: start, lt: end },
          user: { role: UserRole.MEMBER },
        },
        _sum: { points: true },
      }),
    ])

    const weeklyPointsByUserId = new Map(groupedTransactions.map((transaction) => [
      transaction.userId,
      transaction._sum.points ?? 0,
    ]))

    const rows: WeeklyPointsRow[] = users
      .map((user) => ({
        userId: user.id,
        name: user.name,
        points: weeklyPointsByUserId.get(user.id) ?? 0,
      }))
      .sort((first, second) => second.points - first.points || first.name.localeCompare(second.name))

    return rows.map((row, index) => this.toRankingRow(row.name, row.points, index))
  }

  private toRankingRow(name: string, points: number, index: number): RankingRow {
    return [String(index + 1), name, this.getInitial(name), points, this.getTone(index)]
  }

  private getInitial(name: string): string {
    return name.trim().charAt(0).toUpperCase() || '?'
  }

  private getTone(index: number): RankingTone {
    if (index === 0) return 'gold'
    if (index === 1) return 'purple'
    return 'blue'
  }
}

function getCurrentWeekWindow(now = new Date()): { start: Date; end: Date } {
  const start = new Date(now)
  const day = start.getDay()
  const diffToMonday = day === 0 ? -6 : 1 - day
  start.setDate(start.getDate() + diffToMonday)
  start.setHours(0, 0, 0, 0)

  const end = new Date(start)
  end.setDate(start.getDate() + 7)

  return { start, end }
}
