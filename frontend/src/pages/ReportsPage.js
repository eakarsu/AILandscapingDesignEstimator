import React, { useState, useEffect } from 'react';
import api from '../services/api';

function ReportsPage() {
  const [data, setData] = useState({
    projects: [], invoices: [], expenses: [], timeEntries: [],
    equipment: [], clients: [], crews: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const endpoints = {
      projects: '/projects',
      invoices: '/invoices',
      expenses: '/expenses',
      timeEntries: '/time-entries',
      equipment: '/equipment',
      clients: '/clients',
      crews: '/crews',
    };
    Promise.all(
      Object.entries(endpoints).map(async ([key, ep]) => {
        try {
          const res = await api.get(ep);
          return [key, res.data];
        } catch {
          return [key, []];
        }
      })
    ).then(results => {
      const obj = {};
      results.forEach(([k, v]) => { obj[k] = v; });
      setData(obj);
      setLoading(false);
    });
  }, []);

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading reports...</div>;

  const totalRevenue = data.invoices.reduce((s, i) => s + (i.amount || i.totalAmount || 0), 0);
  const totalExpenses = data.expenses.reduce((s, e) => s + (e.amount || 0), 0);
  const totalHours = data.timeEntries.reduce((s, t) => s + (t.hoursWorked || 0), 0);
  const activeProjects = data.projects.filter(p => p.status === 'active' || p.status === 'in-progress' || p.status === 'In Progress').length;
  const activeClients = data.clients.filter(c => c.status === 'active').length;
  const profit = totalRevenue - totalExpenses;

  const expenseByCategory = {};
  data.expenses.forEach(e => {
    expenseByCategory[e.category || 'Other'] = (expenseByCategory[e.category || 'Other'] || 0) + (e.amount || 0);
  });

  const hoursByWorker = {};
  data.timeEntries.forEach(t => {
    hoursByWorker[t.workerName || 'Unknown'] = (hoursByWorker[t.workerName || 'Unknown'] || 0) + (t.hoursWorked || 0);
  });

  const projectsByStatus = {};
  data.projects.forEach(p => {
    projectsByStatus[p.status || 'Unknown'] = (projectsByStatus[p.status || 'Unknown'] || 0) + 1;
  });

  const StatCard = ({ icon, label, value, color }) => (
    <div style={{
      background: 'white', borderRadius: '12px', padding: '20px',
      border: '1px solid #d4e5d4', textAlign: 'center'
    }}>
      <div style={{ fontSize: '28px', marginBottom: '8px' }}>{icon}</div>
      <div style={{ fontSize: '24px', fontWeight: 700, color: color || '#2d6a4f' }}>{value}</div>
      <div style={{ fontSize: '13px', color: '#6b7c6b', marginTop: '4px' }}>{label}</div>
    </div>
  );

  const BreakdownTable = ({ title, icon, data: tableData, valuePrefix = '' }) => (
    <div style={{ background: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #d4e5d4' }}>
      <h3 style={{ color: '#1a4a2e', marginBottom: '12px' }}>{icon} {title}</h3>
      {Object.keys(tableData).length === 0 ? (
        <p style={{ color: '#6b7c6b', textAlign: 'center' }}>No data yet</p>
      ) : (
        Object.entries(tableData)
          .sort((a, b) => b[1] - a[1])
          .map(([key, val]) => (
            <div key={key} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f0f4f3' }}>
              <span>{key}</span>
              <span style={{ fontWeight: 600, color: '#2d6a4f' }}>{valuePrefix}{typeof val === 'number' ? val.toLocaleString(undefined, { maximumFractionDigits: 1 }) : val}</span>
            </div>
          ))
      )}
    </div>
  );

  return (
    <div>
      <div className="page-header">
        <h1>📊 Business Reports</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <StatCard icon="💰" label="Total Revenue" value={`$${totalRevenue.toLocaleString()}`} />
        <StatCard icon="💵" label="Total Expenses" value={`$${totalExpenses.toLocaleString()}`} color="#d32f2f" />
        <StatCard icon="📈" label="Net Profit" value={`$${profit.toLocaleString()}`} color={profit >= 0 ? '#2d6a4f' : '#d32f2f'} />
        <StatCard icon="⏱️" label="Total Hours" value={`${totalHours.toFixed(1)}h`} />
        <StatCard icon="📊" label="Active Projects" value={activeProjects} />
        <StatCard icon="👥" label="Active Clients" value={activeClients} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '16px' }}>
        <BreakdownTable title="Expenses by Category" icon="💵" data={expenseByCategory} valuePrefix="$" />
        <BreakdownTable title="Hours by Worker" icon="⏱️" data={hoursByWorker} valuePrefix="" />
        <BreakdownTable title="Projects by Status" icon="📊" data={projectsByStatus} />
      </div>
    </div>
  );
}

export default ReportsPage;
