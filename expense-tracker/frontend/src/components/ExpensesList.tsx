import React, { useState, useEffect } from 'react';
import { Expense, Category, TransactionFormData } from '../types';
import { expensesAPI, categoriesAPI } from '../services/api';
import TransactionForm from './TransactionForm';

const ExpensesList: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [expensesData, categoriesData] = await Promise.all([
          expensesAPI.getAll(),
          categoriesAPI.getAll()
        ]);
        setExpenses(expensesData);
        setCategories(categoriesData);
      } catch (err) {
        setError('Failed to load expenses');
        console.error('Expenses error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddExpense = async (formData: TransactionFormData) => {
    try {
      const newExpense = await expensesAPI.create(formData);
      setExpenses([newExpense, ...expenses]);
      setShowForm(false);
    } catch (err) {
      console.error('Error adding expense:', err);
    }
  };

  const handleDeleteExpense = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await expensesAPI.delete(id);
        setExpenses(expenses.filter(expense => expense.id !== id));
      } catch (err) {
        console.error('Error deleting expense:', err);
      }
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('es-AR');
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="loading-spinner"></div>
        <p className="mt-3">Loading expenses...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger">
        {error}
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Expenses</h1>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Add Expense'}
        </button>
      </div>

      {showForm && (
        <TransactionForm
          type="expense"
          categories={categories}
          onSubmit={handleAddExpense}
          onCancel={() => setShowForm(false)}
        />
      )}

      <div className="transaction-list">
        {expenses.length > 0 ? (
          expenses.map((expense) => (
            <div key={expense.id} className="transaction-item">
              <div className="transaction-info">
                <div className="description">{expense.description}</div>
                <div className="meta">
                  <span className="category">
                    <span
                      className="category-color"
                      style={{ backgroundColor: expense.category?.color }}
                    ></span>
                    {expense.category?.name}
                  </span>
                  <span className="date">{formatDate(expense.date)}</span>
                </div>
              </div>
              <div className="transaction-amount expense">
                -{formatCurrency(expense.amount)}
              </div>
              <div className="transaction-actions">
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDeleteExpense(expense.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📊</div>
            <div className="empty-text">No expenses recorded yet</div>
            <p className="text-muted">Start tracking your expenses by adding your first entry</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpensesList;