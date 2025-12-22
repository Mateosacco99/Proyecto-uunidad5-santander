export interface Category {
  id: number;
  name: string;
  color: string;
  created_at?: string;
}

export interface Transaction {
  id: number;
  amount: number;
  description: string;
  date: string;
  category_id: number;
  category?: Category;
  created_at?: string;
  updated_at?: string;
}

export interface Expense extends Transaction {}

export interface Income extends Transaction {}

export interface DashboardSummary {
  month: string;
  year: number;
  total_expenses: number;
  total_income: number;
  balance: number;
  expenses_by_category: CategoryAmount[];
  income_by_category: CategoryAmount[];
}

export interface CategoryAmount {
  name: string;
  color: string;
  amount: number;
}

export interface MonthlyTrend {
  expenses: MonthlyData[];
  income: MonthlyData[];
}

export interface MonthlyData {
  month: string;
  year: number;
  amount: number;
}

export type TransactionType = 'expense' | 'income';

export interface TransactionFormData {
  amount: number;
  description: string;
  date: string;
  category_id: number;
}