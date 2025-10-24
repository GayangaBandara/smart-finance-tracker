export const BUDGET_CATEGORIES = [
  { id: 'food', label: 'Food & Dining', icon: '🍽️', defaultPercentage: 25 },
  { id: 'transport', label: 'Transportation', icon: '🚗', defaultPercentage: 15 },
  { id: 'utilities', label: 'Utilities', icon: '💡', defaultPercentage: 10 },
  { id: 'entertainment', label: 'Entertainment', icon: '🎬', defaultPercentage: 10 },
  { id: 'health', label: 'Healthcare', icon: '🏥', defaultPercentage: 10 },
  { id: 'shopping', label: 'Shopping', icon: '🛍️', defaultPercentage: 10 },
  { id: 'education', label: 'Education', icon: '📚', defaultPercentage: 10 },
  { id: 'travel', label: 'Travel', icon: '✈️', defaultPercentage: 5 },
  { id: 'investments', label: 'Investments', icon: '📈', defaultPercentage: 15 },
  { id: 'other', label: 'Other', icon: '📌', defaultPercentage: 5 }
];

export const BUDGET_TEMPLATES = {
  student: {
    name: 'Student Budget',
    description: 'Ideal for students with focus on education and essential expenses',
    categories: {
      education: { percentage: 40, priority: 'high' },
      food: { percentage: 30, priority: 'high' },
      transport: { percentage: 15, priority: 'medium' },
      entertainment: { percentage: 15, priority: 'low' }
    }
  },
  professional: {
    name: 'Professional Budget',
    description: 'Balanced budget for working professionals',
    categories: {
      housing: { percentage: 30, priority: 'high' },
      food: { percentage: 15, priority: 'high' },
      transport: { percentage: 10, priority: 'medium' },
      savings: { percentage: 20, priority: 'high' },
      entertainment: { percentage: 10, priority: 'low' },
      health: { percentage: 10, priority: 'medium' },
      other: { percentage: 5, priority: 'low' }
    }
  },
  familyBudget: {
    name: 'Family Budget',
    description: 'Suitable for families with children',
    categories: {
      housing: { percentage: 35, priority: 'high' },
      food: { percentage: 20, priority: 'high' },
      education: { percentage: 15, priority: 'high' },
      transport: { percentage: 10, priority: 'medium' },
      health: { percentage: 10, priority: 'high' },
      entertainment: { percentage: 5, priority: 'low' },
      savings: { percentage: 5, priority: 'medium' }
    }
  },
  savings: {
    name: 'Savings-Focused Budget',
    description: 'Maximizing savings and investment',
    categories: {
      savings: { percentage: 40, priority: 'high' },
      housing: { percentage: 25, priority: 'high' },
      food: { percentage: 15, priority: 'medium' },
      transport: { percentage: 10, priority: 'medium' },
      other: { percentage: 10, priority: 'low' }
    }
  }
};

export const calculateRecommendedBudget = (monthlyIncome: number, template = 'professional') => {
  const selectedTemplate = BUDGET_TEMPLATES[template as keyof typeof BUDGET_TEMPLATES];
  
  if (!selectedTemplate) {
    throw new Error('Invalid budget template');
  }

  return Object.entries(selectedTemplate.categories).reduce((acc, [category, { percentage }]) => {
    acc[category] = (monthlyIncome * percentage) / 100;
    return acc;
  }, {} as Record<string, number>);
};