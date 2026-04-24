import React from 'react';
import GenericListPage from '../components/GenericListPage';

const columns = [
  { key: 'title', label: 'Title' },
  { key: 'location', label: 'Location' },
  { key: 'soilType', label: 'Soil Type' },
  { key: 'phLevel', label: 'pH' },
  { key: 'nitrogenLevel', label: 'Nitrogen' },
  { key: 'drainageRating', label: 'Drainage' },
  { key: 'status', label: 'Status', render: (v) => <span className={`status-badge status-${v}`}>{v}</span> },
];

const formFields = [
  { key: 'title', label: 'Analysis Title', required: true },
  { key: 'location', label: 'Location', required: true },
  { key: 'soilType', label: 'Soil Type', type: 'select', options: ['Clay Loam', 'Sandy Loam', 'Silt Loam', 'Sandy', 'Clay', 'Loam', 'Rocky Clay', 'Muck', 'Silty Clay', 'Container Mix', 'Gravelly Loam', 'Sandy Clay Loam', 'Compacted Clay', 'Amended Loam'] },
  { key: 'phLevel', label: 'pH Level', type: 'number' },
  { key: 'nitrogenLevel', label: 'Nitrogen Level', type: 'select', options: ['Very Low', 'Low', 'Medium', 'High'] },
  { key: 'phosphorusLevel', label: 'Phosphorus Level', type: 'select', options: ['Very Low', 'Low', 'Medium', 'High'] },
  { key: 'potassiumLevel', label: 'Potassium Level', type: 'select', options: ['Very Low', 'Low', 'Medium', 'High'] },
  { key: 'organicMatter', label: 'Organic Matter (%)' },
  { key: 'drainageRating', label: 'Drainage Rating', type: 'select', options: ['Very Poor', 'Poor', 'Moderate', 'Good', 'Excellent'] },
];

function SoilPage() {
  return <GenericListPage title="Soil Analyses" icon="🔬" endpoint="/soil" columns={columns} formFields={formFields} defaultValues={{ status: 'pending' }} />;
}

export default SoilPage;
