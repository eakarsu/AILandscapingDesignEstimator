import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';

function GenericListPage({ title, icon, endpoint, columns, formFields, defaultValues }) {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(defaultValues || {});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await api.get(endpoint);
      setItems(res.data);
    } catch (err) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post(endpoint, formData);
      toast.success('Created successfully!');
      setShowModal(false);
      setFormData(defaultValues || {});
      fetchItems();
    } catch (err) {
      toast.error('Failed to create');
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div>
      <div className="page-header">
        <h1>{icon} {title}</h1>
        <div className="btn-group">
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            + New {title.replace(/s$/, '').replace(/ies$/, 'y')}
          </button>
        </div>
      </div>

      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map(col => (
                <th key={col.key}>{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={columns.length} style={{ textAlign: 'center', padding: '40px' }}>Loading...</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan={columns.length} style={{ textAlign: 'center', padding: '40px', color: '#6b7c6b' }}>No items yet. Click "New" to add one.</td></tr>
            ) : (
              items.map(item => (
                <tr key={item.id} onClick={() => navigate(`${endpoint.replace('/api', '')}/${item.id}`)}>
                  {columns.map(col => (
                    <td key={col.key}>
                      {col.render ? col.render(item[col.key], item) : item[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Create New {title.replace(/s$/, '').replace(/ies$/, 'y')}</h2>
            <form onSubmit={handleCreate}>
              {formFields.map(field => (
                <div className="form-group" key={field.key}>
                  <label>{field.label}</label>
                  {field.type === 'textarea' ? (
                    <textarea
                      value={formData[field.key] || ''}
                      onChange={e => handleChange(field.key, e.target.value)}
                      rows={3}
                      required={field.required}
                    />
                  ) : field.type === 'select' ? (
                    <select
                      value={formData[field.key] || ''}
                      onChange={e => handleChange(field.key, e.target.value)}
                      required={field.required}
                    >
                      <option value="">Select...</option>
                      {field.options.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type || 'text'}
                      value={formData[field.key] || ''}
                      onChange={e => handleChange(field.key, e.target.value)}
                      required={field.required}
                    />
                  )}
                </div>
              ))}
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ width: 'auto' }}>Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default GenericListPage;
