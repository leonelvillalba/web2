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

        // Salud financiera mejorada: combina presupuesto e ingresos vs gastos
        const budget = Number(user.budget) || 0;
        let healthScore: number;

        if (transactionCount === 0) {
          // Sin transacciones → salud neutra alta
          healthScore = 99;
        } else if (totalExpenses === 0) {
          // Solo ingresos, sin gastos → excelente salud
          healthScore = 99;
        } else {
          // Ratio ingresos/gastos (cuánto cubre los ingresos los gastos)
          const incomeRatio = totalIncome > 0
            ? Math.min(100, Math.round((totalIncome / totalExpenses) * 100))
            : 0; // Sin ingresos y con gastos = muy mala salud

          if (budget > 0) {
            // Si hay presupuesto: 40% uso de presupuesto + 60% ratio ingresos/gastos
            const budgetScore = Math.max(0, Math.min(100, Math.round(100 - (totalExpenses / budget) * 100)));
            healthScore = Math.round(budgetScore * 0.4 + incomeRatio * 0.6);
          } else {
            // Sin presupuesto: basarse 100% en ratio ingresos/gastos
            healthScore = incomeRatio;
          }

          // Clamp entre 0 y 99
          healthScore = Math.max(0, Math.min(99, healthScore));
        }

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

  async toggleBan(userId: number) {
    const user = await this.usersRepo.findOne({ where: { id: userId, role: 'user' } });
    if (!user) {
      throw new Error('Usuario no encontrado o es un asesor');
    }
    user.isBanned = !user.isBanned;
    await this.usersRepo.save(user);
    return { success: true, isBanned: user.isBanned };
  }
}
