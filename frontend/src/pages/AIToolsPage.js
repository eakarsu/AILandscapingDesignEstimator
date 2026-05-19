import React, { useState } from 'react';
import api from '../services/api';

const TOOLS = [
  {
    key: 'design-feasibility',
    label: 'Design Feasibility Check',
    icon: '🧭',
    endpoint: '/ai/design-feasibility-check',
    description: 'Validate a design against budget constraints.',
    fields: [
      { key: 'projectId', label: 'Project ID', type: 'text', required: true },
      { key: 'budget', label: 'Budget ($)', type: 'number' },
      { key: 'designSummary', label: 'Design Summary', type: 'textarea' },
    ],
  },
  {
    key: 'maintenance-cost-projector',
    label: 'Maintenance Cost Projector',
    icon: '🛠️',
    endpoint: '/ai/maintenance-cost-projector',
    description: 'Project multi-year maintenance cost from region/size/plan.',
    fields: [
      { key: 'region', label: 'Region', type: 'text' },
      { key: 'sizeSqFt', label: 'Size (sq ft)', type: 'number' },
      { key: 'planSummary', label: 'Plan Summary', type: 'textarea' },
      { key: 'years', label: 'Years to Project', type: 'number', placeholder: '5' },
    ],
  },
  {
    key: 'crew-skill-matcher',
    label: 'Crew Skill Matcher',
    icon: '👷',
    endpoint: '/ai/crew-skill-matcher',
    description: 'Match crew expertise to project needs and flag skill gaps.',
    fields: [
      { key: 'projectId', label: 'Project ID (optional)', type: 'text' },
      { key: 'projectNeeds', label: 'Project Needs', type: 'textarea' },
      { key: 'crewProfiles', label: 'Crew Profiles (JSON)', type: 'textarea',
        placeholder: '[{"crewId":1,"name":"Team A","skills":["irrigation","stonework"]}]' },
    ],
  },
  {
    key: 'seasonal-demand-forecast',
    label: 'Seasonal Demand Forecast',
    icon: '📅',
    endpoint: '/ai/seasonal-demand-forecast',
    description: 'Predict project volume by quarter for the next horizon.',
    fields: [
      { key: 'region', label: 'Region', type: 'text' },
      { key: 'historicalSummary', label: 'Historical Summary', type: 'textarea' },
      { key: 'marketConditions', label: 'Market Conditions', type: 'textarea' },
      { key: 'horizonQuarters', label: 'Horizon (quarters)', type: 'number', placeholder: '4' },
    ],
  },
  {
    key: 'material-price-monitor',
    label: 'Material Price Monitor',
    icon: '📈',
    endpoint: '/ai/material-price-monitor',
    description: 'Flag material cost inflation and suggest alternatives.',
    fields: [
      { key: 'region', label: 'Region', type: 'text' },
      { key: 'materials', label: 'Materials (JSON or text)', type: 'textarea', required: true,
        placeholder: '[{"name":"mulch","unit_cost":4.5},{"name":"river rock","unit_cost":12}]' },
      { key: 'recentQuotes', label: 'Recent Quotes (JSON or text)', type: 'textarea' },
    ],
  },
];

function AIToolsPage() {
  const [active, setActive] = useState(TOOLS[0].key);
  const [inputs, setInputs] = useState({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const tool = TOOLS.find(t => t.key === active);

  const handleChange = (key, value) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };

  const submit = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const payload = {};
      tool.fields.forEach(f => {
        const v = inputs[f.key];
        if (v === undefined || v === '') return;
        if (f.type === 'number') {
          payload[f.key] = Number(v);
        } else if (f.type === 'textarea') {
          try { payload[f.key] = JSON.parse(v); } catch { payload[f.key] = v; }
        } else {
          payload[f.key] = v;
        }
      });
      const res = await api.post(tool.endpoint, payload);
      setResult(res.data);
    } catch (e) {
      setError(e?.response?.data?.error || e?.response?.data?.message || e.message || 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>✨ AI Tools</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px', marginBottom: '24px' }}>
        {TOOLS.map(t => (
          <div
            key={t.key}
            onClick={() => { setActive(t.key); setInputs({}); setResult(null); setError(null); }}
            style={{
              padding: '16px',
              background: active === t.key ? '#2d6a4f' : '#f8faf8',
              color: active === t.key ? 'white' : '#1a4a2e',
              borderRadius: '8px',
              cursor: 'pointer',
              border: '1px solid #d4e5d4',
            }}
          >
            <div style={{ fontSize: '24px' }}>{t.icon}</div>
            <div style={{ fontSize: '14px', fontWeight: 600, marginTop: '4px' }}>{t.label}</div>
            <div style={{ fontSize: '12px', marginTop: '4px', opacity: 0.85 }}>{t.description}</div>
          </div>
        ))}
      </div>

      <div className="detail-card" style={{ maxWidth: '720px' }}>
        <h2>{tool.icon} {tool.label}</h2>
        <p style={{ color: '#6b7c6b', marginBottom: '16px' }}>{tool.description}</p>

        {tool.fields.map(field => (
          <div className="form-group" key={field.key}>
            <label>{field.label}{field.required ? ' *' : ''}</label>
            {field.type === 'textarea' ? (
              <textarea
                rows={4}
                value={inputs[field.key] || ''}
                onChange={e => handleChange(field.key, e.target.value)}
                placeholder={field.placeholder || ''}
              />
            ) : (
              <input
                type={field.type || 'text'}
                value={inputs[field.key] || ''}
                onChange={e => handleChange(field.key, e.target.value)}
                placeholder={field.placeholder || ''}
              />
            )}
          </div>
        ))}

        <button
          className="btn btn-primary"
          onClick={submit}
          disabled={loading}
          style={{ width: '100%', marginTop: '12px', padding: '12px', fontSize: '16px' }}
        >
          {loading ? 'Running…' : 'Run AI Tool'}
        </button>

        {error && (
          <div style={{ marginTop: '16px', padding: '12px', background: '#fdecea', border: '1px solid #f5c2c0', color: '#a94442', borderRadius: '6px' }}>
            {String(error)}
          </div>
        )}

        {result && (
          <div style={{ marginTop: '20px', padding: '20px', background: '#f0f4f3', borderRadius: '8px', border: '1px solid #d4e5d4' }}>
            <h3 style={{ color: '#2d6a4f', marginBottom: '12px' }}>Result</h3>
            <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0, fontSize: '13px' }}>
              {typeof result === 'string' ? result : JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default AIToolsPage;
