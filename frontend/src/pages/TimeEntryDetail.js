import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';

function TimeEntryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [entry, setEntry] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchEntry(); }, [id]);

  const fetchEntry = async () => {
    try {
      const res = await api.get(`/time-entries/${id}`);
      setEntry(res.data);
      setFormData(res.data);
    } catch (err) {
      toast.error('Failed to load time entry');
      navigate('/time-tracking');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put(`/time-entries/${id}`, formData);
      setEntry(res.data);
      setEditing(false);
      toast.success('Time entry updated!');
    } catch (err) {
      toast.error('Failed to update');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this time entry?')) return;
    try {
      await api.delete(`/time-entries/${id}`);
      toast.success('Time entry deleted!');
      navigate('/time-tracking');
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const handleChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;
  if (!entry) return null;

  const laborCost = (entry.hoursWorked || 0) * (entry.hourlyRate || 0);

  const fields = [
    { key: 'workerName', label: 'Worker' },
    { key: 'projectName', label: 'Project' },
    { key: 'date', label: 'Date', type: 'date' },
    { key: 'startTime', label: 'Start Time', type: 'time' },
    { key: 'endTime', label: 'End Time', type: 'time' },
    { key: 'hoursWorked', label: 'Hours Worked' },
    { key: 'hourlyRate', label: 'Hourly Rate', type: 'number' },
    { key: 'taskType', label: 'Task Type', type: 'select', options: ['Mowing', 'Planting', 'Trimming', 'Mulching', 'Irrigation', 'Hardscaping', 'Cleanup', 'Design', 'Consultation', 'Travel', 'Equipment Maintenance', 'Other'] },
    { key: 'breakMinutes', label: 'Break (min)', type: 'number' },
    { key: 'overtime', label: 'Overtime', type: 'select', options: ['false', 'true'] },
    { key: 'notes', label: 'Notes', type: 'textarea' },
    { key: 'status', label: 'Status' },
  ];

  return (
    <div className="detail-container">
      <Link to="/time-tracking" className="back-link">← Back to Time Tracking</Link>
      <div className="detail-card">
        <h2>⏱️ {entry.workerName} - {entry.date}</h2>
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
              <button type="button" className="btn btn-secondary" onClick={() => { setEditing(false); setFormData(entry); }}>Cancel</button>
            </div>
          </form>
        ) : (
          <>
            <div className="detail-grid">
              {fields.map(field => (
                <div className="detail-field" key={field.key}>
                  <label>{field.label}</label>
                  <div className="value">
                    {field.key === 'hoursWorked' ? `${entry[field.key] || 0}h` :
                     field.key === 'hourlyRate' ? `$${(entry[field.key] || 0).toFixed(2)}/hr` :
                     field.key === 'overtime' ? (entry[field.key] ? 'Yes' : 'No') :
                     field.key === 'status' ? <span className={`status-badge status-${(entry[field.key] || '').toLowerCase()}`}>{entry[field.key]}</span> :
                     (entry[field.key] ?? '—')}
                  </div>
                </div>
              ))}
              <div className="detail-field">
                <label>Labor Cost</label>
                <div className="value" style={{ fontWeight: 'bold', color: '#2d6a4f' }}>${laborCost.toFixed(2)}</div>
              </div>
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

export default TimeEntryDetail;
