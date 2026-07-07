import { Controller, Get, Query } from '@nestjs/common'
import { RankingService } from './ranking.service'

@Controller('ranking')
export class RankingController {
  constructor(private readonly rankingService: RankingService) {}

  @Get()
  findAll(@Query('period') period?: 'monthly' | 'weekly') {
    return this.rankingService.findAll(period ?? 'monthly')
  }
}
