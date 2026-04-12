import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
  ) {}

  async register(data: { firstName: string; lastName: string; email: string; password: string; role?: string }) {
    const existing = await this.usersRepo.findOne({ where: { email: data.email } });
    if (existing) {
      return { error: 'El email ya está registrado' };
    }

    const user = this.usersRepo.create({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password, // En producción se hashea
      role: data.role || 'user',
      budget: 4200,
    });

    const saved = await this.usersRepo.save(user);
    const { password, ...result } = saved;
    return { user: result };
  }

  async login(email: string, password: string) {
    const user = await this.usersRepo.findOne({ where: { email } });
    if (!user || user.password !== password) {
      return { error: 'Email o contraseña incorrectos' };
    }

    const { password: _, ...result } = user;
    return { user: result };
  }

  async getProfile(userId: number) {
    const user = await this.usersRepo.findOne({ where: { id: userId } });
    if (!user) return null;
    const { password, ...result } = user;
    return result;
  }

  async updateProfile(userId: number, data: Partial<User>) {
    await this.usersRepo.update(userId, data);
    return this.getProfile(userId);
  }
}
