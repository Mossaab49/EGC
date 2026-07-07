import { Injectable } from '@nestjs/common'

const monthlyRanking = [
  ['1', 'Yassine Amrani', 'Y', 380, 'gold'],
  ['2', 'Salma Rami', 'S', 352, 'purple'],
  ['3', 'Omar Lahlou', 'O', 331, 'blue'],
  ['4', 'Mohamed B.', 'M', 245, 'blue'],
]

const weeklyRanking = [
  ['1', 'Sara Benali', 'S', 96, 'gold'],
  ['2', 'Omar Lahlou', 'O', 84, 'purple'],
  ['3', 'Yassine Amrani', 'Y', 78, 'blue'],
  ['4', 'Mohamed B.', 'M', 61, 'blue'],
]

@Injectable()
export class RankingService {
  async findAll(period: 'monthly' | 'weekly') {
    return period === 'monthly' ? monthlyRanking : weeklyRanking
  }
}
