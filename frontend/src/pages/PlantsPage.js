import React from 'react';
import GenericListPage from '../components/GenericListPage';

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'scientificName', label: 'Scientific Name' },
  { key: 'category', label: 'Category' },
  { key: 'sunRequirement', label: 'Sun' },
  { key: 'waterNeeds', label: 'Water' },
  { key: 'hardinessZone', label: 'Zone' },
  { key: 'price', label: 'Price', render: (v) => v ? `$${v.toFixed(2)}` : '—' },
  { key: 'status', label: 'Status', render: (v) => <span className={`status-badge status-${v}`}>{v}</span> },
];

const formFields = [
  { key: 'name', label: 'Plant Name', required: true },
  { key: 'scientificName', label: 'Scientific Name' },
  { key: 'category', label: 'Category', type: 'select', options: ['Tree', 'Shrub', 'Perennial', 'Ornamental Grass', 'Evergreen', 'Succulent', 'Annual', 'Ground Cover', 'Vine'] },
  { key: 'sunRequirement', label: 'Sun Requirement', type: 'select', options: ['Full Sun', 'Partial Shade', 'Full Shade', 'Partial Sun'] },
  { key: 'waterNeeds', label: 'Water Needs', type: 'select', options: ['Very Low', 'Low', 'Medium', 'High'] },
  { key: 'hardinessZone', label: 'Hardiness Zone' },
  { key: 'matureHeight', label: 'Mature Height' },
  { key: 'bloomSeason', label: 'Bloom Season' },
  { key: 'price', label: 'Price ($)', type: 'number' },
];

function PlantsPage() {
  return <GenericListPage title="Plants" icon="🌿" endpoint="/plants" columns={columns} formFields={formFields} defaultValues={{ status: 'active' }} />;
}

export default PlantsPage;
