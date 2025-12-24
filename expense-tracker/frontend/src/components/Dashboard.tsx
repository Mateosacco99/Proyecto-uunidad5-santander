import React, { useState, useEffect } from 'react';
import { Lang, translations } from '../lang';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { DashboardSummary } from '../types';
import { dashboardAPI } from '../services/api';

ChartJS.register(ArcElement, Tooltip, Legend);

interface DashboardProps {
  lang: Lang;
}

const Dashboard: React.FC<DashboardProps> = ({ lang }) => {
    const t = translations[lang];
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        const data = await dashboardAPI.getSummary();
        setSummary(data);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error('Dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="loading-spinner"></div>
        <p className="mt-3">{t.loading_dashboard}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger">
        {t.dashboard_error}
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="alert alert-warning">
        {t.no_data}
      </div>
    );
  }

  return (
    <div className="dashboard">
      <h1>{t.dashboard} - {summary.month} {summary.year}</h1>
      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card income">
          <div className="label">{t.total_income}</div>
          <div className="amount positive">
            {formatCurrency(summary.total_income)}
          </div>
        </div>
        <div className="summary-card expenses">
          <div className="label">{t.total_expenses}</div>
          <div className="amount negative">
            {formatCurrency(summary.total_expenses)}
          </div>
        </div>
        
        <div className={`summary-card balance ${summary.balance < 0 ? 'negative' : ''}`}>
          <div className="label">Balance</div>
          <div className={`amount ${summary.balance >= 0 ? 'positive' : 'negative'}`}>
            {formatCurrency(summary.balance)}
          </div>
        </div>
      </div>

      <div className="row">
        {/* Expenses by Category */}
        <div className="col-6">
          <div className="card">
            <div className="card-header">
              <h3>Expenses by Category</h3>
            </div>
            <div className="card-body">
              {summary.expenses_by_category.length > 0 ? (
                <div className="chart-wrapper">
                  <Pie
                    data={{
                      labels: summary.expenses_by_category.map(c => c.name),
                      datasets: [
                        {
                          data: summary.expenses_by_category.map(c => c.amount),
                          backgroundColor: summary.expenses_by_category.map(c => c.color),
                          borderColor: '#fff',
                          borderWidth: 2,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: true,
                      plugins: {
                        legend: {
                          position: 'bottom',
                          labels: {
                            padding: 15,
                            font: {
                              size: 12,
                            },
                          },
                        },
                        tooltip: {
                          callbacks: {
                            label: function(context) {
                              const label = context.label || '';
                              const value = context.parsed || 0;
                              return `${label}: ${formatCurrency(value)}`;
                            },
                          },
                        },
                      },
                    }}
                  />
                  <div className="category-list mt-3">
                    {summary.expenses_by_category.map((category, index) => (
                      <div key={index} className="category-item">
                        <div className="category-info">
                          <span 
                            className="category-color" 
                            style={{ backgroundColor: category.color }}
                          ></span>
                          <span className="category-name">{category.name}</span>
                        </div>
                        <div className="category-amount">
                          {formatCurrency(category.amount)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-muted">No expenses recorded this month</p>
              )}
            </div>
          </div>
        </div>

        {/* Income by Category */}
        <div className="col-6">
          <div className="card">
            <div className="card-header">
              <h3>Income by Category</h3>
            </div>
            <div className="card-body">
              {summary.income_by_category.length > 0 ? (
                <div className="chart-wrapper">
                  <Pie
                    data={{
                      labels: summary.income_by_category.map(c => c.name),
                      datasets: [
                        {
                          data: summary.income_by_category.map(c => c.amount),
                          backgroundColor: summary.income_by_category.map(c => c.color),
                          borderColor: '#fff',
                          borderWidth: 2,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: true,
                      plugins: {
                        legend: {
                          position: 'bottom',
                          labels: {
                            padding: 15,
                            font: {
                              size: 12,
                            },
                          },
                        },
                        tooltip: {
                          callbacks: {
                            label: function(context) {
                              const label = context.label || '';
                              const value = context.parsed || 0;
                              return `${label}: ${formatCurrency(value)}`;
                            },
                          },
                        },
                      },
                    }}
                  />
                  <div className="category-list mt-3">
                    {summary.income_by_category.map((category, index) => (
                      <div key={index} className="category-item">
                        <div className="category-info">
                          <span 
                            className="category-color" 
                            style={{ backgroundColor: category.color }}
                          ></span>
                          <span className="category-name">{category.name}</span>
                        </div>
                        <div className="category-amount">
                          {formatCurrency(category.amount)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-muted">No income recorded this month</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;