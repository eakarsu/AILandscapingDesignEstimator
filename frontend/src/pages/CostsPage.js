import React from 'react';
import GenericListPage from '../components/GenericListPage';

const columns = [
  { key: 'title', label: 'Title' },
  { key: 'projectType', label: 'Project Type' },
  { key: 'clientName', label: 'Client' },
  { key: 'laborCost', label: 'Labor', render: (v) => v ? `$${v.toLocaleString()}` : '—' },
  { key: 'materialCost', label: 'Materials', render: (v) => v ? `$${v.toLocaleString()}` : '—' },
  { key: 'totalEstimate', label: 'Total', render: (v) => v ? `$${v.toLocaleString()}` : '—' },
  { key: 'status', label: 'Status', render: (v) => <span className={`status-badge status-${v}`}>{v}</span> },
];

const formFields = [
  { key: 'title', label: 'Estimate Title', required: true },
  { key: 'projectType', label: 'Project Type', type: 'select', options: ['Hardscaping', 'Lawn Care', 'Structural', 'Electrical', 'Irrigation', 'Planting', 'Construction', 'Drainage', 'Structure', 'Maintenance', 'Fencing', 'Water Feature', 'Bed Work', 'Lawn', 'Design & Install'] },
  { key: 'clientName', label: 'Client Name', required: true },
  { key: 'laborCost', label: 'Labor Cost ($)', type: 'number' },
  { key: 'materialCost', label: 'Material Cost ($)', type: 'number' },
  { key: 'equipmentCost', label: 'Equipment Cost ($)', type: 'number' },
  { key: 'overheadPercent', label: 'Overhead (%)', type: 'number' },
  { key: 'profitMarginPercent', label: 'Profit Margin (%)', type: 'number' },
  { key: 'totalEstimate', label: 'Total Estimate ($)', type: 'number' },
];

function CostsPage() {
  return <GenericListPage title="Cost Estimates" icon="💰" endpoint="/costs" columns={columns} formFields={formFields} defaultValues={{ status: 'draft' }} />;
}

export default CostsPage;
