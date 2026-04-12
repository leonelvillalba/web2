import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('expenses')
export class Expense {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  merchant: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column()
  date: string;

  @Column()
  category: string;

  @Column({ default: 'expense' })
  type: string; // 'expense' o 'income'

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => User, (user) => user.expenses, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  userId: number;

  @CreateDateColumn()
  createdAt: Date;
}
