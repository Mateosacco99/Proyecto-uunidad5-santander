import React, { useState } from 'react';
import { TransactionFormData, Category, TransactionType } from '../types';

interface TransactionFormProps {
  type: TransactionType;
  categories: Category[];
  onSubmit: (data: TransactionFormData) => void;
  onCancel: () => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ 
  type, 
  categories, 
  onSubmit, 
  onCancel 
}) => {
  const [formData, setFormData] = useState<TransactionFormData>({
    amount: 0,
    description: '',
    date: new Date().toISOString().split('T')[0],
    category_id: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    
    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.category_id) {
      newErrors.category_id = 'Category is required';
    }
    
    if (!formData.date) {
      newErrors.date = 'Date is required';
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
      [name]: name === 'amount' || name === 'category_id' 
        ? Number(value) 
        : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="transaction-form">
      <h3>Add {type === 'expense' ? 'Expense' : 'Income'}</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="amount">Amount</label>
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
            <label htmlFor="category_id">Category</label>
            <select
              id="category_id"
              name="category_id"
              className={`form-control ${errors.category_id ? 'is-invalid' : ''}`}
              value={formData.category_id}
              onChange={handleInputChange}
            >
              <option value={0}>Select a category</option>
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
            <label htmlFor="date">Date</label>
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
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            rows={3}
            className={`form-control ${errors.description ? 'is-invalid' : ''}`}
            value={formData.description}
            onChange={handleInputChange}
            placeholder={`Enter ${type} description...`}
          />
          {errors.description && (
            <div className="invalid-feedback">{errors.description}</div>
          )}
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-outline" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className={`btn ${type === 'expense' ? 'btn-primary' : 'btn-success'}`}>
            Add {type === 'expense' ? 'Expense' : 'Income'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;