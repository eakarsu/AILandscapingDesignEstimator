import React from 'react';
import GenericDetailPage from '../components/GenericDetailPage';

const fields = [
  { key: 'title', label: 'Title' },
  { key: 'projectType', label: 'Project Type' },
  { key: 'area', label: 'Area', type: 'number', render: (v) => v ? `${v.toLocaleString()} sq ft` : '—' },
  { key: 'materialType', label: 'Material Type' },
  { key: 'quantity', label: 'Quantity', type: 'number' },
  { key: 'unit', label: 'Unit' },
  { key: 'unitPrice', label: 'Unit Price', type: 'number', render: (v) => v ? `$${v}` : '—' },
  { key: 'totalCost', label: 'Total Cost', type: 'number', render: (v) => v ? `$${v.toLocaleString()}` : '—' },
  { key: 'supplier', label: 'Supplier' },
  { key: 'status', label: 'Status' },
];

function MaterialDetail() {
  return <GenericDetailPage title="Materials" icon="🧱" endpoint="/materials" fields={fields} aiField="aiEstimate" aiEndpoint="estimate" aiButtonLabel="AI Material Estimate" aiTitle="AI Material Analysis & Recommendations" listPath="/materials" />;
}

export default MaterialDetail;
