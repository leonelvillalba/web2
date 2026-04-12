export interface SavingsGoal {
  id: number;
  name: string;
  target: number;
  current: number;
  color: string;
}

export interface Transaction {
  id: number;
  merchant: string;
  date: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
}

export interface DashboardData {
  userName: string;
  balance: number;
  monthlySpending: number;
  budget: number;
  savingsGoals: SavingsGoal[];
  recentActivity: Transaction[];
  spendingDistribution: { name: string; value: number; color: string }[];
}

export interface InsightData {
  potentialSavings: number;
  financialHealth: number;
  spendingVelocity: { month: string; actual: number | null; forecast: number }[];
  aiMessage: string;
}

export interface Client {
  id: number;
  name: string;
  focus: string;
  assets: number;
  change: number;
  budgetAdherence: number;
  status: string;
}
