import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { User } from '../entities/user.entity';
import { Expense } from '../entities/expense.entity';
import { SavingsGoal } from '../entities/savings-goal.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Expense, SavingsGoal])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
