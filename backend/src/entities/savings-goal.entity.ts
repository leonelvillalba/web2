import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('savings_goals')
export class SavingsGoal {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  target: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  current: number;

  @Column({ default: '#006c47' })
  color: string;

  @ManyToOne(() => User, (user) => user.savingsGoals, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  userId: number;

  @CreateDateColumn()
  createdAt: Date;
}
