import React from 'react';
import GenericDetailPage from '../components/GenericDetailPage';

const fields = [
  { key: 'title', label: 'Title' },
  { key: 'propertyName', label: 'Property Name' },
  { key: 'zoneCount', label: 'Zone Count', type: 'number' },
  { key: 'waterSource', label: 'Water Source' },
  { key: 'soilType', label: 'Soil Type' },
  { key: 'squareFootage', label: 'Area', type: 'number', render: (v) => v ? `${v.toLocaleString()} sq ft` : '—' },
  { key: 'currentUsageGallons', label: 'Current Usage', type: 'number', render: (v) => v ? `${v.toLocaleString()} gal/mo` : '—' },
  { key: 'targetSavingsPercent', label: 'Target Savings', type: 'number', render: (v) => v ? `${v}%` : '—' },
  { key: 'status', label: 'Status' },
];

function IrrigationDetail() {
  return <GenericDetailPage title="Irrigation" icon="💧" endpoint="/irrigation" fields={fields} aiField="aiOptimization" aiEndpoint="optimize" aiButtonLabel="Optimize with AI" aiTitle="AI Irrigation Optimization Plan" listPath="/irrigation" />;
}

export default IrrigationDetail;
