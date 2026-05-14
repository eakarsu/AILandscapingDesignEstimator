import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import AIResponseDisplay from '../components/AIResponseDisplay';

const fields = [
  { key: 'title', label: 'Title' },
  { key: 'clientName', label: 'Client' },
  { key: 'address', label: 'Address' },
  { key: 'projectType', label: 'Project Type' },
  { key: 'startDate', label: 'Start Date', type: 'date' },
  { key: 'endDate', label: 'End Date', type: 'date' },
  { key: 'budget', label: 'Budget', type: 'number', render: (v) => v ? `$${v.toLocaleString()}` : '—' },
  { key: 'progress', label: 'Progress', type: 'number', render: (v) => `${v || 0}%` },
  { key: 'notes', label: 'Notes', type: 'textarea' },
  { key: 'status', label: 'Status', type: 'select', options: ['planning', 'in-progress', 'completed', 'on-hold'] },
];

function BidScoreGauge({ score }) {
  const color = score >= 70 ? '#22c55e' : score >= 40 ? '#f59e0b' : '#ef4444';
  const label = score >= 70 ? 'Healthy' : score >= 40 ? 'Moderate' : 'At Risk';
  return (
    <div style={{ textAlign: 'center', padding: '16px' }}>
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <svg width="120" height="60" viewBox="0 0 120 60">
          <path d="M10,60 A50,50 0 0,1 110,60" fill="none" stroke="#1e293b" strokeWidth="12" />
          <path
            d="M10,60 A50,50 0 0,1 110,60"
            fill="none"
            stroke={color}
            strokeWidth="12"
            strokeDasharray={`${(score / 100) * 157} 157`}
          />
        </svg>
        <div style={{ position: 'absolute', bottom: 0, width: '100%', textAlign: 'center', fontSize: '24px', fontWeight: 700, color }}>
          {score}
        </div>
      </div>
      <div style={{ color, fontWeight: 600, fontSize: '14px', marginTop: '4px' }}>{label}</div>
    </div>
  );
}

function Badge({ text, variant }) {
  const colors = { success: '#22c55e', warning: '#f59e0b', danger: '#ef4444', info: '#3b82f6', default: '#6b7280' };
  const color = colors[variant] || colors.default;
  return (
    <span style={{ background: `${color}20`, color, border: `1px solid ${color}40`, borderRadius: '6px', padding: '2px 10px', fontSize: '13px', fontWeight: 600, display: 'inline-block' }}>
      {text}
    </span>
  );
}

function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);

  // AI timeline
  const [aiLoading, setAiLoading] = useState(false);

  // Bid scorer
  const [bidLoading, setBidLoading] = useState(false);
  const [bidResult, setBidResult] = useState(null);

  // Plant recommendations
  const [plantLoading, setPlantLoading] = useState(false);
  const [plantResult, setPlantResult] = useState(null);
  const [showPlantForm, setShowPlantForm] = useState(false);
  const [plantRegion, setPlantRegion] = useState('');
  const [plantStartDate, setPlantStartDate] = useState('');

  useEffect(() => { fetchItem(); }, [id]);

  const fetchItem = async () => {
    try {
      const res = await api.get(`/projects/${id}`);
      setItem(res.data);
      setFormData(res.data);
    } catch (err) {
      toast.error('Failed to load project');
      navigate('/projects');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put(`/projects/${id}`, formData);
      setItem(res.data);
      setEditing(false);
      toast.success('Updated successfully!');
    } catch (err) {
      toast.error('Failed to update');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await api.delete(`/projects/${id}`);
      toast.success('Deleted successfully!');
      navigate('/projects');
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const handleAITimeline = async () => {
    setAiLoading(true);
    try {
      const res = await api.post(`/projects/${id}/timeline`);
      setItem(res.data);
      toast.success('AI Timeline generated!');
    } catch (err) {
      toast.error('AI generation failed: ' + (err.response?.data?.error || 'Unknown error'));
    } finally {
      setAiLoading(false);
    }
  };

  const handleBidScore = async () => {
    setBidLoading(true);
    setBidResult(null);
    try {
      const res = await api.post('/ai/bid-score', { projectId: parseInt(id) });
      setBidResult(res.data);
      toast.success('Bid scored!');
    } catch (err) {
      toast.error('Bid scoring failed: ' + (err.response?.data?.error || 'Unknown error'));
    } finally {
      setBidLoading(false);
    }
  };

  const handlePlantRecommend = async (e) => {
    e.preventDefault();
    if (!plantRegion) { toast.error('Region is required'); return; }
    setPlantLoading(true);
    setPlantResult(null);
    try {
      const res = await api.post('/ai/plant-recommendations', { projectId: parseInt(id), region: plantRegion, startDate: plantStartDate });
      setPlantResult(res.data);
      setShowPlantForm(false);
      toast.success('Plant recommendations ready!');
    } catch (err) {
      toast.error('Plant recommendation failed: ' + (err.response?.data?.error || 'Unknown error'));
    } finally {
      setPlantLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;
  if (!item) return null;

  const budgetFitColor = (fit) => {
    if (fit === 'match') return 'success';
    if (fit === 'under') return 'info';
    if (fit === 'over') return 'danger';
    return 'default';
  };

  return (
    <div className="detail-container">
      <Link to="/projects" className="back-link">← Back to Projects</Link>

      <div className="detail-card">
        <h2>📊 {item.title || item.name}</h2>

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
                    {field.render ? field.render(item[field.key], item) :
                      field.key === 'status' ? (
                        <span className={`status-badge status-${(item[field.key] || '').toLowerCase().replace(/\s+/g, '-')}`}>{item[field.key]}</span>
                      ) : (item[field.key] ?? '—')}
                  </div>
                </div>
              ))}
            </div>
            <div className="detail-actions" style={{ flexWrap: 'wrap', gap: '8px' }}>
              <button className="btn btn-secondary" onClick={() => setEditing(true)}>Edit</button>
              <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
              <button className="btn btn-ai" onClick={handleAITimeline} disabled={aiLoading}>
                {aiLoading ? <><span className="spinner" style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }}></span> Generating...</> : '✨ Generate AI Timeline'}
              </button>
              <button className="btn btn-ai" onClick={handleBidScore} disabled={bidLoading} style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                {bidLoading ? <><span className="spinner" style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }}></span> Scoring...</> : '🏆 Score This Bid'}
              </button>
              <button className="btn btn-ai" onClick={() => setShowPlantForm(!showPlantForm)} style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}>
                🌿 Recommend Plants
              </button>
            </div>
          </>
        )}
      </div>

      {/* Plant recommendation form */}
      {showPlantForm && (
        <div className="detail-card" style={{ marginTop: '16px' }}>
          <h3 style={{ marginBottom: '16px', color: '#22c55e' }}>🌿 Plant Recommendation</h3>
          <form onSubmit={handlePlantRecommend}>
            <div className="form-group">
              <label>Region / Climate Zone *</label>
              <input value={plantRegion} onChange={e => setPlantRegion(e.target.value)} placeholder="e.g., Pacific Northwest, USDA Zone 8b" required />
            </div>
            <div className="form-group">
              <label>Project Start Date</label>
              <input type="date" value={plantStartDate} onChange={e => setPlantStartDate(e.target.value)} />
            </div>
            <div className="detail-actions">
              <button type="submit" className="btn btn-primary" style={{ width: 'auto' }} disabled={plantLoading}>
                {plantLoading ? 'Getting Recommendations...' : 'Get Recommendations'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowPlantForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Bid Score Result */}
      {bidResult && bidResult.structured && (
        <div className="ai-response" style={{ marginTop: '16px' }}>
          <h3>🏆 Bid Health Score</h3>
          <BidScoreGauge score={bidResult.structured.bid_health_score || 0} />
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '16px', marginBottom: '16px' }}>
            {bidResult.structured.client_budget_fit && (
              <div><span style={{ color: '#94a3b8', fontSize: '12px' }}>Budget Fit: </span><Badge text={bidResult.structured.client_budget_fit.toUpperCase()} variant={budgetFitColor(bidResult.structured.client_budget_fit)} /></div>
            )}
            {bidResult.structured.labor_cost_assessment && (
              <div><span style={{ color: '#94a3b8', fontSize: '12px' }}>Labor: </span><Badge text={bidResult.structured.labor_cost_assessment} variant="info" /></div>
            )}
            {bidResult.structured.material_margin_assessment && (
              <div><span style={{ color: '#94a3b8', fontSize: '12px' }}>Materials: </span><Badge text={bidResult.structured.material_margin_assessment} variant="info" /></div>
            )}
          </div>
          {bidResult.structured.risk_factors && bidResult.structured.risk_factors.length > 0 && (
            <div className="ai-section">
              <div className="ai-section-title">Risk Factors</div>
              <ul style={{ margin: 0, paddingLeft: '20px', color: '#ef4444' }}>
                {bidResult.structured.risk_factors.map((r, i) => <li key={i} style={{ marginBottom: '4px' }}>{r}</li>)}
              </ul>
            </div>
          )}
          {bidResult.structured.recommendations && bidResult.structured.recommendations.length > 0 && (
            <div className="ai-section">
              <div className="ai-section-title">Recommendations</div>
              <ul style={{ margin: 0, paddingLeft: '20px', color: '#22c55e' }}>
                {bidResult.structured.recommendations.map((r, i) => <li key={i} style={{ marginBottom: '4px' }}>{r}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}
      {bidResult && !bidResult.structured && (
        <AIResponseDisplay content={bidResult.raw} title="Bid Score Analysis" />
      )}

      {/* Plant Recommendations Result */}
      {plantLoading && (
        <div className="ai-response" style={{ marginTop: '16px' }}>
          <div className="ai-loading"><div className="spinner"></div> Getting plant recommendations...</div>
        </div>
      )}
      {plantResult && plantResult.structured && (
        <div className="ai-response" style={{ marginTop: '16px' }}>
          <h3>🌿 Plant Recommendations</h3>
          {plantResult.structured.hardiness_zone && (
            <p style={{ color: '#94a3b8', marginBottom: '16px' }}>
              Hardiness Zone: <strong style={{ color: '#22c55e' }}>{plantResult.structured.hardiness_zone}</strong>
              {plantResult.structured.seasonal_considerations && <> — {plantResult.structured.seasonal_considerations}</>}
            </p>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '12px' }}>
            {(plantResult.structured.recommended_plants || []).map((plant, i) => (
              <div key={i} style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '12px', padding: '14px' }}>
                <div style={{ fontWeight: 700, color: '#22c55e', fontSize: '15px', marginBottom: '6px' }}>{plant.name}</div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' }}>
                  {plant.type && <Badge text={plant.type} variant="success" />}
                  {plant.bloom_season && <Badge text={plant.bloom_season} variant="info" />}
                  {plant.care_level && <Badge text={`Care: ${plant.care_level}`} variant={plant.care_level === 'Low' ? 'success' : plant.care_level === 'High' ? 'danger' : 'warning'} />}
                </div>
                {plant.hardiness_zone && <div style={{ color: '#64748b', fontSize: '12px', marginBottom: '4px' }}>Zone: {plant.hardiness_zone}</div>}
                {plant.reason && <div style={{ color: '#94a3b8', fontSize: '13px' }}>{plant.reason}</div>}
              </div>
            ))}
          </div>
        </div>
      )}
      {plantResult && !plantResult.structured && (
        <AIResponseDisplay content={plantResult.raw} title="Plant Recommendations" />
      )}

      {/* AI Timeline */}
      {aiLoading && (
        <div className="ai-response">
          <div className="ai-loading"><div className="spinner"></div> AI is generating timeline...</div>
        </div>
      )}
      {item.aiTimeline && !aiLoading && (
        <AIResponseDisplay content={item.aiTimeline} title="AI Project Timeline & Milestones" />
      )}
    </div>
  );
}

export default ProjectDetail;
