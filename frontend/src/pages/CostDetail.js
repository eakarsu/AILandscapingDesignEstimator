import React from 'react';
import GenericDetailPage from '../components/GenericDetailPage';

const fields = [
  { key: 'title', label: 'Title' },
  { key: 'projectType', label: 'Project Type' },
  { key: 'clientName', label: 'Client' },
  { key: 'laborCost', label: 'Labor Cost', type: 'number', render: (v) => v ? `$${v.toLocaleString()}` : '—' },
  { key: 'materialCost', label: 'Material Cost', type: 'number', render: (v) => v ? `$${v.toLocaleString()}` : '—' },
  { key: 'equipmentCost', label: 'Equipment Cost', type: 'number', render: (v) => v ? `$${v.toLocaleString()}` : '—' },
  { key: 'overheadPercent', label: 'Overhead', type: 'number', render: (v) => v ? `${v}%` : '—' },
  { key: 'profitMarginPercent', label: 'Profit Margin', type: 'number', render: (v) => v ? `${v}%` : '—' },
  { key: 'totalEstimate', label: 'Total Estimate', type: 'number', render: (v) => v ? `$${v.toLocaleString()}` : '—' },
  { key: 'status', label: 'Status' },
];

function CostDetail() {
  return <GenericDetailPage title="Costs" icon="💰" endpoint="/costs" fields={fields} aiField="aiBreakdown" aiEndpoint="analyze" aiButtonLabel="AI Cost Analysis" aiTitle="AI Cost Breakdown & Optimization" listPath="/costs" />;
}

export default CostDetail;
