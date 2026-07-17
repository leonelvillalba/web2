import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Expense } from '../entities/expense.entity';
import { SavingsGoal } from '../entities/savings-goal.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    @InjectRepository(Expense) private expensesRepo: Repository<Expense>,
    @InjectRepository(SavingsGoal) private goalsRepo: Repository<SavingsGoal>,
  ) {}

  async getDashboard(userId: number) {
    const user = await this.usersRepo.findOne({ where: { id: userId } });
    if (!user) return null;

    const expenses = await this.expensesRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });

    // Calcular gasto mensual (solo expenses, no ingresos)
    const monthlySpending = expenses
      .filter((e) => e.type === 'expense')
      .reduce((sum, e) => sum + Number(e.amount), 0);

    // Distribución por categoría
    const categoryMap: Record<string, number> = {};
    expenses
      .filter((e) => e.type === 'expense')
      .forEach((e) => {
        categoryMap[e.category] = (categoryMap[e.category] || 0) + Number(e.amount);
      });

    const colors = ['#001736', '#006c47', '#6ffbbe', '#00b4d8', '#7c3aed', '#dc2626'];
    const spendingDistribution = Object.entries(categoryMap).map(([name, value], i) => ({
      name,
      value: monthlySpending > 0 ? Math.round((value / monthlySpending) * 100) : 0,
      color: colors[i % colors.length],
    }));

    // Actividad reciente (últimos 5)
    const recentActivity = expenses.slice(0, 5).map((e) => ({
      id: e.id,
      merchant: e.merchant,
      date: e.date,
      amount: e.type === 'income' ? Number(e.amount) : -Number(e.amount),
      category: e.category,
      type: e.type,
    }));

    // Obtener metas de ahorro reales
    const savingsGoals = await this.goalsRepo.find({
      where: { userId },
      order: { createdAt: 'ASC' },
    });

    return {
      userName: user.firstName,
      balance: 142500,
      monthlySpending,
      budget: Number(user.budget) || 4200,
      savingsGoals: savingsGoals.map(g => ({
        id: g.id,
        name: g.name,
        target: Number(g.target),
        current: Number(g.current),
        color: g.color,
      })),
      recentActivity,
      spendingDistribution: spendingDistribution.length > 0
        ? spendingDistribution
        : [
            { name: 'Vivienda', value: 60, color: '#001736' },
            { name: 'Comida', value: 25, color: '#006c47' },
            { name: 'Transporte', value: 15, color: '#6ffbbe' },
          ],
    };
  }
}
