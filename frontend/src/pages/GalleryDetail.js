import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import AIResponseDisplay from '../components/AIResponseDisplay';

const fields = [
  { key: 'title', label: 'Title' },
  { key: 'projectName', label: 'Project Name' },
  { key: 'category', label: 'Category', type: 'select', options: ['Before/After', 'Design', 'Progress', 'Completed', 'Aerial'] },
  { key: 'description', label: 'Description', type: 'textarea' },
  { key: 'location', label: 'Location' },
  { key: 'dateTaken', label: 'Date Taken', type: 'date' },
  { key: 'beforeAfter', label: 'Before/After', type: 'select', options: ['Before', 'During', 'After'] },
  { key: 'tags', label: 'Tags' },
  { key: 'status', label: 'Status' },
];

function GalleryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [visionLoading, setVisionLoading] = useState(false);
  const [visionResult, setVisionResult] = useState(null);

  useEffect(() => { fetchItem(); }, [id]);

  const fetchItem = async () => {
    try {
      const res = await api.get(`/gallery/${id}`);
      setItem(res.data);
      setFormData(res.data);
    } catch (err) {
      toast.error('Failed to load photo');
      navigate('/gallery');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put(`/gallery/${id}`, formData);
      setItem(res.data);
      setEditing(false);
      toast.success('Updated successfully!');
    } catch (err) {
      toast.error('Failed to update');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this photo?')) return;
    try {
      await api.delete(`/gallery/${id}`);
      toast.success('Deleted successfully!');
      navigate('/gallery');
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const handleAIAnalyze = async () => {
    setAiLoading(true);
    try {
      const res = await api.post(`/gallery/${id}/analyze`);
      setItem(res.data);
      toast.success('AI analysis complete!');
    } catch (err) {
      toast.error('AI analysis failed: ' + (err.response?.data?.error || 'Unknown error'));
    } finally {
      setAiLoading(false);
    }
  };

  const handleVisionAnalyze = async () => {
    setVisionLoading(true);
    setVisionResult(null);
    try {
      const res = await api.post(`/gallery/${id}/ai-vision`);
      setVisionResult(res.data);
      toast.success('Vision analysis complete!');
    } catch (err) {
      toast.error('Vision analysis failed: ' + (err.response?.data?.error || 'Unknown error'));
    } finally {
      setVisionLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;
  if (!item) return null;

  const visionData = visionResult?.structured || item.aiAnalysisJson;

  return (
    <div className="detail-container">
      <Link to="/gallery" className="back-link">← Back to Gallery</Link>

      <div className="detail-card">
        <h2>📸 {item.title || item.name}</h2>

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
                    {field.key === 'status' ? (
                      <span className={`status-badge status-${(item[field.key] || '').toLowerCase().replace(/\s+/g, '-')}`}>{item[field.key]}</span>
                    ) : (item[field.key] ?? '—')}
                  </div>
                </div>
              ))}
            </div>
            <div className="detail-actions" style={{ flexWrap: 'wrap', gap: '8px' }}>
              <button className="btn btn-secondary" onClick={() => setEditing(true)}>Edit</button>
              <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
              <button className="btn btn-ai" onClick={handleAIAnalyze} disabled={aiLoading}>
                {aiLoading ? (
                  <><span className="spinner" style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }}></span> Analyzing...</>
                ) : '✨ AI Photo Analysis'}
              </button>
              <button className="btn btn-ai" onClick={handleVisionAnalyze} disabled={visionLoading} style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
                {visionLoading ? (
                  <><span className="spinner" style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }}></span> Analyzing Image...</>
                ) : '👁 AI Analyze Photo'}
              </button>
            </div>
          </>
        )}
      </div>

      {/* Vision Analysis Loading */}
      {visionLoading && (
        <div className="ai-response" style={{ marginTop: '16px' }}>
          <div className="ai-loading"><div className="spinner"></div> AI Vision is analyzing the landscape...</div>
        </div>
      )}

      {/* Vision Analysis Result */}
      {visionData && !visionLoading && (
        <div className="ai-response" style={{ marginTop: '16px' }}>
          <h3>👁 AI Vision Analysis</h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px', marginBottom: '20px' }}>
            {visionData.turf_type && (
              <div style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '10px', padding: '12px' }}>
                <div style={{ color: '#94a3b8', fontSize: '11px', fontWeight: 600, marginBottom: '4px' }}>TURF TYPE</div>
                <div style={{ color: '#e2e8f0', fontWeight: 600 }}>{visionData.turf_type}</div>
              </div>
            )}
            {visionData.tree_count !== undefined && (
              <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '10px', padding: '12px' }}>
                <div style={{ color: '#94a3b8', fontSize: '11px', fontWeight: 600, marginBottom: '4px' }}>TREE COUNT</div>
                <div style={{ color: '#22c55e', fontWeight: 700, fontSize: '20px' }}>{visionData.tree_count}</div>
              </div>
            )}
            {visionData.estimated_square_footage && (
              <div style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '10px', padding: '12px' }}>
                <div style={{ color: '#94a3b8', fontSize: '11px', fontWeight: 600, marginBottom: '4px' }}>EST. SQ FOOTAGE</div>
                <div style={{ color: '#f59e0b', fontWeight: 700, fontSize: '18px' }}>{visionData.estimated_square_footage.toLocaleString()}</div>
              </div>
            )}
          </div>

          {visionData.landscape_elements && visionData.landscape_elements.length > 0 && (
            <div className="ai-section">
              <div className="ai-section-title">Landscape Elements</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '10px' }}>
                {visionData.landscape_elements.map((el, i) => (
                  <div key={i} style={{ background: 'rgba(15,23,42,0.4)', borderRadius: '8px', padding: '10px' }}>
                    <div style={{ fontWeight: 600, color: '#e2e8f0', marginBottom: '4px' }}>{el.type}</div>
                    <div style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '4px' }}>{el.description}</div>
                    {el.condition && <span style={{ background: 'rgba(99,102,241,0.15)', color: '#818cf8', borderRadius: '4px', padding: '2px 8px', fontSize: '11px' }}>{el.condition}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {visionData.hardscape_features && (
            <div className="ai-section">
              <div className="ai-section-title">Hardscape Features</div>
              <div style={{ color: '#94a3b8', fontSize: '14px' }}>
                {Array.isArray(visionData.hardscape_features)
                  ? visionData.hardscape_features.join(', ')
                  : visionData.hardscape_features}
              </div>
            </div>
          )}

          {visionData.suggested_improvements && (
            <div className="ai-section">
              <div className="ai-section-title">Suggested Improvements</div>
              {Array.isArray(visionData.suggested_improvements) ? (
                <ul style={{ margin: 0, paddingLeft: '20px', color: '#22c55e' }}>
                  {visionData.suggested_improvements.map((s, i) => <li key={i} style={{ marginBottom: '6px' }}>{s}</li>)}
                </ul>
              ) : (
                <div style={{ color: '#94a3b8' }}>{visionData.suggested_improvements}</div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Standard AI Analysis */}
      {(aiLoading) && (
        <div className="ai-response">
          <div className="ai-loading"><div className="spinner"></div> AI is analyzing photo...</div>
        </div>
      )}
      {item.aiAnalysis && !aiLoading && !visionData && (
        <AIResponseDisplay content={item.aiAnalysis} title="AI Photo Analysis" />
      )}
    </div>
  );
}

export default GalleryDetail;
