import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SavingsGoal } from '../entities/savings-goal.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class GoalsService {
  constructor(
    @InjectRepository(SavingsGoal) private goalsRepo: Repository<SavingsGoal>,
    @InjectRepository(User) private usersRepo: Repository<User>,
  ) {}

  async findAll(userId: number) {
    return this.goalsRepo.find({
      where: { userId },
      order: { createdAt: 'ASC' },
    });
  }

  async create(userId: number, data: { name: string; target: number; current?: number; color?: string }) {
    const user = await this.usersRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    // Límite para plan básico: máximo 3 metas
    if (user.plan !== 'plus') {
      const count = await this.goalsRepo.count({ where: { userId } });
      if (count >= 3) {
        throw new ForbiddenException('El plan Básico permite hasta 3 metas. Actualizá a Plus para metas ilimitadas.');
      }
    }

    const goal = this.goalsRepo.create({
      name: data.name,
      target: data.target,
      current: data.current || 0,
      color: data.color || '#006c47',
      userId,
    });
    return this.goalsRepo.save(goal);
  }

  async update(goalId: number, userId: number, data: Partial<{ name: string; target: number; current: number; color: string }>) {
    const goal = await this.goalsRepo.findOne({ where: { id: goalId, userId } });
    if (!goal) throw new NotFoundException('Meta no encontrada');

    if (data.name !== undefined) goal.name = data.name;
    if (data.target !== undefined) goal.target = data.target;
    if (data.current !== undefined) goal.current = data.current;
    if (data.color !== undefined) goal.color = data.color;

    return this.goalsRepo.save(goal);
  }

  async remove(goalId: number, userId: number) {
    const goal = await this.goalsRepo.findOne({ where: { id: goalId, userId } });
    if (!goal) throw new NotFoundException('Meta no encontrada');
    await this.goalsRepo.remove(goal);
    return { message: 'Meta eliminada' };
  }
}
