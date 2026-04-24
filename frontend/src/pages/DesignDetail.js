import React from 'react';
import GenericDetailPage from '../components/GenericDetailPage';

const fields = [
  { key: 'title', label: 'Title' },
  { key: 'description', label: 'Description' },
  { key: 'propertyType', label: 'Property Type', type: 'select', options: ['Residential', 'Commercial', 'Municipal', 'Estate'] },
  { key: 'squareFootage', label: 'Square Footage', type: 'number', render: (v) => v ? `${v.toLocaleString()} sq ft` : '—' },
  { key: 'style', label: 'Design Style' },
  { key: 'budget', label: 'Budget', type: 'number', render: (v) => v ? `$${v.toLocaleString()}` : '—' },
  { key: 'features', label: 'Desired Features', type: 'textarea' },
  { key: 'status', label: 'Status' },
];

function DesignDetail() {
  return <GenericDetailPage title="Designs" icon="🎨" endpoint="/designs" fields={fields} aiField="aiDesign" aiEndpoint="generate" aiButtonLabel="Generate AI Design" aiTitle="AI-Generated Landscape Design" listPath="/designs" />;
}

export default DesignDetail;
