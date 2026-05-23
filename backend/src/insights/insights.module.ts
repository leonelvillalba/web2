import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InsightsController } from './insights.controller';
import { InsightsService } from './insights.service';
import { Expense } from '../entities/expense.entity';
import { TicketsModule } from '../tickets/tickets.module';

@Module({
  imports: [TypeOrmModule.forFeature([Expense]), TicketsModule],
  controllers: [InsightsController],
  providers: [InsightsService],
})
export class InsightsModule {}
