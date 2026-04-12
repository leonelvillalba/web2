import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdvisorController } from './advisor.controller';
import { AdvisorService } from './advisor.service';
import { User } from '../entities/user.entity';
import { Expense } from '../entities/expense.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Expense])],
  controllers: [AdvisorController],
  providers: [AdvisorService],
})
export class AdvisorModule {}
