import React, { useEffect, useState } from 'react';
import api from '../../services/api';

// NON-VIZ #2: Plant/material rules editor (CRUD zones, costs)
export default function RulesEditor() {
  const [rules, setRules] = useState({ zones: [], costs: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newZone, setNewZone] = useState({ name: '', minTemp: '', maxTemp: '', region: '' });
  const [newCost, setNewCost] = useState({ material: '', unitCost: '', laborCost: '', markup: '' });

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get('/custom-views/rules');
      setRules(res.data);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const addZone = async () => {
    if (!newZone.name) return;
    await api.post('/custom-views/rules', { type: 'zone', item: { ...newZone, minTemp: parseFloat(newZone.minTemp) || 0, maxTemp: parseFloat(newZone.maxTemp) || 0 } });
    setNewZone({ name: '', minTemp: '', maxTemp: '', region: '' });
    load();
  };
  const addCost = async () => {
    if (!newCost.material) return;
    await api.post('/custom-views/rules', { type: 'cost', item: { ...newCost, unitCost: parseFloat(newCost.unitCost) || 0, laborCost: parseFloat(newCost.laborCost) || 0, markup: parseFloat(newCost.markup) || 0 } });
    setNewCost({ material: '', unitCost: '', laborCost: '', markup: '' });
    load();
  };
  const delItem = async (type, id) => {
    await api.delete(`/custom-views/rules/${type}/${id}`);
    load();
  };
  const updateCost = async (id, patch) => {
    await api.put(`/custom-views/rules/cost/${id}`, patch);
    load();
  };

  if (loading) return <div style={{ padding: 16 }}>Loading rules...</div>;
  if (error) return <div style={{ padding: 16, color: '#b91c1c' }}>Error: {error}</div>;

  const inp = { padding: 6, border: '1px solid #cbd5e1', borderRadius: 4, fontSize: 13, width: '100%' };
  const btn = { background: '#2d6a4f', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: 4, cursor: 'pointer', fontWeight: 600 };
  const delBtn = { background: '#b91c1c', color: '#fff', border: 'none', padding: '4px 10px', borderRadius: 4, cursor: 'pointer', fontSize: 12 };

  return (
    <div data-testid="rules-editor" style={{ background: '#fff', border: '1px solid #d1d5db', borderRadius: 10, padding: 20 }}>
      <h3 style={{ marginBottom: 4, color: '#1a4a2e' }}>Plant & Material Rules Editor</h3>
      <p style={{ color: '#52606d', marginBottom: 14 }}>CRUD climate zones and material cost rules used by the estimator.</p>

      <h4 style={{ marginTop: 12, color: '#1a4a2e' }}>Climate Zones ({rules.zones.length})</h4>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, marginBottom: 10 }}>
        <thead><tr style={{ background: '#f0f4f3' }}>
          <th style={{ padding: 6, textAlign: 'left' }}>Name</th>
          <th style={{ padding: 6, textAlign: 'right' }}>Min °C</th>
          <th style={{ padding: 6, textAlign: 'right' }}>Max °C</th>
          <th style={{ padding: 6, textAlign: 'left' }}>Region</th>
          <th style={{ padding: 6 }}></th>
        </tr></thead>
        <tbody>
          {rules.zones.map(z => (
            <tr key={z.id} style={{ borderBottom: '1px solid #eef2f0' }}>
              <td style={{ padding: 6 }}>{z.name}</td>
              <td style={{ padding: 6, textAlign: 'right' }}>{z.minTemp}</td>
              <td style={{ padding: 6, textAlign: 'right' }}>{z.maxTemp}</td>
              <td style={{ padding: 6 }}>{z.region}</td>
              <td style={{ padding: 6, textAlign: 'right' }}><button style={delBtn} onClick={() => delItem('zone', z.id)}>Delete</button></td>
            </tr>
          ))}
          <tr style={{ background: '#fafdfb' }}>
            <td style={{ padding: 6 }}><input style={inp} placeholder="Zone name" value={newZone.name} onChange={e => setNewZone({ ...newZone, name: e.target.value })} /></td>
            <td style={{ padding: 6 }}><input style={inp} placeholder="-20" value={newZone.minTemp} onChange={e => setNewZone({ ...newZone, minTemp: e.target.value })} /></td>
            <td style={{ padding: 6 }}><input style={inp} placeholder="-10" value={newZone.maxTemp} onChange={e => setNewZone({ ...newZone, maxTemp: e.target.value })} /></td>
            <td style={{ padding: 6 }}><input style={inp} placeholder="Region" value={newZone.region} onChange={e => setNewZone({ ...newZone, region: e.target.value })} /></td>
            <td style={{ padding: 6, textAlign: 'right' }}><button style={btn} onClick={addZone}>Add</button></td>
          </tr>
        </tbody>
      </table>

      <h4 style={{ marginTop: 18, color: '#1a4a2e' }}>Material Costs ({rules.costs.length})</h4>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead><tr style={{ background: '#f0f4f3' }}>
          <th style={{ padding: 6, textAlign: 'left' }}>Material</th>
          <th style={{ padding: 6, textAlign: 'right' }}>Unit $</th>
          <th style={{ padding: 6, textAlign: 'right' }}>Labor $</th>
          <th style={{ padding: 6, textAlign: 'right' }}>Markup</th>
          <th style={{ padding: 6 }}></th>
        </tr></thead>
        <tbody>
          {rules.costs.map(c => (
            <tr key={c.id} style={{ borderBottom: '1px solid #eef2f0' }}>
              <td style={{ padding: 6 }}>{c.material}</td>
              <td style={{ padding: 6, textAlign: 'right' }}>
                <input style={{ ...inp, width: 70, textAlign: 'right' }} defaultValue={c.unitCost}
                  onBlur={e => updateCost(c.id, { unitCost: parseFloat(e.target.value) || 0 })} />
              </td>
              <td style={{ padding: 6, textAlign: 'right' }}>{c.laborCost}</td>
              <td style={{ padding: 6, textAlign: 'right' }}>{(c.markup * 100).toFixed(0)}%</td>
              <td style={{ padding: 6, textAlign: 'right' }}><button style={delBtn} onClick={() => delItem('cost', c.id)}>Delete</button></td>
            </tr>
          ))}
          <tr style={{ background: '#fafdfb' }}>
            <td style={{ padding: 6 }}><input style={inp} placeholder="Material" value={newCost.material} onChange={e => setNewCost({ ...newCost, material: e.target.value })} /></td>
            <td style={{ padding: 6 }}><input style={inp} placeholder="0" value={newCost.unitCost} onChange={e => setNewCost({ ...newCost, unitCost: e.target.value })} /></td>
            <td style={{ padding: 6 }}><input style={inp} placeholder="0" value={newCost.laborCost} onChange={e => setNewCost({ ...newCost, laborCost: e.target.value })} /></td>
            <td style={{ padding: 6 }}><input style={inp} placeholder="0.25" value={newCost.markup} onChange={e => setNewCost({ ...newCost, markup: e.target.value })} /></td>
            <td style={{ padding: 6, textAlign: 'right' }}><button style={btn} onClick={addCost}>Add</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
