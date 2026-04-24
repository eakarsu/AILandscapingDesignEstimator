import React from 'react';
import GenericListPage from '../components/GenericListPage';

const columns = [
  { key: 'title', label: 'Title' },
  { key: 'propertyType', label: 'Property Type' },
  { key: 'style', label: 'Style' },
  { key: 'squareFootage', label: 'Sq Ft', render: (v) => v ? `${v.toLocaleString()} sq ft` : '—' },
  { key: 'budget', label: 'Budget', render: (v) => v ? `$${v.toLocaleString()}` : '—' },
  { key: 'status', label: 'Status', render: (v) => <span className={`status-badge status-${v}`}>{v}</span> },
];

const formFields = [
  { key: 'title', label: 'Design Title', required: true },
  { key: 'description', label: 'Description', type: 'textarea', required: true },
  { key: 'propertyType', label: 'Property Type', type: 'select', options: ['Residential', 'Commercial', 'Municipal', 'Estate'], required: true },
  { key: 'squareFootage', label: 'Square Footage', type: 'number' },
  { key: 'style', label: 'Design Style', type: 'select', options: ['Japanese Zen', 'Mediterranean', 'English Cottage', 'Modern Corporate', 'Tropical', 'Desert Modern', 'Farmhouse', 'Contemporary', 'Naturalistic', 'Coastal', 'French Formal'] },
  { key: 'budget', label: 'Budget ($)', type: 'number' },
  { key: 'features', label: 'Desired Features', type: 'textarea' },
];

function DesignsPage() {
  return <GenericListPage title="Designs" icon="🎨" endpoint="/designs" columns={columns} formFields={formFields} defaultValues={{ status: 'draft' }} />;
}

export default DesignsPage;
