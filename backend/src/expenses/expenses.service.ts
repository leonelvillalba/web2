import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Expense } from '../entities/expense.entity';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectRepository(Expense)
    private expensesRepo: Repository<Expense>,
  ) {}

  // Obtener todos los gastos de un usuario
  async findAllByUser(userId: number) {
    return this.expensesRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  // Obtener un gasto por ID
  async findOne(id: number) {
    return this.expensesRepo.findOne({ where: { id } });
  }

  // Crear nuevo gasto
  async create(data: Partial<Expense>) {
    const expense = this.expensesRepo.create(data);
    return this.expensesRepo.save(expense);
  }

  // Actualizar gasto
  async update(id: number, data: Partial<Expense>) {
    await this.expensesRepo.update(id, data);
    return this.findOne(id);
  }

  // Eliminar gasto
  async remove(id: number) {
    await this.expensesRepo.delete(id);
    return { deleted: true };
  }

  // Estadísticas por categoría
  async getStatsByUser(userId: number) {
    const expenses = await this.findAllByUser(userId);
    const total = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

    const byCategory: Record<string, number> = {};
    expenses.forEach((e) => {
      if (e.type === 'expense') {
        byCategory[e.category] = (byCategory[e.category] || 0) + Number(e.amount);
      }
    });

    return { total, byCategory, count: expenses.length };
  }
}
