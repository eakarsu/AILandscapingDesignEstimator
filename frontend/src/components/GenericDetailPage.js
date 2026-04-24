import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import AIResponseDisplay from './AIResponseDisplay';

function GenericDetailPage({ title, icon, endpoint, fields, aiField, aiEndpoint, aiButtonLabel, aiTitle, listPath }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [aiLoading, setAiLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItem();
  }, [id]);

  const fetchItem = async () => {
    try {
      const res = await api.get(`${endpoint}/${id}`);
      setItem(res.data);
      setFormData(res.data);
    } catch (err) {
      toast.error('Failed to load item');
      navigate(listPath);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put(`${endpoint}/${id}`, formData);
      setItem(res.data);
      setEditing(false);
      toast.success('Updated successfully!');
    } catch (err) {
      toast.error('Failed to update');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      await api.delete(`${endpoint}/${id}`);
      toast.success('Deleted successfully!');
      navigate(listPath);
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const handleAI = async () => {
    setAiLoading(true);
    try {
      const res = await api.post(`${endpoint}/${id}/${aiEndpoint}`);
      setItem(res.data);
      toast.success('AI analysis complete!');
    } catch (err) {
      toast.error('AI generation failed: ' + (err.response?.data?.error || 'Unknown error'));
    } finally {
      setAiLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;
  }

  if (!item) return null;

  return (
    <div className="detail-container">
      <Link to={listPath} className="back-link">← Back to {title}</Link>

      <div className="detail-card">
        <h2>{icon} {item.title || item.name}</h2>

        {editing ? (
          <form onSubmit={handleUpdate}>
            {fields.map(field => (
              <div className="form-group" key={field.key}>
                <label>{field.label}</label>
                {field.type === 'textarea' ? (
                  <textarea
                    value={formData[field.key] || ''}
                    onChange={e => handleChange(field.key, e.target.value)}
                    rows={3}
                  />
                ) : field.type === 'select' ? (
                  <select
                    value={formData[field.key] || ''}
                    onChange={e => handleChange(field.key, e.target.value)}
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
                  />
                )}
              </div>
            ))}
            <div className="detail-actions">
              <button type="submit" className="btn btn-primary" style={{ width: 'auto' }}>Save Changes</button>
              <button type="button" className="btn btn-secondary" onClick={() => { setEditing(false); setFormData(item); }}>Cancel</button>
            </div>
          </form>
        ) : (
          <>
            <div className="detail-grid">
              {fields.map(field => (
                <div className="detail-field" key={field.key}>
                  <label>{field.label}</label>
                  <div className="value">
                    {field.render ? field.render(item[field.key], item) :
                      field.key === 'status' ? (
                        <span className={`status-badge status-${(item[field.key] || '').toLowerCase().replace(/\s+/g, '-')}`}>
                          {item[field.key]}
                        </span>
                      ) : (item[field.key] ?? '—')}
                  </div>
                </div>
              ))}
            </div>
            <div className="detail-actions">
              <button className="btn btn-secondary" onClick={() => setEditing(true)}>Edit</button>
              <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
              <button className="btn btn-ai" onClick={handleAI} disabled={aiLoading}>
                {aiLoading ? (
                  <><span className="spinner" style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }}></span> Generating...</>
                ) : (
                  <>✨ {aiButtonLabel}</>
                )}
              </button>
            </div>
          </>
        )}
      </div>

      {aiLoading && (
        <div className="ai-response">
          <div className="ai-loading">
            <div className="spinner"></div>
            AI is analyzing and generating recommendations...
          </div>
        </div>
      )}

      {item[aiField] && !aiLoading && (
        <AIResponseDisplay content={item[aiField]} title={aiTitle} />
      )}
    </div>
  );
}

export default GenericDetailPage;
