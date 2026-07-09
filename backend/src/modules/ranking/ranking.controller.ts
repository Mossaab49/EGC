import { Controller, Get, Query } from '@nestjs/common'
import { RankingService } from './ranking.service'

type RankingPeriod = 'monthly' | 'weekly'

@Controller('ranking')
export class RankingController {
  constructor(private readonly rankingService: RankingService) {}

  @Get()
  findAll(@Query('period') period?: RankingPeriod) {
    return this.rankingService.findAll(period === 'weekly' ? 'weekly' : 'monthly')
  }
}
