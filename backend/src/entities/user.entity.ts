import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from 'typeorm';
import { Expense } from './expense.entity';
import { SavingsGoal } from './savings-goal.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: 'user' })
  role: string; // 'user' o 'advisor'

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  bio: string;

  @Column({ default: 'basic' })
  plan: string; // 'basic' o 'plus'

  @Column({ type: 'decimal', default: 0 })
  budget: number;

  @Column({ default: 'ARS', nullable: true })
  currency: string;

  @Column({ type: 'date', nullable: true })
  lastScanDate: Date;

  @Column({ default: 0 })
  scansToday: number;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Expense, (expense) => expense.user)
  expenses: Expense[];

  @OneToMany(() => SavingsGoal, (goal) => goal.user)
  savingsGoals: SavingsGoal[];
}
