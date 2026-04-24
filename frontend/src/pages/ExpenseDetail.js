import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';

function ExpenseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [expense, setExpense] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchExpense(); }, [id]);

  const fetchExpense = async () => {
    try {
      const res = await api.get(`/expenses/${id}`);
      setExpense(res.data);
      setFormData(res.data);
    } catch (err) {
      toast.error('Failed to load expense');
      navigate('/expenses');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put(`/expenses/${id}`, formData);
      setExpense(res.data);
      setEditing(false);
      toast.success('Expense updated!');
    } catch (err) {
      toast.error('Failed to update');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this expense?')) return;
    try {
      await api.delete(`/expenses/${id}`);
      toast.success('Expense deleted!');
      navigate('/expenses');
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const handleChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;
  if (!expense) return null;

  const fields = [
    { key: 'description', label: 'Description' },
    { key: 'amount', label: 'Amount', type: 'number' },
    { key: 'category', label: 'Category', type: 'select', options: ['Fuel', 'Equipment', 'Materials', 'Labor', 'Insurance', 'Vehicle', 'Office', 'Marketing', 'Subcontractor', 'Utilities', 'Rent', 'Maintenance', 'Other'] },
    { key: 'date', label: 'Date', type: 'date' },
    { key: 'vendor', label: 'Vendor' },
    { key: 'paymentMethod', label: 'Payment Method', type: 'select', options: ['Cash', 'Credit Card', 'Debit Card', 'Check', 'Bank Transfer', 'Other'] },
    { key: 'receiptNumber', label: 'Receipt Number' },
    { key: 'projectName', label: 'Project Name' },
    { key: 'taxDeductible', label: 'Tax Deductible', type: 'select', options: ['true', 'false'] },
    { key: 'reimbursable', label: 'Reimbursable', type: 'select', options: ['true', 'false'] },
    { key: 'notes', label: 'Notes', type: 'textarea' },
    { key: 'status', label: 'Status' },
  ];

  return (
    <div className="detail-container">
      <Link to="/expenses" className="back-link">← Back to Expenses</Link>
      <div className="detail-card">
        <h2>💵 {expense.description}</h2>
        {editing ? (
          <form onSubmit={handleUpdate}>
            {fields.map(field => (
              <div className="form-group" key={field.key}>
                <label>{field.label}</label>
                {field.type === 'textarea' ? (
                  <textarea value={formData[field.key] || ''} onChange={e => handleChange(field.key, e.target.value)} rows={3} />
                ) : field.type === 'select' ? (
                  <select value={formData[field.key] || ''} onChange={e => handleChange(field.key, e.target.value)}>
                    <option value="">Select...</option>
                    {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                ) : (
                  <input type={field.type || 'text'} value={formData[field.key] || ''} onChange={e => handleChange(field.key, e.target.value)} />
                )}
              </div>
            ))}
            <div className="detail-actions">
              <button type="submit" className="btn btn-primary" style={{ width: 'auto' }}>Save</button>
              <button type="button" className="btn btn-secondary" onClick={() => { setEditing(false); setFormData(expense); }}>Cancel</button>
            </div>
          </form>
        ) : (
          <>
            <div className="detail-grid">
              {fields.map(field => (
                <div className="detail-field" key={field.key}>
                  <label>{field.label}</label>
                  <div className="value">
                    {field.key === 'amount' ? `$${(expense[field.key] || 0).toLocaleString()}` :
                     field.key === 'taxDeductible' || field.key === 'reimbursable' ? (expense[field.key] ? 'Yes' : 'No') :
                     field.key === 'status' ? <span className={`status-badge status-${(expense[field.key] || '').toLowerCase()}`}>{expense[field.key]}</span> :
                     (expense[field.key] ?? '—')}
                  </div>
                </div>
              ))}
            </div>
            <div className="detail-actions">
              <button className="btn btn-secondary" onClick={() => setEditing(true)}>Edit</button>
              <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ExpenseDetail;
