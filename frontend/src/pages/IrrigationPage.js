import React from 'react';
import GenericListPage from '../components/GenericListPage';

const columns = [
  { key: 'title', label: 'Title' },
  { key: 'propertyName', label: 'Property' },
  { key: 'zoneCount', label: 'Zones' },
  { key: 'waterSource', label: 'Water Source' },
  { key: 'soilType', label: 'Soil Type' },
  { key: 'currentUsageGallons', label: 'Usage (gal/mo)', render: (v) => v ? v.toLocaleString() : '—' },
  { key: 'targetSavingsPercent', label: 'Target Savings', render: (v) => v ? `${v}%` : '—' },
  { key: 'status', label: 'Status', render: (v) => <span className={`status-badge status-${v}`}>{v}</span> },
];

const formFields = [
  { key: 'title', label: 'Plan Title', required: true },
  { key: 'propertyName', label: 'Property Name', required: true },
  { key: 'zoneCount', label: 'Number of Zones', type: 'number' },
  { key: 'waterSource', label: 'Water Source', type: 'select', options: ['Municipal', 'Well', 'Rainwater', 'Rainwater + Municipal'] },
  { key: 'soilType', label: 'Soil Type', type: 'select', options: ['Loam', 'Sandy Loam', 'Clay', 'Sandy', 'Silt Loam', 'Clay Loam', 'Container Mix', 'Rocky Clay'] },
  { key: 'squareFootage', label: 'Area (sq ft)', type: 'number' },
  { key: 'currentUsageGallons', label: 'Current Usage (gallons/month)', type: 'number' },
  { key: 'targetSavingsPercent', label: 'Target Savings (%)', type: 'number' },
];

function IrrigationPage() {
  return <GenericListPage title="Irrigation Plans" icon="💧" endpoint="/irrigation" columns={columns} formFields={formFields} defaultValues={{ status: 'draft' }} />;
}

export default IrrigationPage;
