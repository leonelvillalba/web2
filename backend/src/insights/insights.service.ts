import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Expense } from '../entities/expense.entity';
import { GeminiService } from '../tickets/gemini.service';

@Injectable()
export class InsightsService {
  constructor(
    @InjectRepository(Expense)
    private expensesRepo: Repository<Expense>,
    private geminiService: GeminiService,
  ) {}

  async getInsights(userId: number) {
    const expenses = await this.expensesRepo.find({ where: { userId } });

    const totalSpending = expenses
      .filter((e) => e.type === 'expense')
      .reduce((sum, e) => sum + Number(e.amount), 0);
      
    // Analizar gastos reales con IA Gemini
    const aiAnalysis = await this.geminiService.analyzeExpenses(expenses);

    return {
      potentialSavings: Math.round(totalSpending * 0.15), // 15% del gasto es ahorro potencial
      financialHealth: 94.2,
      spendingVelocity: [
        { month: 'Ene', actual: 2100, forecast: 2200 },
        { month: 'Feb', actual: 2400, forecast: 2300 },
        { month: 'Mar', actual: 1900, forecast: 2100 },
        { month: 'Abr', actual: 2800, forecast: 2500 },
        { month: 'May', actual: Math.round(totalSpending) || 3142, forecast: 2900 },
        { month: 'Jun', actual: null, forecast: 3000 },
      ],
      aiMessage: aiAnalysis.summary,
      aiRecommendations: aiAnalysis.recommendations,
      aiProfile: aiAnalysis.profile
    };
  }
}
