import { Controller, Get, Query } from '@nestjs/common';
import { InsightsService } from './insights.service';

@Controller('insights')
export class InsightsController {
  constructor(private insightsService: InsightsService) {}

  @Get()
  getInsights(@Query('userId') userId: string) {
    return this.insightsService.getInsights(+userId || 1);
  }
}
