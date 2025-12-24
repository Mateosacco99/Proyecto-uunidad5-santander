import React, { useState, useEffect } from 'react';
import { Lang, translations } from '../lang';
import { Income, Category, TransactionFormData } from '../types';
import { incomeAPI, categoriesAPI } from '../services/api';
import TransactionForm from './TransactionForm';

interface IncomeListProps {
  lang: Lang;
}

const IncomeList: React.FC<IncomeListProps> = ({ lang }) => {
  const [income, setIncome] = useState<Income[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const t = translations[lang];

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
        setError(t.failed_to_load_income);
        console.error({[t.income_error]: err});
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
    if (window.confirm(t.delete_income)) {
      try {
        await incomeAPI.delete(id);
        setIncome(income.filter(item => item.id !== id));
      } catch (err) {
        console.error(t.delete_income_error, err);
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
        <p className="mt-3">{t.loading_income}</p>
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
        <h1>{t.income}</h1>
        <button
          className="btn btn-success"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? t.cancel : t.add_income}
        </button>
      </div>

      {showForm && (
        <TransactionForm
          type="income"
          categories={categories}
          onSubmit={handleAddIncome}
          onCancel={() => setShowForm(false)}
          lang={lang}
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
                  {t.delete}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <div className="empty-icon">💰</div>
            <div className="empty-text">{t.no_income}</div>
            <p className="text-muted">{t.start_tracking_income}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default IncomeList;