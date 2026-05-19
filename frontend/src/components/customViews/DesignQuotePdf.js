import React, { useState } from 'react';
import api from '../../services/api';

// NON-VIZ #1: Design quote PDF generator
export default function DesignQuotePdf() {
  const [projectName, setProjectName] = useState('Sunny Backyard Refresh');
  const [clientName, setClientName] = useState('Smith Residence');
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generate = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/custom-views/quote-pdf', { projectName, clientName });
      setQuote(res.data);
    } catch (e) {
      setError(e.response?.data?.error || e.message);
    } finally {
      setLoading(false);
    }
  };

  const download = () => {
    if (!quote) return;
    const blob = new Blob([quote.pdfText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${quote.quoteId}.txt`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div data-testid="design-quote-pdf" style={{ background: '#fff', border: '1px solid #d1d5db', borderRadius: 10, padding: 20 }}>
      <h3 style={{ marginBottom: 4, color: '#1a4a2e' }}>Design Quote PDF Generator</h3>
      <p style={{ color: '#52606d', marginBottom: 14 }}>Build a downloadable quote document with default line items.</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
        <label style={{ fontSize: 13 }}>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>Project name</div>
          <input value={projectName} onChange={e => setProjectName(e.target.value)}
            style={{ width: '100%', padding: 8, border: '1px solid #cbd5e1', borderRadius: 6 }} />
        </label>
        <label style={{ fontSize: 13 }}>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>Client</div>
          <input value={clientName} onChange={e => setClientName(e.target.value)}
            style={{ width: '100%', padding: 8, border: '1px solid #cbd5e1', borderRadius: 6 }} />
        </label>
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
        <button onClick={generate} disabled={loading}
          style={{ background: '#2d6a4f', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 6, fontWeight: 600, cursor: 'pointer' }}>
          {loading ? 'Generating...' : 'Generate Quote'}
        </button>
        {quote && (
          <button onClick={download}
            style={{ background: '#40916c', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 6, fontWeight: 600, cursor: 'pointer' }}>
            Download PDF (.txt)
          </button>
        )}
      </div>
      {error && <div style={{ color: '#b91c1c', marginBottom: 10 }}>{error}</div>}
      {quote && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <strong>Quote: {quote.quoteId}</strong>
            <span>Total: <strong>${quote.total.toLocaleString()}</strong> {quote.currency}</span>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#f0f4f3' }}>
                <th style={{ padding: 6, textAlign: 'left' }}>#</th>
                <th style={{ padding: 6, textAlign: 'left' }}>Description</th>
                <th style={{ padding: 6, textAlign: 'right' }}>Qty</th>
                <th style={{ padding: 6, textAlign: 'left' }}>Unit</th>
                <th style={{ padding: 6, textAlign: 'right' }}>Unit $</th>
                <th style={{ padding: 6, textAlign: 'right' }}>Line $</th>
              </tr>
            </thead>
            <tbody>
              {quote.lineItems.map(l => (
                <tr key={l.lineNo} style={{ borderBottom: '1px solid #eef2f0' }}>
                  <td style={{ padding: 6 }}>{l.lineNo}</td>
                  <td style={{ padding: 6 }}>{l.description}</td>
                  <td style={{ padding: 6, textAlign: 'right' }}>{l.qty}</td>
                  <td style={{ padding: 6 }}>{l.unit}</td>
                  <td style={{ padding: 6, textAlign: 'right' }}>${l.unitPrice}</td>
                  <td style={{ padding: 6, textAlign: 'right' }}>${l.lineTotal}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <pre style={{ background: '#0b1f17', color: '#b7e4c7', padding: 12, marginTop: 12, borderRadius: 6, fontSize: 12, overflowX: 'auto' }}>{quote.pdfText}</pre>
        </div>
      )}
    </div>
  );
}
