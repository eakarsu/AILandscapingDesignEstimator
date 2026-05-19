import React, { useEffect, useState } from 'react';
import api from '../../services/api';

// VIZ #2: plant x climate zone heatmap
function colorFor(score) {
  // 0 (red) -> 50 (yellow) -> 100 (green)
  if (score >= 50) {
    const t = (score - 50) / 50;
    const r = Math.round(255 * (1 - t) + 45 * t);
    const g = Math.round(200 * (1 - t) + 150 * t);
    const b = Math.round(80 * (1 - t) + 80 * t);
    return `rgb(${r},${g},${b})`;
  } else {
    const t = score / 50;
    const r = Math.round(220 * (1 - t) + 255 * t);
    const g = Math.round(70 * (1 - t) + 200 * t);
    const b = Math.round(70 * (1 - t) + 80 * t);
    return `rgb(${r},${g},${b})`;
  }
}

export default function ZoneSuitabilityHeatmap() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    api.get('/custom-views/zone-suitability')
      .then(res => { if (mounted) { setData(res.data); setLoading(false); } })
      .catch(e => { if (mounted) { setError(e.message); setLoading(false); } });
    return () => { mounted = false; };
  }, []);

  if (loading) return <div style={{ padding: 16 }}>Loading heatmap...</div>;
  if (error) return <div style={{ padding: 16, color: '#b91c1c' }}>Error: {error}</div>;
  if (!data) return null;

  return (
    <div data-testid="zone-suitability-heatmap" style={{ background: '#fff', border: '1px solid #d1d5db', borderRadius: 10, padding: 20 }}>
      <h3 style={{ marginBottom: 4, color: '#1a4a2e' }}>Plant Zone Suitability Heatmap</h3>
      <p style={{ color: '#52606d', marginBottom: 14 }}>Suitability score (0-100) per plant across USDA hardiness zones</p>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '8px 10px', borderBottom: '2px solid #1a4a2e', color: '#1a4a2e' }}>Plant</th>
              {data.zones.map(z => (
                <th key={z} style={{ padding: '8px 10px', borderBottom: '2px solid #1a4a2e', color: '#1a4a2e' }}>Zone {z}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.plants.map((p, ri) => (
              <tr key={p}>
                <td style={{ padding: '6px 10px', fontWeight: 600 }}>{p}</td>
                {data.matrix[ri].map((v, ci) => (
                  <td key={ci} style={{ padding: 0 }}>
                    <div style={{
                      background: colorFor(v),
                      color: v > 60 ? '#1a2e1a' : '#fff',
                      padding: '12px 6px',
                      textAlign: 'center',
                      fontWeight: 600,
                      fontSize: 13,
                      border: '1px solid #fff',
                    }}>{v}</div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 14, fontSize: 12 }}>
        <span>Low</span>
        <div style={{ flex: 1, height: 10, background: 'linear-gradient(to right, rgb(220,70,70), rgb(255,200,80), rgb(45,150,80))', borderRadius: 4 }} />
        <span>High</span>
      </div>
    </div>
  );
}
