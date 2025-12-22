import React, { useState, useEffect } from 'react';
import { Income, Category, TransactionFormData } from '../types';
import { incomeAPI, categoriesAPI } from '../services/api';
import TransactionForm from './TransactionForm';

const IncomeList: React.FC = () => {
  const [income, setIncome] = useState<Income[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [incomeData, categoriesData] = await Promise.all([
          incomeAPI.getAll(),
          categoriesAPI.getAll()
        ]);
        setIncome(incomeData);
        setCategories(categoriesData);
      } catch (err) {
        setError('Failed to load income');
        console.error('Income error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddIncome = async (formData: TransactionFormData) => {
    try {
      const newIncome = await incomeAPI.create(formData);
      setIncome([newIncome, ...income]);
      setShowForm(false);
    } catch (err) {
      console.error('Error adding income:', err);
    }
  };

  const handleDeleteIncome = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this income entry?')) {
      try {
        await incomeAPI.delete(id);
        setIncome(income.filter(item => item.id !== id));
      } catch (err) {
        console.error('Error deleting income:', err);
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
        <p className="mt-3">Loading income...</p>
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
        <h1>Income</h1>
        <button
          className="btn btn-success"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Add Income'}
        </button>
      </div>

      {showForm && (
        <TransactionForm
          type="income"
          categories={categories}
          onSubmit={handleAddIncome}
          onCancel={() => setShowForm(false)}
        />
      )}

      <div className="transaction-list">
        {income.length > 0 ? (
          income.map((item) => (
            <div key={item.id} className="transaction-item">
              <div className="transaction-info">
                <div className="description">{item.description}</div>
                <div className="meta">
                  <span className="category">
                    <span
                      className="category-color"
                      style={{ backgroundColor: item.category?.color }}
                    ></span>
                    {item.category?.name}
                  </span>
                  <span className="date">{formatDate(item.date)}</span>
                </div>
              </div>
              <div className="transaction-amount income">
                +{formatCurrency(item.amount)}
              </div>
              <div className="transaction-actions">
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDeleteIncome(item.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <div className="empty-icon">💰</div>
            <div className="empty-text">No income recorded yet</div>
            <p className="text-muted">Start tracking your income by adding your first entry</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default IncomeList;