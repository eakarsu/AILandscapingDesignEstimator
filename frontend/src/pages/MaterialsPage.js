import React from 'react';
import GenericListPage from '../components/GenericListPage';

const columns = [
  { key: 'title', label: 'Title' },
  { key: 'projectType', label: 'Project Type' },
  { key: 'materialType', label: 'Material' },
  { key: 'quantity', label: 'Quantity', render: (v, item) => v ? `${v} ${item.unit || ''}` : '—' },
  { key: 'totalCost', label: 'Total Cost', render: (v) => v ? `$${v.toLocaleString()}` : '—' },
  { key: 'supplier', label: 'Supplier' },
  { key: 'status', label: 'Status', render: (v) => <span className={`status-badge status-${v}`}>{v}</span> },
];

const formFields = [
  { key: 'title', label: 'Estimate Title', required: true },
  { key: 'projectType', label: 'Project Type', type: 'select', options: ['Hardscaping', 'Pathway', 'Fencing', 'Soil Work', 'Retaining Wall', 'Lighting', 'Irrigation', 'Mulching', 'Decorative', 'Lawn', 'Decking', 'Water Feature', 'Structure', 'Ground Cover', 'Outdoor Kitchen'] },
  { key: 'area', label: 'Area (sq ft)', type: 'number' },
  { key: 'materialType', label: 'Material Type', required: true },
  { key: 'quantity', label: 'Quantity', type: 'number' },
  { key: 'unit', label: 'Unit', type: 'select', options: ['sq ft', 'tons', 'boards', 'cubic yards', 'blocks', 'fixtures', 'feet', 'kit', 'bags'] },
  { key: 'unitPrice', label: 'Unit Price ($)', type: 'number' },
  { key: 'supplier', label: 'Supplier' },
];

function MaterialsPage() {
  return <GenericListPage title="Material Estimates" icon="🧱" endpoint="/materials" columns={columns} formFields={formFields} defaultValues={{ status: 'estimated' }} />;
}

export default MaterialsPage;
