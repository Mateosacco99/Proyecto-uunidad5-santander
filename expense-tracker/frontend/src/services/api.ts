import axios from 'axios';
import { 
  Category, 
  Expense, 
  Income, 
  DashboardSummary, 
  MonthlyTrend, 
  TransactionFormData 
} from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const categoriesAPI = {
  getAll: (): Promise<Category[]> => 
    api.get('/categories/').then(response => response.data),
  
  create: (category: Omit<Category, 'id'>): Promise<Category> =>
    api.post('/categories/', category).then(response => response.data),
  
  update: (id: number, category: Partial<Category>): Promise<Category> =>
    api.put(`/categories/${id}`, category).then(response => response.data),
  
  delete: (id: number): Promise<void> =>
    api.delete(`/categories/${id}`).then(() => undefined),
};

// Expenses API
export const expensesAPI = {
  getAll: (startDate?: string, endDate?: string): Promise<Expense[]> => {
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    
    return api.get(`/expenses/?${params.toString()}`).then(response => response.data);
  },
  
  getById: (id: number): Promise<Expense> =>
    api.get(`/expenses/${id}`).then(response => response.data),
  
  create: (expense: TransactionFormData): Promise<Expense> =>
    api.post('/expenses/', expense).then(response => response.data),
  
  update: (id: number, expense: Partial<TransactionFormData>): Promise<Expense> =>
    api.put(`/expenses/${id}`, expense).then(response => response.data),
  
  delete: (id: number): Promise<void> =>
    api.delete(`/expenses/${id}`).then(() => undefined),
};

export const incomeAPI = {
  getAll: (startDate?: string, endDate?: string): Promise<Income[]> => {
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    
    return api.get(`/income/?${params.toString()}`).then(response => response.data);
  },
  
  getById: (id: number): Promise<Income> =>
    api.get(`/income/${id}`).then(response => response.data),
  
  create: (income: TransactionFormData): Promise<Income> =>
    api.post('/income/', income).then(response => response.data),
  
  update: (id: number, income: Partial<TransactionFormData>): Promise<Income> =>
    api.put(`/income/${id}`, income).then(response => response.data),
  
  delete: (id: number): Promise<void> =>
    api.delete(`/income/${id}`).then(() => undefined),
};

export const dashboardAPI = {
  getSummary: (year?: number, month?: number): Promise<DashboardSummary> => {
    const params = new URLSearchParams();
    if (year) params.append('year', year.toString());
    if (month) params.append('month', month.toString());
    
    return api.get(`/dashboard/summary?${params.toString()}`).then(response => response.data);
  },
  
  getMonthlyTrend: (): Promise<MonthlyTrend> =>
    api.get('/dashboard/monthly-trend').then(response => response.data),
};

export default api;