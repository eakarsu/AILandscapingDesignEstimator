import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';

function ClientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClient();
  }, [id]);

  const fetchClient = async () => {
    try {
      const res = await api.get(`/clients/${id}`);
      setClient(res.data);
      setFormData(res.data);
    } catch (err) {
      toast.error('Failed to load client');
      navigate('/clients');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put(`/clients/${id}`, formData);
      setClient(res.data);
      setEditing(false);
      toast.success('Client updated!');
    } catch (err) {
      toast.error('Failed to update');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this client?')) return;
    try {
      await api.delete(`/clients/${id}`);
      toast.success('Client deleted!');
      navigate('/clients');
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;
  if (!client) return null;

  const fields = [
    { key: 'firstName', label: 'First Name' },
    { key: 'lastName', label: 'Last Name' },
    { key: 'email', label: 'Email', type: 'email' },
    { key: 'phone', label: 'Phone' },
    { key: 'address', label: 'Address' },
    { key: 'city', label: 'City' },
    { key: 'state', label: 'State' },
    { key: 'zipCode', label: 'Zip Code' },
    { key: 'propertyType', label: 'Property Type', type: 'select', options: ['Residential', 'Commercial', 'Municipal', 'HOA', 'Industrial'] },
    { key: 'propertySize', label: 'Property Size' },
    { key: 'source', label: 'Lead Source', type: 'select', options: ['Referral', 'Website', 'Social Media', 'Google Ads', 'Door-to-Door', 'Trade Show', 'Other'] },
    { key: 'preferredContact', label: 'Preferred Contact', type: 'select', options: ['email', 'phone', 'text'] },
    { key: 'totalSpent', label: 'Total Spent' },
    { key: 'notes', label: 'Notes', type: 'textarea' },
    { key: 'status', label: 'Status' },
  ];

  return (
    <div className="detail-container">
      <Link to="/clients" className="back-link">← Back to Clients</Link>
      <div className="detail-card">
        <h2>👥 {client.firstName} {client.lastName}</h2>
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
              <button type="submit" className="btn btn-primary" style={{ width: 'auto' }}>Save Changes</button>
              <button type="button" className="btn btn-secondary" onClick={() => { setEditing(false); setFormData(client); }}>Cancel</button>
            </div>
          </form>
        ) : (
          <>
            <div className="detail-grid">
              {fields.map(field => (
                <div className="detail-field" key={field.key}>
                  <label>{field.label}</label>
                  <div className="value">
                    {field.key === 'totalSpent' ? `$${(client[field.key] || 0).toLocaleString()}` :
                     field.key === 'status' ? <span className={`status-badge status-${(client[field.key] || '').toLowerCase()}`}>{client[field.key]}</span> :
                     (client[field.key] ?? '—')}
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

export default ClientDetail;
