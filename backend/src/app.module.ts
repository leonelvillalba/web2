import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Expense } from './entities/expense.entity';
import { AuthModule } from './auth/auth.module';
import { ExpensesModule } from './expenses/expenses.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { InsightsModule } from './insights/insights.module';
import { AdvisorModule } from './advisor/advisor.module';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [User, Expense],
      synchronize: true, // Auto-crea tablas (solo desarrollo)
      ssl: {
        rejectUnauthorized: false, // Necesario para Supabase
      },
    }),
    AuthModule,
    ExpensesModule,
    DashboardModule,
    InsightsModule,
    AdvisorModule,
    SeedModule,
  ],
})
export class AppModule {}
