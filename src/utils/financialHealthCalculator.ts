interface FinancialHealth {
  savingsScore: number;
  budgetAdherenceScore: number;
  debtManagementScore: number;
  overallScore: number;
  recommendations: string[];
}

interface UserData {
  income: number;
  expenses: number;
  savings: number;
  debt: number;
  budgets: Array<{ category: string; planned: number; actual: number }>;
}

export class FinancialHealthCalculator {
  static calculateHealth(userData: UserData): FinancialHealth {
    const savingsScore = this.calculateSavingsScore(userData);
    const budgetScore = this.calculateBudgetAdherenceScore(userData);
    const debtScore = this.calculateDebtManagementScore(userData);
    
    const overallScore = (savingsScore + budgetScore + debtScore) / 3;
    
    return {
      savingsScore,
      budgetAdherenceScore: budgetScore,
      debtManagementScore: debtScore,
      overallScore,
      recommendations: this.generateRecommendations({
        savingsScore,
        budgetScore,
        debtScore,
        userData
      })
    };
  }

  private static calculateSavingsScore(userData: UserData): number {
    const savingsRate = (userData.savings / userData.income) * 100;
    
    if (savingsRate >= 20) return 100;
    if (savingsRate >= 15) return 80;
    if (savingsRate >= 10) return 60;
    if (savingsRate >= 5) return 40;
    return 20;
  }

  private static calculateBudgetAdherenceScore(userData: UserData): number {
    const adherenceScores = userData.budgets.map(budget => {
      const difference = Math.abs(budget.planned - budget.actual);
      const adherenceRate = 100 - ((difference / budget.planned) * 100);
      return Math.max(0, Math.min(100, adherenceRate));
    });

    return adherenceScores.reduce((sum, score) => sum + score, 0) / adherenceScores.length;
  }

  private static calculateDebtManagementScore(userData: UserData): number {
    const debtToIncomeRatio = (userData.debt / userData.income) * 100;
    
    if (debtToIncomeRatio <= 15) return 100;
    if (debtToIncomeRatio <= 30) return 80;
    if (debtToIncomeRatio <= 45) return 60;
    if (debtToIncomeRatio <= 60) return 40;
    return 20;
  }

  private static generateRecommendations({ 
    savingsScore, 
    budgetScore, 
    debtScore, 
    userData 
  }: {
    savingsScore: number;
    budgetScore: number;
    debtScore: number;
    userData: UserData;
  }): string[] {
    const recommendations: string[] = [];

    // Savings recommendations
    if (savingsScore < 60) {
      recommendations.push('Consider increasing your monthly savings rate');
      recommendations.push('Review non-essential expenses for potential savings');
    }

    // Budget recommendations
    if (budgetScore < 70) {
      recommendations.push('Try to stick more closely to your planned budget');
      recommendations.push('Review categories with the largest discrepancies');
    }

    // Debt recommendations
    if (debtScore < 60) {
      recommendations.push('Focus on reducing high-interest debt');
      recommendations.push('Consider debt consolidation options');
    }

    // General recommendations
    if (userData.expenses > userData.income * 0.9) {
      recommendations.push('Your expenses are very close to your income. Look for ways to reduce spending.');
    }

    return recommendations;
  }
}