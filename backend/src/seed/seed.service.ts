import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Expense } from '../entities/expense.entity';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    @InjectRepository(Expense) private expensesRepo: Repository<Expense>,
  ) {}

  async onModuleInit() {
    const userCount = await this.usersRepo.count();
    if (userCount > 0) {
      console.log('📦 Base de datos ya tiene datos, omitiendo seed.');
      return;
    }

    console.log('🌱 Sembrando datos iniciales...');

    // 1. Usuario Premium (Plus)
    const premium = await this.usersRepo.save({
      firstName: 'Leonel',
      lastName: 'Villalba',
      email: 'leonel@sanctuary.ai',
      password: '123456',
      role: 'user',
      phone: '+54 11 1234-5678',
      location: 'Buenos Aires, Argentina',
      bio: 'Apasionado por las finanzas personales e inversiones',
      plan: 'plus',
      budget: 4200,
    });

    // 2. Usuario Básico
    const basic = await this.usersRepo.save({
      firstName: 'María',
      lastName: 'González',
      email: 'maria@sanctuary.ai',
      password: '123456',
      role: 'user',
      phone: '+54 11 5555-1234',
      location: 'Córdoba, Argentina',
      bio: 'Comenzando a organizar mis finanzas',
      plan: 'basic',
      budget: 3000,
    });

    // 3. Asesor Financiero
    await this.usersRepo.save({
      firstName: 'Alex',
      lastName: 'Sterling',
      email: 'asesor@sanctuary.ai',
      password: '123456',
      role: 'advisor',
      phone: '+54 11 9876-5432',
      location: 'Buenos Aires, Argentina',
      bio: 'Asesor financiero certificado con 10 años de experiencia',
      plan: 'plus',
      budget: 0,
    });

    // Gastos del usuario Premium
    const premiumExpenses = [
      { merchant: 'Carrefour', amount: 850, date: '2026-04-01', category: 'Supermercado', type: 'expense', userId: premium.id },
      { merchant: 'YPF', amount: 420, date: '2026-04-02', category: 'Transporte', type: 'expense', userId: premium.id },
      { merchant: 'Netflix', amount: 14.99, date: '2026-04-03', category: 'Suscripciones', type: 'expense', userId: premium.id },
      { merchant: 'Salario Mensual', amount: 6400, date: '2026-04-05', category: 'Ingresos', type: 'income', userId: premium.id },
      { merchant: 'Farmacia del Pueblo', amount: 230, date: '2026-04-06', category: 'Salud', type: 'expense', userId: premium.id },
      { merchant: 'Alquiler Departamento', amount: 1850, date: '2026-04-07', category: 'Vivienda', type: 'expense', userId: premium.id },
      { merchant: 'Café Tortoni', amount: 82.40, date: '2026-04-08', category: 'Restaurantes', type: 'expense', userId: premium.id },
      { merchant: 'Movistar', amount: 180, date: '2026-04-09', category: 'Servicios', type: 'expense', userId: premium.id },
      { merchant: 'MercadoLibre', amount: 320, date: '2026-04-10', category: 'Compras', type: 'expense', userId: premium.id },
      { merchant: 'Apple Store', amount: 14.99, date: '2026-04-11', category: 'Suscripciones', type: 'expense', userId: premium.id },
    ];

    // Gastos del usuario Básico
    const basicExpenses = [
      { merchant: 'Día', amount: 450, date: '2026-04-01', category: 'Supermercado', type: 'expense', userId: basic.id },
      { merchant: 'SUBE', amount: 120, date: '2026-04-03', category: 'Transporte', type: 'expense', userId: basic.id },
      { merchant: 'Sueldo', amount: 3800, date: '2026-04-05', category: 'Ingresos', type: 'income', userId: basic.id },
      { merchant: 'Farmacity', amount: 180, date: '2026-04-07', category: 'Salud', type: 'expense', userId: basic.id },
      { merchant: 'Spotify', amount: 8.99, date: '2026-04-09', category: 'Suscripciones', type: 'expense', userId: basic.id },
    ];

    await this.expensesRepo.save([...premiumExpenses, ...basicExpenses]);

    console.log('✅ Seed completado: 3 usuarios + 15 gastos de ejemplo');
    console.log('   📧 Premium: leonel@sanctuary.ai / 123456');
    console.log('   📧 Básico:  maria@sanctuary.ai / 123456');
    console.log('   📧 Asesor:  asesor@sanctuary.ai / 123456');
  }
}
