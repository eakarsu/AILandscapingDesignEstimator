import React, { useState } from 'react';

const calculators = [
  { key: 'area', label: 'Area Calculator', icon: '📐' },
  { key: 'mulch', label: 'Mulch Calculator', icon: '🪵' },
  { key: 'sod', label: 'Sod Calculator', icon: '🌱' },
  { key: 'gravel', label: 'Gravel/Stone Calculator', icon: '🪨' },
  { key: 'fence', label: 'Fence Calculator', icon: '🏗️' },
  { key: 'paver', label: 'Paver Calculator', icon: '🧱' },
];

function CalculatorPage() {
  const [active, setActive] = useState('area');
  const [inputs, setInputs] = useState({});
  const [result, setResult] = useState(null);

  const handleInput = (key, value) => setInputs(prev => ({ ...prev, [key]: parseFloat(value) || 0 }));

  const calculate = () => {
    const { length, width, depth, height, spacing, postSize } = inputs;
    let res = {};

    switch (active) {
      case 'area':
        const sqFt = (length || 0) * (width || 0);
        res = {
          'Square Feet': sqFt.toFixed(1),
          'Square Yards': (sqFt / 9).toFixed(1),
          'Acres': (sqFt / 43560).toFixed(4),
          'Square Meters': (sqFt * 0.0929).toFixed(1),
        };
        break;
      case 'mulch':
        const mulchSqFt = (length || 0) * (width || 0);
        const depthFt = (depth || 3) / 12;
        const cubicFt = mulchSqFt * depthFt;
        const cubicYards = cubicFt / 27;
        res = {
          'Area (sq ft)': mulchSqFt.toFixed(1),
          'Cubic Feet': cubicFt.toFixed(1),
          'Cubic Yards': cubicYards.toFixed(2),
          'Bags (2 cu ft)': Math.ceil(cubicFt / 2),
          'Estimated Cost ($40/yd)': '$' + (cubicYards * 40).toFixed(2),
        };
        break;
      case 'sod':
        const sodSqFt = (length || 0) * (width || 0);
        const pallets = sodSqFt / 450;
        res = {
          'Square Feet': sodSqFt.toFixed(1),
          'Rolls (10 sq ft)': Math.ceil(sodSqFt / 10),
          'Pallets (450 sq ft)': pallets.toFixed(2),
          'Add 5% waste': Math.ceil(sodSqFt * 1.05 / 10) + ' rolls',
          'Estimated Cost ($0.45/sqft)': '$' + (sodSqFt * 0.45).toFixed(2),
        };
        break;
      case 'gravel':
        const gravelSqFt = (length || 0) * (width || 0);
        const gravelDepthFt = (depth || 2) / 12;
        const gravelCuFt = gravelSqFt * gravelDepthFt;
        const gravelCuYd = gravelCuFt / 27;
        const tons = gravelCuYd * 1.4;
        res = {
          'Area (sq ft)': gravelSqFt.toFixed(1),
          'Cubic Yards': gravelCuYd.toFixed(2),
          'Tons (approx)': tons.toFixed(2),
          'Estimated Cost ($50/ton)': '$' + (tons * 50).toFixed(2),
        };
        break;
      case 'fence':
        const perimeter = 2 * ((length || 0) + (width || 0));
        const postSpacing = spacing || 8;
        const posts = Math.ceil(perimeter / postSpacing) + 1;
        const rails = Math.ceil(perimeter / 8) * 3;
        const pickets = Math.ceil(perimeter / 0.5);
        res = {
          'Perimeter (ft)': perimeter.toFixed(1),
          'Posts Needed': posts,
          'Rails (8ft)': rails,
          'Pickets (6in wide)': pickets,
          'Post Holes': posts,
          'Estimated Cost ($15/ft)': '$' + (perimeter * 15).toFixed(2),
        };
        break;
      case 'paver':
        const paverSqFt = (length || 0) * (width || 0);
        const paverSize = postSize || 1;
        const paversNeeded = Math.ceil(paverSqFt / (paverSize * paverSize));
        const sandBase = paverSqFt * (1 / 12) / 27;
        res = {
          'Area (sq ft)': paverSqFt.toFixed(1),
          'Pavers Needed': Math.ceil(paversNeeded * 1.1) + ' (incl. 10% waste)',
          'Sand Base (cu yd)': sandBase.toFixed(2),
          'Edge Restraint (ft)': (2 * ((length || 0) + (width || 0))).toFixed(1),
          'Estimated Cost ($8/sqft)': '$' + (paverSqFt * 8).toFixed(2),
        };
        break;
      default:
        break;
    }
    setResult(res);
  };

  const getInputFields = () => {
    switch (active) {
      case 'area':
        return [
          { key: 'length', label: 'Length (ft)' },
          { key: 'width', label: 'Width (ft)' },
        ];
      case 'mulch':
        return [
          { key: 'length', label: 'Length (ft)' },
          { key: 'width', label: 'Width (ft)' },
          { key: 'depth', label: 'Depth (inches)', placeholder: '3' },
        ];
      case 'sod':
        return [
          { key: 'length', label: 'Length (ft)' },
          { key: 'width', label: 'Width (ft)' },
        ];
      case 'gravel':
        return [
          { key: 'length', label: 'Length (ft)' },
          { key: 'width', label: 'Width (ft)' },
          { key: 'depth', label: 'Depth (inches)', placeholder: '2' },
        ];
      case 'fence':
        return [
          { key: 'length', label: 'Length of Property (ft)' },
          { key: 'width', label: 'Width of Property (ft)' },
          { key: 'spacing', label: 'Post Spacing (ft)', placeholder: '8' },
        ];
      case 'paver':
        return [
          { key: 'length', label: 'Length (ft)' },
          { key: 'width', label: 'Width (ft)' },
          { key: 'postSize', label: 'Paver Size (ft)', placeholder: '1' },
        ];
      default:
        return [];
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>🧮 Measurement Calculator</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px', marginBottom: '24px' }}>
        {calculators.map(c => (
          <div
            key={c.key}
            onClick={() => { setActive(c.key); setInputs({}); setResult(null); }}
            style={{
              padding: '16px',
              background: active === c.key ? '#2d6a4f' : '#f8faf8',
              color: active === c.key ? 'white' : '#1a4a2e',
              borderRadius: '8px',
              cursor: 'pointer',
              textAlign: 'center',
              border: '1px solid #d4e5d4',
              transition: 'all 0.2s'
            }}
          >
            <div style={{ fontSize: '24px' }}>{c.icon}</div>
            <div style={{ fontSize: '13px', fontWeight: 600, marginTop: '4px' }}>{c.label}</div>
          </div>
        ))}
      </div>

      <div className="detail-card" style={{ maxWidth: '600px' }}>
        <h2>{calculators.find(c => c.key === active)?.icon} {calculators.find(c => c.key === active)?.label}</h2>

        {getInputFields().map(field => (
          <div className="form-group" key={field.key}>
            <label>{field.label}</label>
            <input
              type="number"
              value={inputs[field.key] || ''}
              onChange={e => handleInput(field.key, e.target.value)}
              placeholder={field.placeholder || '0'}
              style={{ fontSize: '16px' }}
            />
          </div>
        ))}

        <button className="btn btn-primary" onClick={calculate} style={{ width: '100%', marginTop: '12px', padding: '12px', fontSize: '16px' }}>
          Calculate
        </button>

        {result && (
          <div style={{ marginTop: '20px', padding: '20px', background: '#f0f4f3', borderRadius: '8px', border: '1px solid #d4e5d4' }}>
            <h3 style={{ color: '#2d6a4f', marginBottom: '12px' }}>Results</h3>
            {Object.entries(result).map(([label, value]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #d4e5d4' }}>
                <span style={{ color: '#6b7c6b' }}>{label}</span>
                <span style={{ fontWeight: 600, color: '#1a4a2e' }}>{value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CalculatorPage;
