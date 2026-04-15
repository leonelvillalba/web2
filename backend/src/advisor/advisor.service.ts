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
    // Traer todos los usuarios (no asesores)
    const users = await this.usersRepo.find({ where: { role: 'user' } });

    const clients = await Promise.all(
      users.map(async (user) => {
        const expenses = await this.expensesRepo.find({ where: { userId: user.id } });

        const totalExpenses = expenses
          .filter((e) => e.type === 'expense')
          .reduce((sum, e) => sum + Number(e.amount), 0);

        const totalIncome = expenses
          .filter((e) => e.type === 'income')
          .reduce((sum, e) => sum + Number(e.amount), 0);

        const transactionCount = expenses.length;

        // Salud financiera: % de presupuesto usado
        const budget = Number(user.budget) || 0;
        const healthScore = budget > 0
          ? Math.max(0, Math.min(99, Math.round(100 - (totalExpenses / budget) * 100)))
          : 50;

        const { password, ...userWithoutPw } = user;

        return {
          ...userWithoutPw,
          totalExpenses,
          totalIncome,
          transactionCount,
          healthScore,
        };
      }),
    );

    return clients;
  }
}
