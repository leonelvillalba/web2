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

    // 1. Calcular Balance Histórico Total (Ingresos históricos - Gastos históricos)
    const totalIncome = expenses
      .filter((e) => e.type === 'income')
      .reduce((sum, e) => sum + Number(e.amount), 0);
    const totalExpense = expenses
      .filter((e) => e.type === 'expense')
      .reduce((sum, e) => sum + Number(e.amount), 0);
    const balance = totalIncome - totalExpense;

    // 2. Filtrar transacciones del mes y año actual
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-indexed (0 = Enero, 11 = Diciembre)

    const monthlyExpenses = expenses.filter((e) => {
      if (!e.date) return false;
      // Las fechas vienen como 'YYYY-MM-DD'
      const parts = e.date.split('-');
      if (parts.length < 3) return false;
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; // Ajustar a 0-indexed
      return year === currentYear && month === currentMonth;
    });

    // Calcular gasto mensual actual
    const monthlySpending = monthlyExpenses
      .filter((e) => e.type === 'expense')
      .reduce((sum, e) => sum + Number(e.amount || 0), 0);

    // Calcular ingresos mensuales actuales
    const monthlyIncomeSum = monthlyExpenses
      .filter((e) => e.type === 'income')
      .reduce((sum, e) => sum + Number(e.amount || 0), 0);

    // Distribución por categoría del mes actual
    const categoryMap: Record<string, number> = {};
    monthlyExpenses
      .filter((e) => e.type === 'expense')
      .forEach((e) => {
        categoryMap[e.category] = (categoryMap[e.category] || 0) + Number(e.amount || 0);
      });

    const colors = ['#001736', '#006c47', '#6ffbbe', '#00b4d8', '#7c3aed', '#dc2626'];
    const spendingDistribution = Object.entries(categoryMap).map(([name, value], i) => ({
      name,
      value: monthlySpending > 0 ? Math.round((value / monthlySpending) * 100) : 0,
      color: colors[i % colors.length],
    }));

    // Actividad reciente (últimos 5 globales)
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
      balance,
      monthlySpending,
      monthlyIncome: monthlyIncomeSum,
      budget: Number(user.budget) || 0,
      savingsGoals: savingsGoals.map(g => ({
        id: g.id,
        name: g.name,
        target: Number(g.target),
        current: Number(g.current),
        color: g.color,
      })),
      recentActivity,
      spendingDistribution,
    };
  }
}
