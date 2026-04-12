import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Expense } from '../entities/expense.entity';

@Injectable()
export class AdvisorService {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    @InjectRepository(Expense) private expensesRepo: Repository<Expense>,
  ) {}

  async getClients() {
    const users = await this.usersRepo.find({ where: { role: 'user' } });

    const clients = await Promise.all(
      users.map(async (user) => {
        const expenses = await this.expensesRepo.find({ where: { userId: user.id } });
        const totalSpending = expenses
          .filter((e) => e.type === 'expense')
          .reduce((sum, e) => sum + Number(e.amount), 0);

        const adherence = user.budget > 0
          ? Math.round((totalSpending / Number(user.budget)) * 100)
          : 0;

        return {
          id: user.id,
          name: `${user.firstName} ${user.lastName}`,
          focus: 'Crecimiento',
          assets: Math.round(142500 - totalSpending),
          change: 12.4,
          budgetAdherence: adherence,
          status: adherence <= 100 ? 'Excelente' : 'Fuera de presupuesto',
        };
      }),
    );

    return clients;
  }
}
