import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Expense } from '../entities/expense.entity';

@Injectable()
export class InsightsService {
  constructor(
    @InjectRepository(Expense)
    private expensesRepo: Repository<Expense>,
  ) {}

  async getInsights(userId: number) {
    const expenses = await this.expensesRepo.find({ where: { userId } });

    const totalSpending = expenses
      .filter((e) => e.type === 'expense')
      .reduce((sum, e) => sum + Number(e.amount), 0);

    return {
      potentialSavings: Math.round(totalSpending * 0.15), // 15% del gasto es ahorro potencial
      financialHealth: 94.2,
      spendingVelocity: [
        { month: 'Ene', actual: 2100, forecast: 2200 },
        { month: 'Feb', actual: 2400, forecast: 2300 },
        { month: 'Mar', actual: 1900, forecast: 2100 },
        { month: 'Abr', actual: 2800, forecast: 2500 },
        { month: 'May', actual: Math.round(totalSpending) || 3142, forecast: 2900 },
        { month: 'Jun', actual: null, forecast: 3000 },
      ],
      aiMessage:
        'Su fondo de emergencia actual cubre 4,2 meses. Si reasigna $200 de cenas fuera a sus ahorros de alto rendimiento, alcanzará su meta de 6 meses para septiembre.',
    };
  }
}
