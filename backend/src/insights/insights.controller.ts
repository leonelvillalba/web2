import { Controller, Get, UseGuards, ForbiddenException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../entities/user.entity';
import { InsightsService } from './insights.service';

@Controller('insights')
@UseGuards(JwtAuthGuard)
export class InsightsController {
  constructor(private insightsService: InsightsService) {}

  @Get()
  getInsights(@GetUser() user: User) {
    if (user.plan === 'basic') {
      throw new ForbiddenException('Las estadísticas avanzadas requieren plan Plus.');
    }
    return this.insightsService.getInsights(user.id);
  }
}
