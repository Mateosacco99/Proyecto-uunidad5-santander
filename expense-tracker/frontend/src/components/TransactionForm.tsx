import React, { useState } from 'react';
import { TransactionFormData, Category, TransactionType } from '../types';
import {Lang, translations} from '../lang';

interface TransactionFormProps {
  type: TransactionType;
  categories: Category[];
  onSubmit: (data: TransactionFormData) => void;
  onCancel: () => void;
  lang: Lang;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ 
  type, 
  categories, 
  onSubmit, 
  onCancel,
  lang
}) => {
  const [formData, setFormData] = useState<TransactionFormData>({
    amount: 0,
    description: '',
    date: new Date().toISOString().split('T')[0],
    category_id: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const t = translations[lang];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    
    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = t.ammount_greater_than_zero;
    }
    
    if (!formData.description.trim()) {
      newErrors.description = t.description_required;
    }
    
    if (!formData.category_id) {
      newErrors.category_id = t.category_required;
    }
    
    if (!formData.date) {
      newErrors.date = t.date_required;
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSubmit(formData);
      setFormData({
        amount: 0,
        description: '',
        date: new Date().toISOString().split('T')[0],
        category_id: 0,
      });
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === t.amount || name === t.category 
        ? Number(value) 
        : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="transaction-form">
      <h3>Add {type === t.expense ? t.expense : t.income}</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="amount">{t.amount}</label>
            <input
              type="number"
              id="amount"
              name="amount"
              step="0.01"
              min="0"
              className={`form-control ${errors.amount ? 'is-invalid' : ''}`}
              value={formData.amount || ''}
              onChange={handleInputChange}
              placeholder="0.00"
            />
            {errors.amount && (
              <div className="invalid-feedback">{errors.amount}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="category_id">{t.category}</label>
            <select
              id="category_id"
              name="category_id"
              className={`form-control ${errors.category_id ? 'is-invalid' : ''}`}
              value={formData.category_id}
              onChange={handleInputChange}
            >
              <option value={0}>{t.select_a_category}</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.category_id && (
              <div className="invalid-feedback">{errors.category_id}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="date">{t.date}</label>
            <input
              type="date"
              id="date"
              name="date"
              className={`form-control ${errors.date ? 'is-invalid' : ''}`}
              value={formData.date}
              onChange={handleInputChange}
            />
            {errors.date && (
              <div className="invalid-feedback">{errors.date}</div>
            )}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description">{t.description}</label>
          <textarea
            id="description"
            name="description"
            rows={3}
            className={`form-control ${errors.description ? 'is-invalid' : ''}`}
            value={formData.description}
            onChange={handleInputChange}
            placeholder={t.enter_transaction_description}
          />
          {errors.description && (
            <div className="invalid-feedback">{errors.description}</div>
          )}
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-outline" onClick={onCancel}>
            {t.cancel}
          </button>
          <button type="submit" className={`btn ${type === t.expense ? 'btn-primary' : 'btn-success'}`}>
            {t.add_transaction}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;