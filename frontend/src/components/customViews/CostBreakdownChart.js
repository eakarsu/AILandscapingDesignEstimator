import React, { useEffect, useState } from 'react';
import api from '../../services/api';

// VIZ #1: SVG horizontal bar + donut showing project cost breakdown
export default function CostBreakdownChart() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    api.get('/custom-views/cost-breakdown')
      .then(res => { if (mounted) { setData(res.data); setLoading(false); } })
      .catch(e => { if (mounted) { setError(e.message); setLoading(false); } });
    return () => { mounted = false; };
  }, []);

  if (loading) return <div style={{ padding: 16 }}>Loading cost breakdown...</div>;
  if (error) return <div style={{ padding: 16, color: '#b91c1c' }}>Error: {error}</div>;
  if (!data) return null;

  const max = Math.max(...data.breakdown.map(b => b.amount));
  // Build donut path slices
  let cumulative = 0;
  const cx = 90, cy = 90, r = 70, inner = 42;
  const slices = data.breakdown.map((b) => {
    const start = cumulative * 2 * Math.PI;
    cumulative += b.percent;
    const end = cumulative * 2 * Math.PI;
    const x1 = cx + r * Math.sin(start), y1 = cy - r * Math.cos(start);
    const x2 = cx + r * Math.sin(end),   y2 = cy - r * Math.cos(end);
    const xi1 = cx + inner * Math.sin(end),   yi1 = cy - inner * Math.cos(end);
    const xi2 = cx + inner * Math.sin(start), yi2 = cy - inner * Math.cos(start);
    const large = (end - start) > Math.PI ? 1 : 0;
    return { ...b, d: `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} L ${xi1} ${yi1} A ${inner} ${inner} 0 ${large} 0 ${xi2} ${yi2} Z` };
  });

  return (
    <div data-testid="cost-breakdown-chart" style={{ background: '#fff', border: '1px solid #d1d5db', borderRadius: 10, padding: 20 }}>
      <h3 style={{ marginBottom: 4, color: '#1a4a2e' }}>Project Cost Breakdown</h3>
      <p style={{ color: '#52606d', marginBottom: 14 }}>{data.project} - Total: ${data.total.toLocaleString()} {data.currency}</p>
      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 24, alignItems: 'center' }}>
        <svg width={180} height={180} viewBox="0 0 180 180" aria-label="Cost donut chart">
          {slices.map((s, i) => <path key={i} d={s.d} fill={s.color} stroke="#fff" strokeWidth="1.5" />)}
          <text x={90} y={88} textAnchor="middle" fontSize="14" fontWeight="600" fill="#1a4a2e">${(data.total/1000).toFixed(1)}k</text>
          <text x={90} y={104} textAnchor="middle" fontSize="9" fill="#52606d">Total</text>
        </svg>
        <div>
          {data.breakdown.map((b) => (
            <div key={b.category} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 7 }}>
              <div style={{ width: 12, height: 12, background: b.color, borderRadius: 2 }} />
              <div style={{ width: 140, fontSize: 13, color: '#1a2e1a' }}>{b.category}</div>
              <div style={{ flex: 1, background: '#eef2f0', borderRadius: 4, height: 14, overflow: 'hidden' }}>
                <div style={{ width: `${(b.amount/max)*100}%`, background: b.color, height: '100%' }} />
              </div>
              <div style={{ width: 80, textAlign: 'right', fontSize: 13, fontWeight: 600 }}>${b.amount.toLocaleString()}</div>
              <div style={{ width: 44, textAlign: 'right', fontSize: 12, color: '#52606d' }}>{(b.percent*100).toFixed(0)}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
